import { useState } from "react";
import Groq from "groq-sdk";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const groq = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });

export const useGroqService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateTimeBasedRecommendations = async (hoursLeft, subject) => {
    setLoading(true);
    setError(null);

    try {
      // Construct dynamic prompt based on time left
      const prompt = `Generate exactly 3 personalized study recommendation cards for a student who has ${hoursLeft} hours left before their ${subject} exam. 
Each card should have:
- A concise title (e.g., "48 Hours Left", "24 Hours Left", "12 Hours Left").
- A short and focused strategy with 3-4 bullet points.
- No extra text or explanation outside of these 3 cards.
- Format your response as a valid JSON array of objects where each object has 'title' and 'strategy' keys.
- The strategy key should contain an array of strings (the bullet points).
- The recommendations should be practical and actionable, focusing on the most effective last-minute preparation techniques.
- Return ONLY the JSON array with no additional text or explanation.`;

      // Make API request to Groq
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false,
      });

      // Extract response text
      const responseText = chatCompletion.choices?.[0]?.message?.content || "[]";
      
      // Log the raw response for debugging
      console.log("Raw API response:", responseText);
      
      // Parse the JSON response
      try {
        // Try to extract JSON from the response if it contains additional text
        let jsonString = responseText;
        const jsonStart = responseText.indexOf('[');
        const jsonEnd = responseText.lastIndexOf(']') + 1;
        
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
          jsonString = responseText.substring(jsonStart, jsonEnd);
        }
        
        const parsedResponse = JSON.parse(jsonString);
        
        // Ensure the response is formatted correctly
        if (!Array.isArray(parsedResponse) || parsedResponse.length === 0) {
          throw new Error("Response is not a valid array");
        }
        
        // Create the expected structure
        return {
          title: `${hoursLeft} Hour${hoursLeft !== 1 ? 's' : ''} Exam Preparation Plan`,
          cards: parsedResponse.map(card => ({
            icon: getIconForTimeframe(card.title),
            title: card.title,
            items: card.strategy
          }))
        };
      } catch (parseError) {
        console.error("Failed to parse API response:", parseError);
        throw new Error("Invalid JSON response from the API");
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to generate recommendations. Please try again.");
      setLoading(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to assign icons based on timeframe
  const getIconForTimeframe = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("48") || lowerTitle.includes("day")) return "book";
    if (lowerTitle.includes("24") || lowerTitle.includes("hour")) return "brain"; 
    if (lowerTitle.includes("12") || lowerTitle.includes("last")) return "clock";
    return "trophy"; // default icon
  };

  return {
    generateTimeBasedRecommendations,
    loading,
    error,
  };
};