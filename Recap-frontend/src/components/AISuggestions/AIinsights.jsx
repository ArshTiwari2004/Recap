import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, Bell, Link2, AlertTriangle, ArrowRight,
  Youtube, FileText, Network, BookOpen, Brain,
   Zap, Crosshair, Link, TrendingUp, Target, 
   BookOpenCheck, ExternalLink, ChevronRight, 
   BarChart3, Sparkles
} from 'lucide-react';
import { 
  collection, query, onSnapshot, doc, where, 
  addDoc, getDocs, updateDoc, deleteDoc 
} from 'firebase/firestore';
import { fireDB } from '../../config/Firebaseconfig';
import Sidebar from '../Sidebar';
import Notification from '../Notifications';
import NavBar from '../NavBar';
import toast from 'react-hot-toast';
import Chatbot from '@/pages/ChatBot';

const AIInsights = () => {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('gaps');
  const [relatedNotes, setRelatedNotes] = useState([]);
  const [savedAnalysis, setSavedAnalysis] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.uid;
  
    if (!userId) {
      toast.error("Please log in to view your notes.");
      return;
    }
  
    // Load notes
    const q = query(collection(fireDB, 'notes'), where('uid', '==', userId));
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

    // Load saved analyses
    loadSavedAnalyses(userId);
  
    return () => unsubscribe();
  }, []);

  // Load existing analyses from Firestore
  const loadSavedAnalyses = async (userId) => {
    try {
      const q = query(collection(fireDB, 'noteAnalysis'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const analyses = {};
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        analyses[data.noteId] = {
          id: doc.id,
          ...data
        };
      });
      
      setSavedAnalysis(analyses);
    } catch (error) {
      console.error('Error loading saved analyses:', error);
    }
  };

  // Save analysis to Firestore
  const saveAnalysisToFirestore = async (noteId, analysisData) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.uid;

      const analysisDoc = {
        userId,
        noteId,
        knowledgeGaps: analysisData.gaps || [],
        suggestedImprovements: analysisData.improvements || [],
        topics: analysisData.topics || [],
        coverage: analysisData.coverage || 0,
        relatedTopics: analysisData.relatedTopics || [],
        resources: resources || { videos: [], articles: [] },
        relatedNotes: relatedNotes || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Check if analysis already exists
      if (savedAnalysis[noteId]) {
        // Update existing
        const docRef = doc(fireDB, 'noteAnalysis', savedAnalysis[noteId].id);
        await updateDoc(docRef, {
          ...analysisDoc,
          updatedAt: new Date()
        });
        toast.success('Analysis updated successfully!');
      } else {
        // Create new
        const docRef = await addDoc(collection(fireDB, 'noteAnalysis'), analysisDoc);
        toast.success('Analysis saved successfully!');
        
        // Update local state
        setSavedAnalysis(prev => ({
          ...prev,
          [noteId]: { id: docRef.id, ...analysisDoc }
        }));
      }
    } catch (error) {
      console.error('Error saving analysis:', error);
      toast.error('Failed to save analysis');
    }
  };

  // Load existing analysis when note changes
  useEffect(() => {
    if (activeNote && savedAnalysis[activeNote.id]) {
      const saved = savedAnalysis[activeNote.id];
      setAnalysis({
        gaps: saved.knowledgeGaps || [],
        improvements: saved.suggestedImprovements || [],
        topics: saved.topics || [],
        coverage: saved.coverage || 0,
        relatedTopics: saved.relatedTopics || []
      });
      setResources(saved.resources || { videos: [], articles: [] });
      setRelatedNotes(saved.relatedNotes || []);
    } else {
      setAnalysis(null);
      setResources(null);
      setRelatedNotes([]);
    }
  }, [activeNote, savedAnalysis]);
  
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

  const getKnowledgeGaps = async () => {
    if (!activeNote) {
      toast.error('Please select a note first');
      return;
    }

    setLoading(true);
    try {
      const prompt = `Analyze this note content and provide:
        1. Main topics (max 5)
        2. Knowledge gaps or missing information (max 3)
        3. Suggested improvements (max 3)
        4. Content coverage score (0-100)
        5. Related topics for further study (max 5)

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

      // Save to Firestore
      await saveAnalysisToFirestore(activeNote.id, analysisResult);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
    }
    setLoading(false);
  };

  const getResources = async () => {
    if (!activeNote) {
      toast.error('Please select a note first');
      return;
    }

    setLoading(true);
    try {
      const prompt = `Suggest learning resources for the following note content: 

      ${activeNote.content}

      Format as JSON:
      {
        "videos": [
          {"title": "Video Title", "source": "YouTube Channel", "url": "https://youtube.com/watch?v=example", "duration": "10 min"}
        ],
        "articles": [
          {"title": "Article Title", "source": "Website Name", "url": "https://example.com", "readTime": "5 min"}
        ]
      }`;

      const result = await analyzeWithCohere(prompt);
      const resourcesResult = JSON.parse(result);
      setResources(resourcesResult);
      setActiveTab('resources');

      // Update Firestore with resources
      if (analysis) {
        await saveAnalysisToFirestore(activeNote.id, analysis);
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      toast.error('Failed to fetch resources. Please try again.');
    }
    setLoading(false);
  };

  const findRelatedNotes = async () => {
    if (!activeNote || notes.length < 2) {
      toast.error('Need more notes to find relations');
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
      const relatedNotesList = relatedResults
        .map(result => ({
          ...notes.find(note => note.id === result.id),
          relevance_score: result.relevance_score
        }))
        .filter(note => note.id); // Filter out notes that weren't found
      
      setRelatedNotes(relatedNotesList);

      // Update Firestore with related notes
      if (analysis) {
        await saveAnalysisToFirestore(activeNote.id, analysis);
      }
    } catch (error) {
      console.error('Failed to find related notes:', error);
      toast.error('Failed to find related notes. Please try again.');
    }
    setLoading(false);
  };

  const renderGapAnalysis = () => (
    <div className="space-y-6">
      {!loading && analysis && (
        <>
          {/* Coverage Score Card */}
          <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Content Coverage Score
              </h3>
              <span className="text-2xl font-bold text-purple-400">{analysis.coverage}%</span>
            </div>
            <div className="relative">
              <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${analysis.coverage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Topics Overview */}
          <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Main Topics Covered
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.topics.map((topic, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-sm font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Knowledge Gaps */}
          <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-400" />
              Knowledge Gaps
            </h3>
            <div className="space-y-3">
              {analysis.gaps.map((gap, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 leading-relaxed">{gap}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Improvements */}
          <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Suggested Improvements
            </h3>
            <div className="space-y-3">
              {analysis.improvements.map((improvement, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <Zap className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 leading-relaxed">{improvement}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Notes */}
          {relatedNotes.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Network className="w-5 h-5 text-purple-400" />
                Related Notes
              </h3>
              <div className="space-y-3">
                {relatedNotes.map((note, index) => (
                  <div 
                    key={index} 
                    className="group p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg cursor-pointer hover:bg-purple-500/20 transition-all duration-200"
                    onClick={() => setActiveNote(note)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Link className="w-4 h-4 text-purple-400" />
                          <h4 className="text-white font-medium">{note.subject}</h4>
                          <span className="px-2 py-1 bg-purple-500/30 text-purple-300 rounded-full text-xs">
                            {note.relevance_score}% match
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                          {note.content}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderResources = () => (
    <div className="space-y-6">
      {!loading && resources && (
        <>
          {/* Recommended Videos */}
          <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-400" />
              Recommended Videos
            </h3>
            <div className="space-y-3">
              {resources.videos.map((video, index) => (
                <a
                  key={index}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <Youtube className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium mb-1 group-hover:text-red-300 transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {video.source} • {video.duration}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Recommended Articles */}
          <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Recommended Articles
            </h3>
            <div className="space-y-3">
              {resources.articles.map((article, index) => (
                <a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium mb-1 group-hover:text-blue-300 transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {article.source} • {article.readTime} read
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Related Topics */}
          {analysis && analysis.relatedTopics.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Related Topics for Further Study
              </h3>
              <div className="flex flex-wrap gap-3">
                {analysis.relatedTopics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full text-sm font-medium hover:bg-purple-500/30 transition-colors cursor-pointer"
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
        <NavBar
          icon={<Lightbulb className="w-6 h-6 text-purple-400" />}
          header={"AI Insights"}
          button1={"Feedback"}
          button2={"Help"}
          button3={"Docs"}
        />

        <div className="flex-1 p-6 overflow-hidden">
          <div className="max-w-7xl mx-auto h-full flex gap-6">
            {/* Left Column - Notes Section */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl h-full flex flex-col">
                <div className="p-6 border-b border-gray-700/50">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <BookOpenCheck className="w-5 h-5 text-purple-400" />
                    Your Notes
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {notes.length} notes available
                  </p>
                </div>
                
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent">
                  <div className="p-4 space-y-3">
                    {notes.map(note => (
                      <button
                        key={note.id}
                        onClick={() => {
                          setActiveNote(note);
                          setActiveTab('gaps');
                        }}
                        className={`w-full p-4 rounded-xl text-left transition-all duration-200 group ${
                          activeNote?.id === note.id
                            ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 shadow-lg shadow-purple-500/10'
                            : 'bg-gray-700/30 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`font-medium text-sm ${
                            activeNote?.id === note.id ? 'text-white' : 'text-gray-300 group-hover:text-white'
                          } transition-colors`}>
                            {note.subject}
                          </h3>
                          {savedAnalysis[note.id] && (
                            <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed">
                          {note.content}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Analysis Section */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Header with Action Buttons */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {activeNote ? activeNote.subject : 'Select a Note to Analyze'}
                    </h2>
                    {activeNote && (
                      <p className="text-gray-400 text-sm">
                        {savedAnalysis[activeNote.id] ? 'Analysis available' : 'Ready for analysis'}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={getKnowledgeGaps}
                    disabled={loading || !activeNote}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 font-medium"
                  >
                    <Target className="w-4 h-4" />
                    Analyze Gaps
                  </button>
                  <button 
                    onClick={getResources}
                    disabled={loading || !activeNote}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 font-medium"
                  >
                    <BookOpen className="w-4 h-4" />
                    Find Resources
                  </button>
                  {/* <button 
                    onClick={findRelatedNotes}
                    disabled={loading || !activeNote}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20 font-medium"
                  >
                    <Network className="w-4 h-4" />
                    Link Notes
                  </button> */}
                </div>
              </div>

              {/* Analysis Results */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl flex-1 flex flex-col min-h-0">
                {/* Tabs */}
                <div className="p-6 border-b border-gray-700/50">
                  <div className="flex space-x-1 bg-gray-700/30 rounded-xl p-1">
                    <button
                      onClick={() => setActiveTab('gaps')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === 'gaps'
                          ? 'bg-purple-500 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
                      }`}
                    >
                      <Target className="w-4 h-4" />
                      Analysis
                    </button>
                    <button
                      onClick={() => setActiveTab('resources')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === 'resources'
                          ? 'bg-purple-500 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      Resources
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent p-6">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                        <div className="absolute inset-0 animate-pulse">
                          <div className="h-12 w-12 bg-purple-500/20 rounded-full"></div>
                        </div>
                      </div>
                      <p className="mt-4 text-gray-400 font-medium">
                        {activeTab === 'gaps' ? 'Analyzing content...' : 'Finding resources...'}
                      </p>
                    </div>
                  ) : !activeNote ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <Lightbulb className="w-16 h-16 text-gray-600 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-400 mb-2">
                        Select a Note to Begin
                      </h3>
                      <p className="text-gray-500">
                        Choose a note from the sidebar to start analyzing and getting insights.
                      </p>
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

      <Chatbot />
    </div>
  );
};

export default AIInsights;