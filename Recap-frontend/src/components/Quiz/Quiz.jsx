import React, { useState, useEffect } from 'react';
import { Trophy, Star, Clock, Medal, Timer, Award, Flame, BookOpen, Grid, List, Search, Filter, ChevronDown, PanelLeftClose, PanelLeftOpen, FlameIcon, FlameKindlingIcon , File } from 'lucide-react';
import { collection, query, onSnapshot, updateDoc, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { fireDB } from '../../config/Firebaseconfig';
import Sidebar from '../../components/Sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Notification from '../Notifications';
import NavBar from '../NavBar';
import { useUser } from '@/context/UserContext';
import Chatbot from '@/pages/ChatBot';

// Notes Panel Component
const NotesPanel = ({ isOpen, onClose, notes, onNoteSelect, selectedNote }) => {
  return (
    <div className={`fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-700 transition-all duration-300 ${isOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Notes</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-3">
          {notes.map(note => (
            <div
              key={note.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedNote?.id === note.id ? 'bg-purple-500/20 border border-purple-500' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => onNoteSelect(note)}
            >
              <h3 className="text-white font-medium mb-1">{note.subject}</h3>
              <p className="text-gray-400 text-sm line-clamp-2">{note.content}</p>
              <div className="flex items-center space-x-2 mt-2 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const QuizComponent = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [points, setPoints] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNotesPanelOpen, setIsNotesPanelOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const { user } = useUser();

  console.log(user)

  // Fetch notes from Firebase
  useEffect(() => {
    const q = query(collection(fireDB, 'notes'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData = [];
      querySnapshot.forEach((doc) => {
        notesData.push({ id: doc.id, ...doc.data() });
      });
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, []);

  // Fetch quizzes from Firebase
  useEffect(() => {
    const q = query(collection(fireDB, 'quizzes'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const quizData = [];
      querySnapshot.forEach((doc) => {
        quizData.push({ id: doc.id, ...doc.data() });
      });
      setQuizzes(quizData);
    });

    return () => unsubscribe();
  }, []);

  // Generate quiz using Cohere
  const generateQuiz = async (noteContent) => {
    try {
      setIsGenerating(true);
      
      const prompt = `Generate 1 quiz based on the following content. Create 5 multiple-choice questions that test understanding of key concepts. 
      For each question, provide 4 options with one correct answer. Format your response as a JSON object with the following structure:
      {
        "title": "Quiz title based on content",
        "subject": "Subject area",
        "difficulty": "medium",
        "timeLimit": 10,
        "questions": [
          {
            "question": "Question text",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correctAnswer": 0,
            "topic": "Specific topic this tests"
          }
        ]
      }
      Make questions engaging and challenging but clear. Content: ${noteContent}`;

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
      
      // Parse the generated text as JSON
      let generatedQuiz;
      try {
        const jsonMatch = data.generations[0].text.match(/\{.*\}/s);
        if (jsonMatch) {
          generatedQuiz = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON object found in response');
        }
      } catch (parseError) {
        console.error('Error parsing generated quiz:', parseError);
        return null;
      }

      // Add metadata and save to Firebase
      const quizToSave = {
        ...generatedQuiz,
        noteId: selectedNote.id,
        createdAt: new Date().toISOString(),
        completed: false,
        highScore: 0
      };

      await addDoc(collection(fireDB, 'quizzes'), quizToSave);
      return quizToSave;

    } catch (error) {
      console.error('Error generating quiz:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };




 const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setTimer(quiz.timeLimit * 60);
    setIsTimerRunning(true);
    setFeedback('');
    setUserAnswers([]);
  };

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            setIsTimerRunning(false);
            setShowResults(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);


  const handleAnswer = async (selectedAnswer) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(newUserAnswers);

    const correct = selectedAnswer === activeQuiz.questions[currentQuestion].correctAnswer;
    
    if (correct) {
      setScore(prev => prev + 1);
      setPoints(prev => prev + calculatePoints(activeQuiz.difficulty, timer));
    }

    if (currentQuestion + 1 < activeQuiz.questions.length) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const generateResults = async () => {
    setIsTimerRunning(false);
    
    const results = {
      wrongAnswers: activeQuiz.questions
        .filter((q, idx) => userAnswers[idx] !== q.correctAnswer)
        .map(q => q.topic)
    };
    
    setLoading(true);
    try {
      // Mock feedback generation - replace with actual API call if needed
      setFeedback(`Great attempt! You got ${score} questions correct. Focus on reviewing: ${results.wrongAnswers.join(', ')}`);
      
      // Update user stats in Firebase
      const userStatsRef = doc(fireDB, 'userStats', 'currentUser'); // Replace with actual user ID
      await updateDoc(userStatsRef, {
        totalPoints: points,
        quizzesCompleted: increment(1)
      });
    } catch (error) {
      console.error('Error generating results:', error);
      setFeedback('Error generating feedback. Please try again.');
    } finally {
      setLoading(false);
      setShowResults(true);
    }
  };

  const calculatePoints = (difficulty, timeRemaining) => {
    const basePoints = {
      easy: 10,
      medium: 20,
      hard: 30
    }[difficulty.toLowerCase()];
    
    const timeBonus = Math.floor(timeRemaining / 10);
    return basePoints + timeBonus;
  };

  const renderQuizCard = (quiz) => (
    <div 
      key={quiz.id} 
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white font-medium text-lg">{quiz.title}</h3>
          <span className="text-gray-400 text-sm">{quiz.subject}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          quiz.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
          quiz.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-green-500/20 text-green-400'
        }`}>
          {quiz.difficulty}
        </span>
      </div>

      <div className="flex items-center justify-between text-gray-400 text-sm mb-6">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>{quiz.timeLimit} minutes</span>
        </div>
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4" />
          <span>{quiz.questions?.length || 0} questions</span>
        </div>
      </div>

      <button
        onClick={() => startQuiz(quiz)}
        className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
      >
        Start Quiz
      </button>
    </div>
  );

  const renderQuizInterface = () => (
    <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-white text-xl font-medium">{activeQuiz.title}</h2>
          <p className="text-gray-400">Question {currentQuestion + 1} of {activeQuiz.questions.length}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg flex items-center space-x-2">
            <Timer className="w-4 h-4" />
            <span>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
          </div>
          <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>{points} pts</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-white text-lg mb-4">{activeQuiz.questions[currentQuestion].question}</h3>
        <div className="grid grid-cols-1 gap-4">
          {activeQuiz.questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`text-left p-4 ${
                userAnswers[currentQuestion] === index 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              } rounded-lg transition-colors`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {currentQuestion === activeQuiz.questions.length - 1 && userAnswers[currentQuestion] !== undefined && (
        <button
          onClick={generateResults}
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors mt-4"
        >
          Generate Results
        </button>
      )}
    </div>
  );


  const renderResults = () => (
    <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
      <div className="text-center mb-8">
        <Trophy className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h2 className="text-white text-2xl font-medium mb-2">Quiz Complete!</h2>
        <p className="text-gray-400">You scored {score} out of {activeQuiz.questions.length}</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-gray-400 mb-2">Accuracy</p>
          <p className="text-white text-xl">{Math.round((score / activeQuiz.questions.length) * 100)}%</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-gray-400 mb-2">Time Taken</p>
          <p className="text-white text-xl">{activeQuiz.timeLimit * 60 - timer}s</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-gray-400 mb-2">Points Earned</p>
          <p className="text-white text-xl">{points}</p>
        </div>
      </div>

      <div className="bg-gray-700 p-6 rounded-lg mb-8">
        <h3 className="text-white font-medium mb-4">Feedback & Areas for Improvement</h3>
        <p className="text-gray-300">{loading ? 'Generating feedback...' : feedback}</p>
      </div>

      <button
        onClick={() => setActiveQuiz(null)}
        className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
      >
        Back to Quizzes
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      
      <NotesPanel
        isOpen={isNotesPanelOpen}
        onClose={() => setIsNotesPanelOpen(false)}
        notes={notes}
        onNoteSelect={setSelectedNote}
        selectedNote={selectedNote}
      />
      
    <div className="flex-1 flex flex-col">

      <NavBar
          panelToggleButton={
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsNotesPanelOpen(!isNotesPanelOpen)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isNotesPanelOpen ? (
                  <PanelLeftClose className="w-5 h-5" />
                ) : (
                  <PanelLeftOpen className="w-5 h-5" />
                )}
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-white"></span>
              </div>
            </div>
          }
          icon={<BookOpen className="w-6 h-6 text-purple-400" />}
          header={"Quizzes"}
          button1={"Feedback"}
          button2={"Help"}
          button3={"Docs"}
        />

      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {!activeQuiz ? (
            <>
              <div className="grid grid-cols-4 gap-6 mb-8">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400">Total Points</p>
                        <p className="text-2xl font-semibold text-white">{user.dailyPoints || null}</p>
                      </div>
                      <Trophy className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400">Quizzes Completed</p>
                        <p className="text-2xl font-semibold text-white">
                          {quizzes.filter((q) => q.completed).length}/{quizzes.length}
                        </p>
                      </div>
                      <Award className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400">Average Score</p>
                        <p className="text-2xl font-semibold text-white">
                          {quizzes.length > 0
                            ? Math.round(quizzes.reduce((acc, q) => acc + (q.highScore || 0), 0) / quizzes.length)
                            : 0}
                          %
                        </p>
                      </div>
                      <File className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400">Streaks</p>
                        <p className="text-2xl font-semibold text-white">{user.streak}</p>
                      </div>
                      <Flame className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex items-center justify-between mb-8 space-x-4">
                <div className="relative flex-1 max-w-xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search quizzes..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  onClick={() => selectedNote && generateQuiz(selectedNote.content)}
                  disabled={isGenerating || !selectedNote}
                >
                  {isGenerating ? "Generating..." : "Generate Quiz"}
                </button>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === "all" ? "bg-purple-500 text-white" : "text-gray-400"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSelectedCategory("completed")}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === "completed" ? "bg-purple-500 text-white" : "text-gray-400"
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {quizzes
                  .filter((quiz) => selectedCategory === "all" || (selectedCategory === "completed" && quiz.completed))
                  .filter(
                    (quiz) =>
                      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      quiz.subject.toLowerCase().includes(searchQuery.toLowerCase()),
                  )
                  .map((quiz) => renderQuizCard(quiz))}
              </div>
            </>
          ) : showResults ? (
            renderResults()
          ) : (
            renderQuizInterface()
          )}
        </div>
      </div>
    </div>
    <Chatbot />
  </div>
  )
}

export default QuizComponent;