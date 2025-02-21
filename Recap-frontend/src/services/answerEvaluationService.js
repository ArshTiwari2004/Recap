import { Groq } from "groq-sdk";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const groq = new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

// Helper function to format score
const formatScore = (score) => Number(score.toFixed(1));

export const evaluateAnswer = async (question, studentAnswer) => {
  try {
    const prompt = `
You are an expert educational evaluator for Class 12 PCM (Physics, Chemistry, Mathematics) subjects in India.

QUESTION:
${question.question}
[Subject: ${question.subject}, Topic: ${question.weakTopics.join(", ")}, Marks: ${question.marks}]

STUDENT ANSWER:
${studentAnswer}

Evaluate this answer using the following strict criteria:
- If the answer contains only "I don't know" or similar variations, score should be 0
- Score should reflect actual understanding and not be artificially inflated
- Use proper decimal formatting (one decimal place only)

Provide the following:
1. Score (out of 10, use one decimal place only)
2. Overall feedback (1-2 sentences)
3. Strengths (list 2-3 specific points the student did well)
4. Areas for improvement (list 2-3 specific points)
5. Key concepts missing (list 1-3 important concepts that were omitted or unclear)
6. Technical accuracy assessment (1-2 sentences)
7. Structure and presentation assessment (1-2 sentences)
8. Exam tips specific to this topic (2-3 practical tips)
9. Recommended study resources (1-2 specific recommendations)

Format your response as a valid JSON object.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192",
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || "";
    const evaluation = JSON.parse(responseContent);
    
    // Ensure score is properly formatted
    evaluation.score = formatScore(evaluation.score);
    return evaluation;

  } catch (error) {
    console.error("Error in evaluateAnswer:", error);
    throw new Error("Failed to evaluate answer");
  }
};

// Mock evaluation function with improved scoring logic
export const mockEvaluateAnswer = (question, studentAnswer) => {
  const answer = studentAnswer.trim().toLowerCase();
  
  // Handle "I don't know" case
  if (answer === "i don't know" || answer === "idk" || answer === "") {
    return {
      score: 0.0,
      overallFeedback: "No attempt made to answer the question.",
      strengths: [
        "None identified",
        "Consider attempting the question even if unsure"
      ],
      improvements: [
        "Need to attempt answering the question",
        "Review the basic concepts of this topic",
        "Practice similar questions regularly"
      ],
      keyConceptsMissing: question.relatedNotes.keyPoints.slice(0, 2),
      technicalAccuracy: "Unable to assess as no technical content provided",
      structureAndPresentation: "No structure to evaluate",
      examTips: [
        "Always attempt every question - partial marks are better than zero",
        "Start with writing the basic concepts you know",
        "Use proper terminology even if unsure about the complete answer"
      ],
      recommendedStudyResources: [
        `Review ${question.weakTopics[0]} in NCERT textbook`,
        "Practice previous year questions on this topic"
      ]
    };
  }

  // Regular evaluation logic
  const wordCount = answer.split(' ').length;
  const containsKeyTerms = question.weakTopics.some(topic => 
    answer.includes(topic.toLowerCase())
  );
  
  // More granular scoring
  let score = 0;
  
  // Word count scoring (max 2 points)
  if (wordCount > 50) score += 1;
  if (wordCount > 100) score += 1;
  
  // Key terms scoring (max 2 points)
  if (containsKeyTerms) score += 2;
  
  // Subject-specific terms scoring (max 2 points)
  const subjectTerms = getSubjectSpecificTerms(question.subject);
  const usedSubjectTerms = subjectTerms.filter(term => answer.includes(term.toLowerCase()));
  score += (usedSubjectTerms.length / subjectTerms.length) * 2;
  
  // Question-specific keywords scoring (max 2 points)
  const questionKeywords = extractKeywords(question.question);
  const usedKeywords = questionKeywords.filter(word => answer.includes(word.toLowerCase()));
  score += (usedKeywords.length / questionKeywords.length) * 2;
  
  // Format final score
  const finalScore = formatScore(Math.min(Math.max(score, 0), 10));

  return {
    score: finalScore,
    overallFeedback: getOverallFeedback(finalScore),
    strengths: getStrengths(wordCount, containsKeyTerms, usedSubjectTerms.length),
    improvements: getImprovements(question, usedSubjectTerms.length),
    keyConceptsMissing: question.relatedNotes.keyPoints.slice(0, 2),
    technicalAccuracy: getTechnicalAccuracy(finalScore, usedSubjectTerms.length),
    structureAndPresentation: getStructureAssessment(wordCount),
    examTips: [
      "Start with definitions of key terms before explaining concepts",
      "Include relevant formulas and diagrams",
      "Connect theoretical concepts to practical applications"
    ],
    recommendedStudyResources: [
      `Review ${question.weakTopics[0]} in NCERT textbook`,
      "Practice similar numerical problems"
    ]
  };
};

// Helper functions for mock evaluation
const getSubjectSpecificTerms = (subject) => {
  const terms = {
    Physics: ['force', 'energy', 'momentum', 'velocity', 'acceleration'],
    Chemistry: ['reaction', 'molecule', 'compound', 'electron', 'bond'],
    Mathematics: ['function', 'derivative', 'integral', 'equation', 'matrix']
  };
  return terms[subject] || [];
};

const extractKeywords = (question) => {
  // Remove common words and split into keywords
  return question
    .toLowerCase()
    .replace(/[.,?]/g, '')
    .split(' ')
    .filter(word => word.length > 3);
};

const getOverallFeedback = (score) => {
  if (score < 2) return "Significant improvement needed in understanding basic concepts.";
  if (score < 5) return "Shows basic understanding but needs more depth and detail.";
  if (score < 7) return "Good attempt with room for improvement in technical accuracy.";
  return "Strong understanding demonstrated with good technical depth.";
};

const getStrengths = (wordCount, containsKeyTerms, termCount) => {
  const strengths = [];
  if (wordCount > 100) strengths.push("Provided detailed explanation");
  if (containsKeyTerms) strengths.push("Used relevant topic terminology");
  if (termCount > 2) strengths.push("Good use of technical terms");
  if (strengths.length === 0) strengths.push("Attempted to answer the question");
  return strengths;
};

const getImprovements = (question, termCount) => {
  const improvements = [];
  improvements.push("Include more specific examples and applications");
  if (termCount < 3) improvements.push(`Use more ${question.subject}-specific terminology`);
  improvements.push("Strengthen theoretical foundation");
  return improvements;
};

const getTechnicalAccuracy = (score, termCount) => {
  if (score < 3) return "Major technical inaccuracies present";
  if (score < 6) return "Some technical concepts need clarification";
  return "Generally accurate with minor improvements needed";
};

const getStructureAssessment = (wordCount) => {
  if (wordCount < 50) return "Response needs more detailed explanation and better structure";
  if (wordCount < 100) return "Basic structure present but could be more organized";
  return "Well-structured response with clear flow of ideas";
};