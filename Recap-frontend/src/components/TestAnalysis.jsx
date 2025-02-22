import { useState } from 'react';

const TestAnalysis = ({ analysis }) => {
  const [selectedTab, setSelectedTab] = useState('summary');
  
  if (!analysis) return null;
  
  // Safer JSON parsing with error handling
  let parsedAnalysis;
  try {
    // Only attempt to parse if it's a string
    parsedAnalysis = typeof analysis === 'string' 
      ? JSON.parse(analysis) 
      : analysis;
      
    // Validate the expected structure
    if (!parsedAnalysis.summary || !parsedAnalysis.topicAnalysis || 
        !parsedAnalysis.questionFeedback || !parsedAnalysis.improvement || 
        !parsedAnalysis.studyMaterials) {
      throw new Error("Invalid analysis data structure");
    }
  } catch (error) {
    console.error("Error parsing analysis data:", error);
    // Provide a fallback UI for malformed data
    return (
      <div className="p-4 bg-gray-800 rounded-lg text-red-400">
        <h3 className="text-lg font-bold mb-2">Analysis Format Error</h3>
        <p>The analysis data couldn't be processed correctly. The analysis should be in valid JSON format.</p>
        <div className="mt-4 p-2 bg-gray-900 rounded">
          <p className="text-sm text-gray-400">Raw data preview (first 100 chars):</p>
          <code className="block mt-2 text-xs overflow-auto">
            {typeof analysis === 'string' ? analysis.substring(0, 100) + '...' : 'Non-string data received'}
          </code>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-700">
        {['summary', 'topics', 'feedback', 'improvement'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              selectedTab === tab 
                ? 'text-purple-400 border-b-2 border-purple-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="p-4 bg-gray-800 rounded-lg">
        {selectedTab === 'summary' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-400">
                {parsedAnalysis.summary.score.percentage}%
              </div>
              <div className="text-gray-400 mt-2">
                {parsedAnalysis.summary.score.correct} out of {parsedAnalysis.summary.score.total} correct
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'topics' && (
          <div className="space-y-4">
            {parsedAnalysis.topicAnalysis.map((topic, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                <span className="font-medium">{topic.topic}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">
                    {topic.correct}/{topic.total}
                  </span>
                  <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500" 
                      style={{ width: `${topic.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {selectedTab === 'feedback' && (
          <div className="space-y-6">
            {parsedAnalysis.questionFeedback.map((question, index) => (
              <div key={index} className="p-4 bg-gray-900 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    question.correct ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                  }`}>
                    {question.correct ? 'Correct' : 'Incorrect'}
                  </span>
                  <span className="text-gray-400">Question {index + 1}</span>
                </div>
                <p className="text-gray-300">{question.explanation}</p>
              </div>
            ))}
          </div>
        )}
        
        {selectedTab === 'improvement' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3 text-purple-400">Areas for Improvement</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {parsedAnalysis.improvement.areas.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 text-purple-400">Study Materials</h3>
              <div className="grid gap-4">
                {parsedAnalysis.studyMaterials.map((material, index) => (
                  <div key={index} className="p-3 bg-gray-900 rounded-lg">
                    <div className="font-medium">{material.title}</div>
                    <div className="text-sm text-gray-400">
                      Type: {material.type} • Focus: {material.focus}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestAnalysis;