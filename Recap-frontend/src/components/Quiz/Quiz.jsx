import React, { useState, useEffect } from 'react';
import { Book, Trophy, Star, Clock, Medal, ChevronRight, ArrowLeft, Check, X, Timer } from 'lucide-react';
import Sidebar from '../Sidebar';

const Quizzes = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [streak, setStreak] = useState(3); // Sample streak count

  // Sample quiz data
  const quizzes = [
    {
      id: 1,
      title: "Quantum Mechanics Basics",
      subject: "Physics",
      difficulty: "Hard",
      questionCount: 10,
      timeLimit: 15,
      questions: [
        {
          question: "What is the principle of superposition?",
          options: [
            "A quantum system can exist in multiple states simultaneously",
            "Particles always move in straight lines",
            "Energy is always conserved",
            "Matter cannot be created or destroyed"
          ],
          correctAnswer: 0,
          explanation: "The superposition principle states that quantum systems can exist in multiple states simultaneously until measured."
        },
        // More questions would be added here
      ]
    },
    {
        id: 2,
        title: "Web Development Fundamentals",
        subject: "Computer Science",
        difficulty: "Medium",
        questionCount: 15,
        timeLimit: 20,
        questions: [
            {
            question: "What does CSS stand for?",
            options: [
                "Creative Style Sheets",
                "Computer Style Sheets",
                "Cascading Style Sheets",
                "Colorful Style Sheets"
            ],
            correctAnswer: 2,
            explanation: "CSS stands for Cascading Style Sheets, which is used for styling web pages."
            },
            // More questions would be added here
        ]   
    },
    {
        id: 3,
        title: "General Knowledge Quiz",
        subject: "General",
        difficulty: "Easy",
        questionCount: 20,
        timeLimit: 25,
        questions: [
            {
            question: "What is the capital of France?",
            options: [
                "London",
                "Berlin",
                "Madrid",
                "Paris"
            ],
            correctAnswer: 3,
            explanation: "The capital of France is Paris, known for its art, fashion, and culture."
            },
            // More questions would be added here
        ]


    },
    {
        id: 4,
        title: "Mathematics Quiz",
        subject: "Mathematics",
        difficulty: "Medium",
        questionCount: 15,
        timeLimit: 20,
        questions: [
            {
            question: "What is the value of pi (π)?",
            options: [
                "3.14",
                "3.141",
                "3.1415",
                "3.14159"
            ],
            correctAnswer: 3,
            explanation: "The value of pi (π) is approximately 3.14159, an irrational number used in mathematics."
            },
        ]
            // More questions would be added here
    },
    {
        id: 5,
        title: "World History Quiz",
        subject: "History",
        difficulty: "Hard",
        questionCount: 10,
        timeLimit: 15,
        questions: [
            {
            question: "Who was the first President of the United States?",
            options: [
                "Thomas Jefferson",
                "George Washington",
                "John Adams",
                "Abraham Lincoln"
            ],
            correctAnswer: 1,
            explanation: "George Washington was the first President of the United States, serving from 1789 to 1797."
            },
        ]
            // More questions would be added
    }


  ];

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setTimer(quiz.timeLimit * 60);
    setUserAnswers([]);
  };

  const handleAnswer = (answerIndex) => {
    const isCorrect = answerIndex === currentQuiz.questions[currentQuestion].correctAnswer;
    setUserAnswers([...userAnswers, { question: currentQuestion, answer: answerIndex, correct: isCorrect }]);
    
    if (isCorrect) setScore(score + 1);
    
    if (currentQuestion + 1 < currentQuiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  useEffect(() => {
    let interval;
    if (currentQuiz && !showResults && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, currentQuiz, showResults]);

  const renderQuizCard = (quiz) => (
    <div key={quiz.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white font-medium text-lg">{quiz.title}</h3>
          <span className="text-gray-400 text-sm">Subject: {quiz.subject}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          quiz.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
          quiz.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
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
          <Book className="w-4 h-4" />
          <span>{quiz.questionCount} questions</span>
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
          <h2 className="text-white text-xl font-medium">{currentQuiz.title}</h2>
          <p className="text-gray-400">Question {currentQuestion + 1} of {currentQuiz.questions.length}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg flex items-center space-x-2">
            <Timer className="w-4 h-4" />
            <span>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
          </div>
          <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>{score} pts</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-white text-lg mb-4">{currentQuiz.questions[currentQuestion].question}</h3>
        <div className="grid grid-cols-1 gap-4">
          {currentQuiz.questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="text-left p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
      <div className="text-center mb-8">
        <Trophy className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h2 className="text-white text-2xl font-medium mb-2">Quiz Complete!</h2>
        <p className="text-gray-400">You scored {score} out of {currentQuiz.questions.length}</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-gray-400 mb-2">Accuracy</p>
          <p className="text-white text-xl">{Math.round((score / currentQuiz.questions.length) * 100)}%</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-gray-400 mb-2">Time Taken</p>
          <p className="text-white text-xl">{currentQuiz.timeLimit * 60 - timer}s</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-gray-400 mb-2">Streak</p>
          <p className="text-white text-xl">{streak} days</p>
        </div>
      </div>

      <button
        onClick={() => setCurrentQuiz(null)}
        className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
      >
        Back to Quizzes
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="h-16 bg-gray-800 border-b border-gray-700 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Book className="w-6 h-6 text-purple-400" />
            <span className="text-lg font-semibold text-white">Quizzes</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <Trophy className="w-5 h-5" />
              <span>1,250 pts</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Medal className="w-5 h-5" />
              <span>{streak} day streak</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {!currentQuiz ? (
              <>
                {/* Tabs */}
                <div className="flex items-center space-x-6 mb-8">
                  {['all', 'bySubject', 'favorites'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        activeTab === tab 
                          ? 'bg-purple-500 text-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {tab === 'all' && <Book className="w-4 h-4" />}
                      {tab === 'bySubject' && <Trophy className="w-4 h-4" />}
                      {tab === 'favorites' && <Star className="w-4 h-4" />}
                      <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                    </button>
                  ))}
                </div>

                {/* Quizzes Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {quizzes.map(quiz => renderQuizCard(quiz))}
                </div>
              </>
            ) : (
              showResults ? renderResults() : renderQuizInterface()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;