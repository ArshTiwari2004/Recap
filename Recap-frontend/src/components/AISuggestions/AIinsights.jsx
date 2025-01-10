import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, Bell, Link2, AlertTriangle, ArrowRight,
  Youtube, FileText, Network, BookOpen, Brain,
   Zap, Crosshair, Link
} from 'lucide-react';
import { collection, query, onSnapshot, doc } from 'firebase/firestore';
import { fireDB } from '../../config/Firebaseconfig';
import Sidebar from '../Sidebar';

const AIInsights = () => {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('gaps');
  const [relatedNotes, setRelatedNotes] = useState([]);

  useEffect(() => {
    const q = query(collection(fireDB, 'notes'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData = [];
      querySnapshot.forEach((doc) => {
        notesData.push({ id: doc.id, ...doc.data() });
      });
      setNotes(notesData);
      if (notesData.length > 0 && !activeNote) {
        setActiveNote(notesData[0]);
      }
    });

    return () => unsubscribe();
  }, []);

  const analyzeWithCohere = async (prompt) => {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YFAX6MrxeFKRRZakECwf5M9p59Chg7OvYPpsUeDg',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'command',
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    return data.generations[0].text;
  };

  const analyzeContent = async () => {
    if (!activeNote) {
      alert('Please select a note first');
      return;
    }

    setLoading(true);
    try {
      // Get knowledge gaps and topics using Cohere
      const gapsPrompt = `Analyze this note content and provide:
        1. Main topics (max 5)
        2. Knowledge gaps or missing information (max 3)
        3. Suggested improvements
        4. Content coverage score (0-100)
        5. Related topics for further study

        Note content: ${activeNote.content}

        Format your response as a JSON object with these exact keys:
        {
          "topics": [],
          "gaps": [],
          "improvements": [],
          "coverage": 70,
          "relatedTopics": []
        }`;

      const gapsResult = await analyzeWithCohere(gapsPrompt);
      const analysisResult = JSON.parse(gapsResult);
      setAnalysis(analysisResult);

      // Find related notes
      const findRelatedPrompt = `Given these topics from the current note: ${analysisResult.topics.join(', ')}

      Compare with these other notes and identify which ones are most related (return max 3):
      ${notes.filter(note => note.id !== activeNote.id).map(note => 
        `Note ID ${note.id}: ${note.content.substring(0, 200)}...`
      ).join('\n\n')}

      Format response as JSON array with objects containing id and relevance_score (0-100):
      [{ "id": "note_id", "relevance_score": 85 }]`;

      const relatedResult = await analyzeWithCohere(findRelatedPrompt);
      const relatedResults = JSON.parse(relatedResult);
      const relatedNotesList = relatedResults.map(result => ({
        ...notes.find(note => note.id === result.id),
        relevance_score: result.relevance_score
      }));
      setRelatedNotes(relatedNotesList);

      // Get learning resources
      const resourcesPrompt = `Suggest learning resources for these topics: ${analysisResult.topics.join(', ')}

      Format as JSON:
      {
        "videos": [
          {"title": "", "source": "", "url": "", "duration": ""}
        ],
        "articles": [
          {"title": "", "source": "", "url": "", "readTime": ""}
        ]
      }`;

      const resourcesResult = await analyzeWithCohere(resourcesPrompt);
      setResources(JSON.parse(resourcesResult));
      
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    }
    setLoading(false);
  };

  const getKnowledgeGaps = async () => {
    if (!activeNote) {
      alert('Please select a note first');
      return;
    }

    setLoading(true);
    try {
      const prompt = `Analyze this note content and provide:
        1. Main topics (max 5)
        2. Knowledge gaps or missing information (max 3)
        3. Suggested improvements
        4. Content coverage score (0-100)
        5. Related topics for further study

        Note content: ${activeNote.content}

        Format your response as a JSON object with these exact keys:
        {
          "topics": [],
          "gaps": [],
          "improvements": [],
          "coverage": 70,
          "relatedTopics": []
        }`;

      const result = await analyzeWithCohere(prompt);
      const analysisResult = JSON.parse(result);
      setAnalysis(analysisResult);
      setActiveTab('gaps');
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    }
    setLoading(false);
  };

  const getResources = async () => {
    if (!activeNote) {
      alert('Please select a note first');
      return;
    }

    setLoading(true);
    try {
      const prompt = `Suggest learning resources for the following note content: 

      ${activeNote.content}

      Format as JSON:
      {
        "videos": [
          {"title": "", "source": "", "url": "", "duration": ""}
        ],
        "articles": [
          {"title": "", "source": "", "url": "", "readTime": ""}
        ]
      }`;

      const result = await analyzeWithCohere(prompt);
      const resourcesResult = JSON.parse(result);
      setResources(resourcesResult);
      setActiveTab('resources');
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      alert('Failed to fetch resources. Please try again.');
    }
    setLoading(false);
  };

  const findRelatedNotes = async () => {
    if (!activeNote || notes.length < 2) {
      alert('Need more notes to find relations');
      return;
    }

    setLoading(true);
    try {
      const prompt = `Compare this note:
      ${activeNote.content}

      With these other notes and identify which ones are most related (return max 3):
      ${notes.filter(note => note.id !== activeNote.id).map(note => 
        `Note ID ${note.id}: ${note.content.substring(0, 200)}...`
      ).join('\n\n')}

      Format response as JSON array with objects containing id and relevance_score (0-100):
      [{ "id": "note_id", "relevance_score": 85 }]`;

      const result = await analyzeWithCohere(prompt);
      const relatedResults = JSON.parse(result);
      const relatedNotesList = relatedResults.map(result => ({
        ...notes.find(note => note.id === result.id),
        relevance_score: result.relevance_score
      }));
      setRelatedNotes(relatedNotesList);
    } catch (error) {
      console.error('Failed to find related notes:', error);
      alert('Failed to find related notes. Please try again.');
    }
    setLoading(false);
  };

  const renderGapAnalysis = () => (
    <div className="space-y-4">
      {!loading && analysis && (
        <>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">Content Coverage</h3>
            <div className="flex items-center space-x-2">
              <div className="h-2 flex-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.coverage}%` }}
                />
              </div>
              <span className="text-gray-400">{analysis.coverage}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-white font-medium">Knowledge Gaps</h3>
            {analysis.gaps.map((gap, index) => (
              <div key={index} className="flex items-start space-x-2 text-gray-300 bg-gray-800/50 p-3 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span>{gap}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-white font-medium">Suggested Improvements</h3>
            {analysis.improvements.map((improvement, index) => (
              <div key={index} className="flex items-start space-x-2 text-gray-300 bg-gray-800/50 p-3 rounded-lg">
                <Zap className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>{improvement}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-white font-medium">Related Notes</h3>
            {relatedNotes.map((note, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-2 text-gray-300 bg-gray-800/50 p-3 rounded-lg cursor-pointer hover:bg-gray-800"
                onClick={() => setActiveNote(note)}
              >
                <Link className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium">{note.subject}</h4>
                  <p className="text-sm text-gray-400 line-clamp-2">{note.content}</p>
                  <span className="text-xs text-purple-400 mt-1">
                    Relevance: {note.relevance_score}%
                  </span>
                </div>
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
            <h3 className="text-white font-medium">Recommended Videos</h3>
            {resources.videos.map((video, index) => (
              <a
                key={index}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
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
            <h3 className="text-white font-medium">Recommended Articles</h3>
            {resources.articles.map((article, index) => (
              <a
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
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

          {analysis && (
            <div className="space-y-2">
              <h3 className="text-white font-medium">Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.relatedTopics.map((topic, index) => (
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
        </>
      )}
    </div>
  );


  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-gray-800 border-b border-gray-700 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-6 h-6 text-purple-400" />
            <span className="text-lg font-semibold text-white">AI Insights</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={getKnowledgeGaps}
              disabled={loading || !activeNote}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              Get Knowledge Gaps
            </button>
            <button 
              onClick={getResources}
              disabled={loading || !activeNote}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              Find Resources
            </button>
            <button 
              onClick={findRelatedNotes}
              disabled={loading || !activeNote}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
            >
              Link Related Notes
            </button>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8">
            <div>
              <div className="bg-gray-800 rounded-xl border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-white">Your Notes</h2>
                </div>
                <div className="p-4 space-y-2">
                  {notes.map(note => (
                    <button
                      key={note.id}
                      onClick={() => {
                        setActiveNote(note);
                        setAnalysis(null);
                        setResources(null);
                        setRelatedNotes([]);
                      }}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        activeNote?.id === note.id
                          ? 'bg-purple-500/20 border border-purple-500'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <h3 className="text-white font-medium mb-1">{note.subject}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{note.content}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <div className="bg-gray-800 rounded-xl border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">
                      {activeNote ? activeNote.subject : 'Select a Note'}
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setActiveTab('gaps')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          activeTab === 'gaps'
                            ? 'bg-purple-500 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Gaps
                      </button>
                      <button
                        onClick={() => setActiveTab('resources')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          activeTab === 'resources'
                            ? 'bg-purple-500 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Resources
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    </div>
                  ) : activeTab === 'gaps' ? (
                    renderGapAnalysis()
                  ) : (
                    renderResources()
                  )}
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