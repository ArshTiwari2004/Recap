import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Bell, Lightbulb, AlertTriangle, ArrowRight,
  Youtube, FileText, Link2, CheckCircle, X 
} from 'lucide-react';
import Sidebar from '../Sidebar';

// Simulated API for demo - replace with real API endpoints
const analyzeText = async (text) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const keywords = text.toLowerCase().match(/\b\w+\b/g) || [];
  return {
    topics: ['React', 'JavaScript', 'Web Development'],
    keywords: [...new Set(keywords)].slice(0, 5),
    complexity: keywords.length > 50 ? 'Advanced' : 'Intermediate'
  };
};

const fetchResources = async (topics) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    videos: [
      {
        id: 1,
        title: "React Fundamentals",
        source: "Khan Academy",
        url: "#",
        duration: "15:30"
      }
    ],
    articles: [
      {
        id: 1,
        title: "JavaScript Best Practices",
        source: "MDN Web Docs",
        url: "#",
        readTime: "8 min"
      }
    ]
  };
};

const AIInsights = () => {
  const [activeNote, setActiveNote] = useState({
    id: 1,
    title: "React Components",
    content: "React components are the building blocks of React applications. They are JavaScript functions or classes that can accept inputs called props and return React elements that describe what should appear on the screen."
  });
  
  const [analysis, setAnalysis] = useState(null);
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('gaps');
  
  useEffect(() => {
    const analyzeNote = async () => {
      setLoading(true);
      try {
        const analysisResult = await analyzeText(activeNote.content);
        setAnalysis(analysisResult);
        
        const resourcesResult = await fetchResources(analysisResult.topics);
        setResources(resourcesResult);
      } catch (error) {
        console.error('Analysis failed:', error);
      }
      setLoading(false);
    };
    
    if (activeNote) {
      analyzeNote();
    }
  }, [activeNote]);

  const renderGapAnalysis = () => (
    <div className="space-y-4">
      {!loading && analysis && (
        <>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">Content Coverage</h3>
            <div className="flex items-center space-x-2">
              <div className="h-2 flex-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: '70%' }}
                />
              </div>
              <span className="text-gray-400">70%</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-white font-medium">Suggested Improvements</h3>
            {[
              "Add examples of component lifecycle methods",
              "Include section on hooks usage",
              "Expand on props vs state comparison"
            ].map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-2 text-gray-300 bg-gray-800/50 p-3 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderResources = () => (
    <div className="space-y-4">
      {!loading && resources && (
        <>
          <div className="space-y-2">
            <h3 className="text-white font-medium">Related Videos</h3>
            {resources.videos.map(video => (
              <a
                key={video.id}
                href={video.url}
                className="flex items-center space-x-3 bg-gray-800/50 p-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Youtube className="w-5 h-5 text-red-500" />
                <div className="flex-1">
                  <p className="text-gray-200">{video.title}</p>
                  <p className="text-sm text-gray-400">{video.source} • {video.duration}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </a>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-white font-medium">Related Articles</h3>
            {resources.articles.map(article => (
              <a
                key={article.id}
                href={article.url}
                className="flex items-center space-x-3 bg-gray-800/50 p-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <FileText className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-gray-200">{article.title}</p>
                  <p className="text-sm text-gray-400">{article.source} • {article.readTime} read</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="h-16 bg-gray-800 border-b border-gray-700 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-6 h-6 text-purple-400" />
            <span className="text-lg font-semibold text-white">AI Insights</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors">
              Feedback
            </button>
            <button className="text-gray-300 hover:text-white transition-colors">
              Help
            </button>
            <button className="text-gray-300 hover:text-white transition-colors">
              Docs
            </button>
            <button className="relative text-gray-300 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8">
            {/* Note Content */}
            <div className="col-span-2">
              <div className="bg-gray-800 rounded-xl border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-white">{activeNote.title}</h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-300">{activeNote.content}</p>
                  
                  {!loading && analysis && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h3 className="text-white font-medium mb-3">Detected Topics</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.topics.map((topic, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Analysis Panel */}
            <div>
              <div className="bg-gray-800 rounded-xl border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">AI Analysis</h2>
                    {loading && (
                      <div className="text-sm text-purple-400">Analyzing...</div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    {['gaps', 'resources'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          activeTab === tab 
                            ? 'bg-purple-500 text-white' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-6">
                  {activeTab === 'gaps' ? renderGapAnalysis() : renderResources()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;