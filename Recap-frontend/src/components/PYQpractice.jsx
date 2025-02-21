import React, { useState, useEffect } from 'react';
import { useFirebase } from '@/context/FirebaseContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, BookmarkPlus, Filter, Award, ArrowRight } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { fireDB } from '../config/Firebaseconfig';
import toast from 'react-hot-toast';
import NavBar from './NavBar';
import Sidebar from '../components/Sidebar';
import Chatbot from '@/pages/ChatBot';

// Dummy data - replace with Firebase fetch later
const DUMMY_QUESTIONS = [
  {
    id: '1',
    question: 'Explain the process of photosynthesis and its importance in the ecosystem.',
    subject: 'Biology',
    board: 'CBSE',
    year: '2023',
    marks: 5,
    expectedAnswer: 'Photosynthesis is the process by which plants convert light energy into chemical energy...',
  },
  {
    id: '2',
    question: 'Derive the quadratic formula and solve the equation: ax² + bx + c = 0',
    subject: 'Mathematics',
    board: 'CBSE',
    year: '2023',
    marks: 6,
    expectedAnswer: 'The quadratic formula is derived from completing the square method...',
  },
  // Add more dummy questions as needed
];

const FILTER_OPTIONS = {
  boards: ['CBSE', 'ICSE', 'State Board'],
  subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
  years: ['2023', '2022', '2021', '2020'],
};

const PYQPractice = () => {
  const { currentUser } = useFirebase();
  const [filters, setFilters] = useState({
    board: '',
    subject: '',
    year: '',
  });
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());

  useEffect(() => {
    // Initially load questions based on dummy data
    setQuestions(DUMMY_QUESTIONS);
  }, []);

  const handleFilterChange = (value, filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    
    // In real implementation, fetch from Firebase based on filters
    const filteredQuestions = DUMMY_QUESTIONS.filter(q => 
      (!filters.board || q.board === filters.board) &&
      (!filters.subject || q.subject === filters.subject) &&
      (!filters.year || q.year === filters.year)
    );
    setQuestions(filteredQuestions);
  };

  const handleQuestionSelect = (question) => {
    setCurrentQuestion(question);
    setUserAnswer('');
    setEvaluation(null);
  };

  const handleAnswerSubmit = async () => {
    if (!userAnswer.trim()) {
      toast.error('Please write an answer before submitting');
      return;
    }

    // Simulate AI evaluation (replace with actual Cohere API call)
    try {
      // Placeholder for Cohere API integration
      const simulatedEvaluation = {
        score: Math.floor(Math.random() * 5) + 1,
        feedback: "Your answer shows good understanding but could be improved by including more specific examples and technical terms. Consider elaborating on the key concepts and their relationships.",
        improvements: [
          "Add more specific examples",
          "Use more technical terminology",
          "Improve structure and organization"
        ]
      };

      setEvaluation(simulatedEvaluation);
      toast.success('Answer evaluated successfully!');
    } catch (error) {
      toast.error('Failed to evaluate answer');
      console.error('Evaluation error:', error);
    }
  };

  const toggleBookmark = async (questionId) => {
    const newBookmarked = new Set(bookmarkedQuestions);
    if (newBookmarked.has(questionId)) {
      newBookmarked.delete(questionId);
    } else {
      newBookmarked.add(questionId);
    }
    setBookmarkedQuestions(newBookmarked);
    toast.success(newBookmarked.has(questionId) ? 'Question bookmarked!' : 'Bookmark removed');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar />
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Filters Section */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Select onValueChange={(value) => handleFilterChange(value, 'board')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Board" />
                  </SelectTrigger>
                  <SelectContent>
                    {FILTER_OPTIONS.boards.map(board => (
                      <SelectItem key={board} value={board}>{board}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => handleFilterChange(value, 'subject')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {FILTER_OPTIONS.subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => handleFilterChange(value, 'year')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {FILTER_OPTIONS.years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Questions List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 relative"
                    onClick={() => handleQuestionSelect(q)}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium">{q.question.substring(0, 100)}...</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(q.id);
                        }}
                      >
                        <BookmarkPlus
                          className={`w-5 h-5 ${
                            bookmarkedQuestions.has(q.id) ? 'text-purple-500 fill-current' : 'text-gray-400'
                          }`}
                        />
                      </Button>
                    </div>
                    <div className="flex gap-2 mt-2 text-xs text-gray-500">
                      <span>{q.board}</span>
                      <span>•</span>
                      <span>{q.subject}</span>
                      <span>•</span>
                      <span>{q.year}</span>
                      <span>•</span>
                      <span>{q.marks} marks</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Answer Section */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Practice Area
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQuestion ? (
                  <>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium mb-2">Question ({currentQuestion.marks} marks)</h3>
                      <p>{currentQuestion.question}</p>
                    </div>
                    <Textarea
                      placeholder="Write your answer here..."
                      className="min-h-[200px]"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                    />
                    <Button
                      className="w-full"
                      onClick={handleAnswerSubmit}
                    >
                      Submit for Evaluation
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    {evaluation && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium mb-2">AI Evaluation</h3>
                        <div className="space-y-2">
                          <p>Score: {evaluation.score}/5</p>
                          <p>Feedback: {evaluation.feedback}</p>
                          <div>
                            <p className="font-medium">Areas for Improvement:</p>
                            <ul className="list-disc list-inside">
                              {evaluation.improvements.map((imp, index) => (
                                <li key={index}>{imp}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Select a question from the list to start practicing
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Chatbot/>
    </div>
  );
};

export default PYQPractice;