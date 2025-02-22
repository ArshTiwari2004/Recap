import React, { useState, useEffect } from 'react';
import { Groq } from 'groq-sdk';
import { ClockIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import TestAnalysis from '@/components/TestAnalysis';

const AITestGenerator = () => {
  const [testParams, setTestParams] = useState({
    subject: '',
    duration: 30,
    difficulty: 'medium',
    specialRequirements: '',
    questionCount: 10
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [testInProgress, setTestInProgress] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(null);

  const [testResults, setTestResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  const generatePrompt = (params) => {
    return `Create a comprehensive ${params.difficulty}-level test for ${params.subject} with exactly ${params.questionCount} questions.

Key Requirements:
- Mix of conceptual and practical questions
- Include previous year questions where relevant
- Progressive difficulty scaling
- Clear, unambiguous questions
${params.specialRequirements ? `- Additional requirements: ${params.specialRequirements}` : ''}

Format each question strictly as follows:
{
  "questions": [
    {
      "id": "q1",
      "text": "The complete question text",
      "options": [
        { "id": "a", "text": "First option" },
        { "id": "b", "text": "Second option" },
        { "id": "c", "text": "Third option" },
        { "id": "d", "text": "Fourth option" }
      ],
      "correctAnswer": "a",
      "explanation": "Detailed explanation of why this answer is correct",
      "topic": "Specific topic name",
      "difficulty": "${params.difficulty}",
      "isFromPYQ": false
    }
  ],
  "metadata": {
    "subject": "${params.subject}",
    "totalQuestions": ${params.questionCount},
    "difficulty": "${params.difficulty}",
    "duration": ${params.duration}
  }
}

Return ONLY valid JSON without any additional text.`;
  };

  const generateTest = async () => {
    setIsGenerating(true);
    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true 
      });
      
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert test generator specialized in creating high-quality academic assessments. Create clear, accurate, and well-structured questions."
          },
          {
            role: "user",
            content: generatePrompt(testParams)
          }
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.7,
        max_tokens: 4096
      });

      const generatedTest = JSON.parse(completion.choices[0].message.content);
      setCurrentTest(generatedTest);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating test:', error);
      setIsGenerating(false);
    }
  };

  const startTest = () => {
    setTestInProgress(true);
    setTimeRemaining(testParams.duration * 60);
    const newTimer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(newTimer);
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimer(newTimer);
  };

  const submitTest = async () => {
    if (timer) clearInterval(timer);
    setTestInProgress(false);
    setIsAnalyzing(true);
    
    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true
      });
      
      // Calculate score for structured response
      const userScore = Object.entries(answers).reduce((score, [questionId, answerId]) => {
        const question = currentTest.questions.find(q => q.id === questionId);
        if (question && question.correctAnswer === answerId) {
          return score + 1;
        }
        return score;
      }, 0);
      
      const totalQuestions = currentTest.questions.length;
      const percentageScore = Math.round((userScore / totalQuestions) * 100);
      
      // Create a more structured prompt that requests JSON output
      const analysisPrompt = `Analyze this test performance and provide feedback in VALID JSON format matching this exact structure:
      {
        "summary": {
          "score": {
            "percentage": ${percentageScore},
            "correct": ${userScore},
            "total": ${totalQuestions}
          }
        },
        "topicAnalysis": [
          {
            "topic": "TOPIC_NAME",
            "correct": NUM_CORRECT,
            "total": TOTAL_QUESTIONS,
            "percentage": PERCENTAGE
          }
        ],
        "questionFeedback": [
          {
            "questionId": "q1",
            "correct": true/false,
            "explanation": "Detailed explanation"
          }
        ],
        "improvement": {
          "areas": ["Area 1", "Area 2"]
        },
        "studyMaterials": [
          {
            "title": "Resource title",
            "type": "Book/Website/Course",
            "focus": "Topics covered"
          }
        ]
      }
  
      Base your analysis on:
      Subject: ${testParams.subject}
      Questions: ${JSON.stringify(currentTest.questions)}
      User Answers: ${JSON.stringify(answers)}
      
      Return ONLY valid JSON with no markdown formatting, introduction text, or code blocks.`;
      
      const analysis = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert at analyzing test performance. Your responses must be valid JSON only, with NO additional text. Follow the exact JSON structure provided."
          },
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.3
      });
      
      // Parse and validate the response before setting it
      try {
        const analysisContent = analysis.choices[0].message.content.trim();
        // Remove any markdown code blocks if they exist
        const cleanedContent = analysisContent.replace(/```json\s*|\s*```/g, '');
        
        // Validate that it's parseable JSON
        JSON.parse(cleanedContent);
        
        setCurrentTest(prev => ({
          ...prev,
          analysis: cleanedContent
        }));
      } catch (jsonError) {
        console.error('Error parsing analysis JSON:', jsonError);
        // Create fallback analysis in proper format
        const fallbackAnalysis = {
          summary: {
            score: {
              percentage: percentageScore,
              correct: userScore,
              total: totalQuestions
            }
          },
          topicAnalysis: [],
          questionFeedback: [],
          improvement: {
            areas: ["Please review all questions carefully"]
          },
          studyMaterials: [
            {
              title: "Review course materials",
              type: "Course",
              focus: "All topics"
            }
          ]
        };
        setCurrentTest(prev => ({
          ...prev,
          analysis: JSON.stringify(fallbackAnalysis)
        }));
      }
    } catch (error) {
      console.error('Error analyzing test:', error);
      setIsAnalyzing(false);
    } finally {
      setIsAnalyzing(false);
    }
  };
  

  return (
    <div className="w-full px-6 py-8 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-white">AI Test Generator</h1>
      
      {!currentTest && !testInProgress && (
        <div className="bg-gray-800 bg-opacity-60 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-purple-900/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={testParams.subject}
                onChange={(e) => setTestParams(prev => ({...prev, subject: e.target.value}))}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter subject name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Test Duration (minutes)
              </label>
              <select 
                value={testParams.duration}
                onChange={(e) => setTestParams(prev => ({...prev, duration: Number(e.target.value)}))}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Difficulty Level
              </label>
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map(level => (
                  <button 
                    key={level}
                    className={`flex-1 py-2 px-4 rounded-lg capitalize transition-all ${
                      testParams.difficulty === level 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-900 text-gray-300 border border-gray-700 hover:bg-gray-800'
                    }`}
                    onClick={() => setTestParams(prev => ({...prev, difficulty: level}))}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Number of Questions: {testParams.questionCount}
              </label>
              <input 
                type="range" 
                min={5} 
                max={20} 
                value={testParams.questionCount}
                onChange={(e) => setTestParams(prev => ({...prev, questionCount: Number(e.target.value)}))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Special Requirements (Optional)
              </label>
              <textarea
                value={testParams.specialRequirements}
                onChange={(e) => setTestParams(prev => ({...prev, specialRequirements: e.target.value}))}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                placeholder="Any specific topics or requirements..."
              />
            </div>
          </div>
          
          <button 
            onClick={generateTest}
            disabled={!testParams.subject || isGenerating}
            className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium transition-all ${
              isGenerating || !testParams.subject
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isGenerating ? 'Generating Test...' : 'Generate Test'}
          </button>
        </div>
      )}
      
      {currentTest && !testInProgress && (
        <div className="bg-gray-800 bg-opacity-60 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-purple-900/30">
          <h2 className="text-2xl font-bold mb-4">Test Preview</h2>
          <div className="flex gap-4 mb-6">
            <div className="flex items-center text-gray-300">
              <ClockIcon className="h-5 w-5 mr-2" />
              <span>{testParams.duration} minutes</span>
            </div>
            <div className="flex items-center text-gray-300">
              <BookOpenIcon className="h-5 w-5 mr-2" />
              <span>{currentTest.questions.length} questions</span>
            </div>
          </div>
          
          <button
            onClick={startTest}
            className="w-full md:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
          >
            Start Test
          </button>
        </div>
      )}
      
      {testInProgress && currentTest && (
        <div className="bg-gray-800 bg-opacity-60 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-purple-900/30">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Test in Progress</h2>
            <div className="text-xl font-semibold text-purple-300">
              Time: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </div>
          </div>
          
          <div className="space-y-8">
            {currentTest.questions.map((question, idx) => (
              <div key={question.id} className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">Question {idx + 1}</h3>
                  {question.isFromPYQ && (
                    <span className="px-2 py-1 bg-purple-600 text-xs rounded-full">PYQ</span>
                  )}
                </div>
                <p className="text-lg mb-6">{question.text}</p>
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-start space-x-3 p-3 rounded hover:bg-gray-800 cursor-pointer border border-gray-700 transition-colors"
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.id}
                        onChange={() => setAnswers(prev => ({...prev, [question.id]: option.id}))}
                        className="mt-1 accent-purple-500"
                      />
                      <span className="flex-1">{option.text}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  Topic: {question.topic}
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={submitTest}
            className="mt-8 w-full md:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
          >
            Submit Test
          </button>
        </div>
      )}
      {currentTest?.analysis && <TestAnalysis analysis={currentTest?.analysis} />}
      {/* {currentTest?.analysis && (
        <div className="mt-6 bg-gray-800 bg-opacity-60 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-purple-900/30">
          <h2 className="text-2xl font-bold mb-4">Test Analysis</h2>
          <div className="prose prose-invert max-w-none">
            {currentTest.analysis}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default AITestGenerator;