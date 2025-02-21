import React, { useState, useEffect } from 'react';
import { useFirebase } from '@/context/FirebaseContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, BookmarkPlus, Filter, Award, ArrowRight, Book, 
  Brain, FileText, TrendingUp, Star, AlertCircle, Clock,
  BookCheck, Trophy,CheckCircle, Moon, Sun
} from 'lucide-react';
import NavBar from './NavBar';
import Sidebar from '../components/Sidebar';
import Chatbot from '@/pages/ChatBot';
import { useGroqService } from '@/services/GroqService';

// Enhanced dummy data with weak topics and related content
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
    weakTopics: ['Cellular Respiration', 'Energy Transfer'],
    relatedNotes: {
      title: 'Photosynthesis Complete Notes',
      url: '/notes/photosynthesis',
      keyPoints: [
        'Light-dependent reactions',
        'Calvin cycle',
        'Factors affecting rate'
      ]
    },
    expectedAnswer: 'Photosynthesis is the process by which plants convert light energy into chemical energy...',
    previousYearPatterns: [
      { year: '2022', marks: 3, variation: 'Focus on cellular level explanation' },
      { year: '2021', marks: 5, variation: 'Environmental impact emphasis' }
    ],
    examTips: [
      'Draw clear diagrams',
      'Mention all stages clearly',
      'Include practical examples'
    ]
  },
  // More dummy questions...
];

const FILTER_OPTIONS = {
  boards: ['CBSE', 'ICSE', 'State Board'],
  subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
  years: ['2023', '2022', '2021', '2020'],
  weakTopics: [
    'Cellular Respiration',
    'Energy Transfer',
    'Chemical Bonding',
    'Organic Chemistry',
    'Mechanics',
    'Calculus'
  ]
};

const QuickRevisionCard = ({ topic, onComplete }) => (
  <Card className="mb-4 hover:shadow-lg transition-shadow">
    <CardContent className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-lg">{topic}</h3>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">15 min revision</Badge>
            <Badge variant="outline" className="bg-green-50">Quick Tips</Badge>
          </div>
        </div>
        <Button onClick={onComplete} variant="outline" size="sm">
          <BookCheck className="w-4 h-4 mr-2" />
          Mark as Revised
        </Button>
      </div>
    </CardContent>
  </Card>
);

const LastMinutePrep = () => {
  const [examTime, setExamTime] = useState(null);
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [timeUnit, setTimeUnit] = useState("hours");
  const [timeValue, setTimeValue] = useState("");
  const [subject, setSubject] = useState("");
  const [recommendations, setRecommendations] = useState(null);
  
  const { generateTimeBasedRecommendations, loading, error } = useGroqService();

  const handleTimeSubmit = async () => {
    const hours = timeUnit === "days" ? parseInt(timeValue) * 24 : parseInt(timeValue);
    setExamTime(hours);

    try {
      const result = await generateTimeBasedRecommendations(hours, subject || "general");
      setRecommendations(result);
    } catch (error) {
      console.error("Failed to get recommendations:", error);
    }

    setShowTimeInput(false);
  };

  const renderIcon = (iconName) => {
    const icons = {
      "Clock": <Clock className="w-6 h-6 text-purple-600 mb-2" />,
      "Brain": <Brain className="w-6 h-6 text-purple-600 mb-2" />,
      "Trophy": <Trophy className="w-6 h-6 text-purple-600 mb-2" />,
      "BookOpen": <BookOpen className="w-6 h-6 text-purple-600 mb-2" />,
      "FileText": <FileText className="w-6 h-6 text-purple-600 mb-2" />,
      "TrendingUp": <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />,
      "AlertCircle": <AlertCircle className="w-6 h-6 text-purple-600 mb-2" />,
      "CheckCircle": <CheckCircle className="w-6 h-6 text-purple-600 mb-2" />,
      "Moon": <Moon className="w-6 h-6 text-purple-600 mb-2" />,
      "Sun": <Sun className="w-6 h-6 text-purple-600 mb-2" />,
    };
    return icons[iconName] || <Clock className="w-6 h-6 text-purple-600 mb-2" />;
  };

  return (
    <Card className="mb-6 bg-purple-50 relative">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          {recommendations?.title || "Last Minute Preparation Guide"}
        </CardTitle>
        <Button variant="outline" size="sm" className="ml-auto" onClick={() => setShowTimeInput(!showTimeInput)}>
          <Clock className="w-4 h-4 mr-2" />
          How much time is left for your exam?
        </Button>
      </CardHeader>

      {showTimeInput && (
        <div className="absolute right-6 top-16 bg-white p-4 rounded-lg shadow-lg z-10 border">
          <div className="flex flex-col gap-2 mb-4">
            <Input type="number" placeholder="Enter time" value={timeValue} onChange={(e) => setTimeValue(e.target.value)} className="w-full" />
            <Select value={timeUnit} onValueChange={setTimeUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Subject (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full" />
          </div>
          <Button size="sm" onClick={handleTimeSubmit} className="w-full" disabled={loading}>
            {loading ? "Generating..." : "Get Personalized Plan"}
          </Button>
        </div>
      )}

      <CardContent>
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">Failed to generate recommendations. Please try again.</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations ? (
            recommendations.cards.map((card, index) => (
              <div key={index} className="p-4 bg-white rounded-lg">
                {renderIcon(card.icon)}
                <h3 className="font-medium mb-2">{card.title}</h3>
                <ul className="text-sm space-y-2">
                  {card.items.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <>
              <div className="p-4 bg-white rounded-lg">
                <Clock className="w-6 h-6 text-purple-600 mb-2" />
                <h3 className="font-medium mb-2">24 Hours Left</h3>
                <ul className="text-sm space-y-2">
                  <li>• Review high-weightage topics</li>
                  <li>• Practice previous year questions</li>
                  <li>• Focus on weak areas</li>
                </ul>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <Brain className="w-6 h-6 text-purple-600 mb-2" />
                <h3 className="font-medium mb-2">12 Hours Left</h3>
                <ul className="text-sm space-y-2">
                  <li>• Quick revision of formulas</li>
                  <li>• Solve quick practice tests</li>
                  <li>• Review marking scheme</li>
                </ul>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <Trophy className="w-6 h-6 text-purple-600 mb-2" />
                <h3 className="font-medium mb-2">6 Hours Left</h3>
                <ul className="text-sm space-y-2">
                  <li>• Mental preparation</li>
                  <li>• Light revision only</li>
                  <li>• Rest and relax</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};


const PYQPractice = () => {
  const [filters, setFilters] = useState({
    board: '',
    subject: '',
    year: '',
    weakTopic: ''
  });
  const [questions, setQuestions] = useState(DUMMY_QUESTIONS);
  const [filteredQuestions, setFilteredQuestions] = useState(DUMMY_QUESTIONS);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeTab, setActiveTab] = useState('practice');
  const [revisedTopics, setRevisedTopics] = useState(new Set());
  const [showingNotes, setShowingNotes] = useState(false);

  useEffect(() => {
    // Filter questions based on all criteria
    let filtered = questions;
    
    if (filters.board) {
      filtered = filtered.filter(q => q.board === filters.board);
    }
    if (filters.subject) {
      filtered = filtered.filter(q => q.subject === filters.subject);
    }
    if (filters.year) {
      filtered = filtered.filter(q => q.year === filters.year);
    }
    if (filters.weakTopic) {
      filtered = filtered.filter(q => q.weakTopics.includes(filters.weakTopic));
    }
    
    setFilteredQuestions(filtered);
  }, [filters, questions]);

  const handleAnswerSubmit = async () => {
    if (!userAnswer.trim()) {
      toast.error('Please write an answer before submitting');
      return;
    }

    setIsEvaluating(true);
    try {
      // Simulated evaluation result
      const evaluationResult = {
        score: 8,
        overallFeedback: "Strong understanding shown with good examples",
        strengths: ["Clear explanation", "Good use of terminology"],
        improvements: ["Add more specific examples", "Expand on practical applications"],
        keyConceptsMissing: ["Environmental impact", "Rate limiting factors"],
        technicalAccuracy: "Mostly accurate with minor oversights",
        structureAndPresentation: "Well-structured response with clear paragraphs",
        examTips: ["Include diagrams", "Mention real-world applications"],
        recommendedStudyResources: ["Chapter 5 review", "Practice more diagram-based questions"]
      };
      setEvaluation(evaluationResult);
      toast.success('Answer evaluated successfully!');
    } catch (error) {
      toast.error('Failed to evaluate answer');
    } finally {
      setIsEvaluating(false);
    }
  };

  const toggleBookmark = (questionId) => {
    setBookmarkedQuestions(prev => {
      const newBookmarked = new Set(prev);
      if (newBookmarked.has(questionId)) {
        newBookmarked.delete(questionId);
      } else {
        newBookmarked.add(questionId);
      }
      return newBookmarked;
    });
  };

  const toggleTopicRevised = (topic) => {
    setRevisedTopics(prev => {
      const newRevised = new Set(prev);
      if (newRevised.has(topic)) {
        newRevised.delete(topic);
      } else {
        newRevised.add(topic);
      }
      return newRevised;
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar />
        <div className="flex-1 overflow-auto p-6">
          <LastMinutePrep />
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="practice">
                <BookOpen className="w-4 h-4 mr-2" />
                Practice Questions
              </TabsTrigger>
              <TabsTrigger value="weakTopics">
                <BookOpen className="w-4 h-4 mr-2" />
                Weak Topics
              </TabsTrigger>
              <TabsTrigger value="bookmarks">
                <Star className="w-4 h-4 mr-2" />
                Bookmarked
              </TabsTrigger>
            </TabsList>

            <TabsContent value="practice">
              {/* Previous filters and practice area code remains the same */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Filters Card */}
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Filter Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-4">
                    <Select 
                      value={filters.board}
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
                      value={filters.subject}
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
                      value={filters.year}
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

                    <Select 
                      value={filters.weakTopic}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, weakTopic: value }))}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Weak Topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {FILTER_OPTIONS.weakTopics.map(topic => (
                          <SelectItem key={topic} value={topic}>{topic}</SelectItem>
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
                      Questions ({filteredQuestions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {filteredQuestions.map((q) => (
                      <div
                        key={q.id}
                        className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 relative"
                        onClick={() => setCurrentQuestion(q)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium mb-2">{q.question.substring(0, 100)}...</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {q.weakTopics.map(topic => (
                                <Badge key={topic} variant="outline" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
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
                            <div>
                              <h3 className="font-medium">Question ({currentQuestion.marks} marks)</h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {currentQuestion.weakTopics.map(topic => (
                                  <Badge key={topic} variant="outline">{topic}</Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowingNotes(!showingNotes)}
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                {showingNotes ? 'Hide Notes' : 'View Notes'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {/* Handle previous patterns */}}
                              >
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Past Patterns
                              </Button>
                            </div>
                          </div>
                          <p>{currentQuestion.question}</p>

                          {showingNotes && currentQuestion.relatedNotes && (
                            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                              <h4 className="font-medium mb-2">Quick Reference Notes</h4>
                              <h5 className="text-sm font-medium text-purple-700">
                                {currentQuestion.relatedNotes.title}
                              </h5>
                              <ul className="mt-2 space-y-1">
                                {currentQuestion.relatedNotes.keyPoints.map((point, idx) => (
                                  <li key={idx} className="text-sm">• {point}</li>
                                ))}
                              </ul>
                            </div>
                          )}
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

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Technical Accuracy</h4>
                                  <p className="text-sm text-gray-600">{evaluation.technicalAccuracy}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Structure & Presentation</h4>
                                  <p className="text-sm text-gray-600">{evaluation.structureAndPresentation}</p>
                                </div>
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

            <TabsContent value="weakTopics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Your Weak Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {FILTER_OPTIONS.weakTopics.map(topic => (
                      <QuickRevisionCard
                        key={topic}
                        topic={topic}
                        onComplete={() => toggleTopicRevised(topic)}
                      />
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Related Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredQuestions
                      .filter(q => q.weakTopics.some(t => filters.weakTopic === t))
                      .map(q => (
                        <div
                          key={q.id}
                          className="p-4 border rounded-lg mb-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            setCurrentQuestion(q);
                            setActiveTab('practice');
                          }}
                        >
                          <p className="font-medium mb-2">{q.question}</p>
                          <div className="flex gap-2 text-sm text-gray-500">
                            <span>{q.board}</span>
                            <span>•</span>
                            <span>{q.subject}</span>
                            <span>•</span>
                            <span>{q.marks} marks</span>
                          </div>
                        </div>
                      ))}
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
      <Chatbot />
    </div>
  );
};

export default PYQPractice;