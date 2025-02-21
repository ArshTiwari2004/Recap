import React, { useState, useEffect } from 'react';
import { useFirebase } from '@/context/FirebaseContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, BookmarkPlus, Filter, Award, ArrowRight, 
  Book, Brain, FileText, TrendingUp, Star, AlertCircle 
} from 'lucide-react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { fireDB } from '../config/Firebaseconfig';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from '../components/Sidebar';
import Chatbot from '@/pages/ChatBot';

// Dummy data structure
const DUMMY_QUESTIONS = [
  {
    id: '1',
    question: 'Explain the process of photosynthesis and its importance in the ecosystem.',
    subject: 'Biology',
    board: 'CBSE',
    year: '2023',
    marks: 5,
    chapter: 'Life Processes',
    difficulty: 'Medium',
    expectedAnswer: 'Photosynthesis is the process by which plants convert light energy into chemical energy...',
  },
  // Add more dummy questions
];

const FILTER_OPTIONS = {
  boards: ['CBSE', 'ICSE', 'State Board'],
  subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
  years: ['2023', '2022', '2021', '2020'],
};

const PYQPractice = () => {
  const navigate = useNavigate();
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
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeTab, setActiveTab] = useState('practice');

  // AI Evaluation using Cohere
  const evaluateAnswer = async (questionContent, userAnswer) => {
    const prompt = `As an expert education evaluator, analyze this student's answer for a ${filters.board} board ${filters.subject} question.

Question: ${questionContent}

Student's Answer: ${userAnswer}

Provide a detailed evaluation in JSON format with the following structure:
{
  "score": <number between 0-10>,
  "overallFeedback": "<comprehensive feedback>",
  "strengths": [
    "<list key strong points>"
  ],
  "improvements": [
    "<list specific areas for improvement>"
  ],
  "keyConceptsMissing": [
    "<list important concepts that were omitted>"
  ],
  "technicalAccuracy": "<assessment of technical accuracy>",
  "structureAndPresentation": "<feedback on answer structure>",
  "examTips": [
    "<specific exam-oriented suggestions>"
  ],
  "recommendedStudyResources": [
    "<suggested study materials or topics>"
  ]
}`;

    try {
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
      return JSON.parse(data.generations[0].text);
    } catch (error) {
      console.error('AI Evaluation failed:', error);
      throw error;
    }
  };

  const handleAnswerSubmit = async () => {
    if (!userAnswer.trim()) {
      toast.error('Please write an answer before submitting');
      return;
    }

    setIsEvaluating(true);
    try {
      const evaluationResult = await evaluateAnswer(currentQuestion.question, userAnswer);
      setEvaluation(evaluationResult);
      toast.success('Answer evaluated successfully!');
    } catch (error) {
      toast.error('Failed to evaluate answer');
      console.error('Evaluation error:', error);
    } finally {
      setIsEvaluating(false);
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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="practice">
                <BookOpen className="w-4 h-4 mr-2" />
                Practice
              </TabsTrigger>
              <TabsTrigger value="bookmarks">
                <Star className="w-4 h-4 mr-2" />
                Bookmarked
              </TabsTrigger>
            </TabsList>

            <TabsContent value="practice">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Filters Card */}
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Filter Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-4">
                    <Select 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, board: value }))}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Board" />
                      </SelectTrigger>
                      <SelectContent>
                        {FILTER_OPTIONS.boards.map(board => (
                          <SelectItem key={board} value={board}>{board}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, subject: value }))}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {FILTER_OPTIONS.subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, year: value }))}>
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
                        onClick={() => setCurrentQuestion(q)}
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

                {/* Practice Area */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Practice Area
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentQuestion ? (
                      <div className="space-y-6">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-medium">Question ({currentQuestion.marks} marks)</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate('/view-notes')}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View Related Notes
                            </Button>
                          </div>
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
                          disabled={isEvaluating}
                        >
                          {isEvaluating ? (
                            'Evaluating...'
                          ) : (
                            <>
                              Submit for Evaluation
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>

                        {evaluation && (
                          <Card className="mt-6">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Brain className="w-5 h-5" />
                                AI Evaluation Results
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center gap-4">
                                <div className="bg-purple-100 p-4 rounded-lg">
                                  <p className="text-2xl font-bold text-purple-600">
                                    {evaluation.score}/10
                                  </p>
                                  <p className="text-sm text-purple-600">Score</p>
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">Overall Feedback</p>
                                  <p className="text-gray-600">{evaluation.overallFeedback}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <Star className="w-4 h-4 text-green-500" />
                                    Strengths
                                  </h4>
                                  <ul className="list-disc list-inside space-y-1">
                                    {evaluation.strengths.map((strength, idx) => (
                                      <li key={idx} className="text-sm text-gray-600">{strength}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-blue-500" />
                                    Areas for Improvement
                                  </h4>
                                  <ul className="list-disc list-inside space-y-1">
                                    {evaluation.improvements.map((improvement, idx) => (
                                      <li key={idx} className="text-sm text-gray-600">{improvement}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4 text-orange-500" />
                                  Missing Key Concepts
                                </h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {evaluation.keyConceptsMissing.map((concept, idx) => (
                                    <li key={idx} className="text-sm text-gray-600">{concept}</li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Technical Accuracy</h4>
                                <p className="text-sm text-gray-600">{evaluation.technicalAccuracy}</p>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Structure & Presentation</h4>
                                <p className="text-sm text-gray-600">{evaluation.structureAndPresentation}</p>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <Book className="w-4 h-4 text-purple-500" />
                                  Exam Tips
                                  </h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {evaluation.examTips.map((tip, idx) => (
                                    <li key={idx} className="text-sm text-gray-600">{tip}</li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Recommended Study Resources</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {evaluation.recommendedStudyResources.map((resource, idx) => (
                                    <li key={idx} className="text-sm text-gray-600">{resource}</li>
                                  ))}
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Select a question from the list to start practicing
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="bookmarks">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Bookmarked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from(bookmarkedQuestions).map(questionId => {
                      const question = questions.find(q => q.id === questionId);
                      if (!question) return null;

                      return (
                        <div
                          key={question.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            setCurrentQuestion(question);
                            setActiveTab('practice');
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium mb-2">{question.question}</p>
                              <div className="flex gap-2 text-sm text-gray-500">
                                <span>{question.board}</span>
                                <span>•</span>
                                <span>{question.subject}</span>
                                <span>•</span>
                                <span>{question.year}</span>
                                <span>•</span>
                                <span>{question.marks} marks</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(question.id);
                              }}
                            >
                              <Star className="w-5 h-5 text-purple-500 fill-current" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    {bookmarkedQuestions.size === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No bookmarked questions yet. Star questions while practicing to see them here.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Chatbot/>
    </div>
  );
};

export default PYQPractice;