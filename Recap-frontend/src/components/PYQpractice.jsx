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
import toast from 'react-hot-toast';

// Enhanced dummy data with weak topics and related content
// Example questions data structure for Class 12 PCM
const DUMMY_QUESTIONS = [
  {
    id: "phy001",
    board: "CBSE",
    subject: "Physics",
    year: "2022",
    question: "A cyclotron frequency of a charged particle with charge q and mass m in a magnetic field of B is given by f = qB/(2πm). A proton and an alpha particle enter the same magnetic field perpendicularly. Calculate and explain the ratio of their cyclotron frequencies (fproton/falpha).",
    marks: 5,
    weakTopics: ["Electromagnetic Induction", "Charged Particles in Fields"],
    relatedNotes: {
      title: "Motion of Charged Particles in Magnetic Fields",
      keyPoints: [
        "Cyclotron frequency f = qB/(2πm)",
        "Alpha particle: q = 2e, m = 4m_p",
        "Circular motion occurs due to Lorentz force",
        "Radius of circular path r = mv/(qB)"
      ]
    }
  },
  {
    id: "chem001",
    board: "CBSE",
    subject: "Chemistry",
    year: "2022",
    question: "Explain the following observations: (a) Transition metals exhibit variable oxidation states. (b) Zn, Cd and Hg are not considered as transition elements. (c) The E° value for Mn³⁺/Mn²⁺ is much more positive than that for Cr³⁺/Cr²⁺.",
    marks: 5,
    weakTopics: ["Transition Elements", "Coordination Chemistry"],
    relatedNotes: {
      title: "Properties of d-block Elements",
      keyPoints: [
        "Variable oxidation states due to involvement of (n-1)d and ns electrons",
        "Transition elements have partially filled d-orbitals",
        "Zn, Cd, Hg have completely filled d-orbitals (d¹⁰)",
        "Electrode potentials depend on electronic configuration and nuclear charge"
      ]
    }
  },
  {
    id: "math001",
    board: "CBSE",
    subject: "Mathematics",
    year: "2022",
    question: "Using integration, find the area of the region bounded by the curves y = sin x, y = cos x between x = 0 and x = π/4.",
    marks: 6,
    weakTopics: ["Integral Calculus", "Area Under Curves"],
    relatedNotes: {
      title: "Area Under Curves",
      keyPoints: [
        "Area = ∫[upper - lower] dx between the limits",
        "For intersecting curves, find points of intersection first",
        "For single variable functions, area = ∫f(x)dx between limits",
        "Use substitution or integration by parts for complex functions"
      ]
    }
  },
  {
    id: "phy002",
    board: "CBSE",
    subject: "Physics",
    year: "2021",
    question: "A parallel plate capacitor with plate area A and separation d is filled with three dielectric materials of equal thickness d/3 with dielectric constants K₁, K₂, and K₃ as shown. Derive an expression for the equivalent capacitance of this combination.",
    marks: 5,
    weakTopics: ["Electrostatics", "Capacitors"],
    relatedNotes: {
      title: "Capacitors with Dielectrics",
      keyPoints: [
        "Capacitance of parallel plate capacitor C = ε₀A/d",
        "With dielectric: C = Kε₀A/d where K is dielectric constant",
        "For series combination of capacitors: 1/C = 1/C₁ + 1/C₂ + 1/C₃",
        "Equivalent dielectric constant: 3/(1/K₁ + 1/K₂ + 1/K₃)"
      ]
    }
  },
  {
    id: "chem002",
    board: "CBSE",
    subject: "Chemistry",
    year: "2021",
    question: "Calculate the emf of the following cell at 25°C: Fe(s) | Fe²⁺(0.001 M) || H⁺(0.01 M) | H₂(g)(1 atm), Pt(s). Given: E°(Fe²⁺/Fe) = -0.44 V and E°(H⁺/H₂) = 0.00 V.",
    marks: 5,
    weakTopics: ["Electrochemistry", "Nernst Equation"],
    relatedNotes: {
      title: "Electrochemical Cells and Nernst Equation",
      keyPoints: [
        "Nernst equation: E = E° - (RT/nF)ln Q",
        "Standard conditions: 298K, 1M concentration, 1 atm pressure",
        "Cell notation: Anode | Anolyte || Catholyte | Cathode",
        "Cell potential: E(cell) = E(cathode) - E(anode)"
      ]
    }
  },
  {
    id: "math002",
    board: "CBSE",
    subject: "Mathematics",
    year: "2021", 
    question: "Find the particular solution of the differential equation (dy/dx) + y cot x = 2 cosec x, given that y = 0 when x = π/2.",
    marks: 6,
    weakTopics: ["Differential Equations", "First Order ODEs"],
    relatedNotes: {
      title: "First Order Linear Differential Equations",
      keyPoints: [
        "Linear form: dy/dx + Py = Q",
        "Integrating factor: e^∫P dx",
        "Solution: y·IF = ∫(Q·IF)dx + C",
        "Apply initial condition to find value of C"
      ]
    }
  },
  {
    id: "phy003",
    board: "CBSE",
    subject: "Physics",
    year: "2020",
    question: "A long straight wire carries a current I. A proton moves parallel to the wire with velocity v at a distance r from it. Derive an expression for the force experienced by the proton. What happens if the proton moves in the opposite direction?",
    marks: 5,
    weakTopics: ["Magnetism", "Magnetic Force"],
    relatedNotes: {
      title: "Magnetic Field Due to Current-Carrying Wire",
      keyPoints: [
        "Magnetic field due to long straight wire: B = μ₀I/(2πr)",
        "Direction determined by right-hand thumb rule",
        "Force on charged particle: F = q(v×B)",
        "Direction given by Fleming's left-hand rule"
      ]
    }
  },
  {
    id: "chem003",
    board: "CBSE", 
    subject: "Chemistry",
    year: "2020",
    question: "Describe the principle behind the zone refining method used for the purification of metals. Which property of the impurity makes this process possible? Name two metals that can be purified using this method.",
    marks: 5,
    weakTopics: ["Metallurgy", "Purification Methods"],
    relatedNotes: {
      title: "Purification of Metals",
      keyPoints: [
        "Zone refining based on difference in solubility in solid and liquid phases",
        "Impurities have lower melting points than pure metals",
        "Segregation coefficient k = CS/CL determines effectiveness",
        "Used for semiconductor materials like Si, Ge and metals like Ga, In"
      ]
    }
  },
  {
    id: "math003",
    board: "CBSE",
    subject: "Mathematics", 
    year: "2020",
    question: "A vector r⃗(t) = (t²-t)i⃗ + (2t²+t)j⃗ + (t³-t)k⃗ represents the position of a particle moving in space, where t is time. Find the velocity and acceleration vectors at time t. Also, determine the speed of the particle at t = 1.",
    marks: 6,
    weakTopics: ["Vector Calculus", "Kinematics"],
    relatedNotes: {
      title: "Vector Differentiation",
      keyPoints: [
        "Velocity vector v⃗ = dr⃗/dt",
        "Acceleration vector a⃗ = dv⃗/dt = d²r⃗/dt²",
        "Speed = |v⃗| = √(v·v)",
        "Direction of motion given by unit vector v⃗/|v⃗|"
      ]
    }
  },
  {
    id: "phy004",
    board: "CBSE",
    subject: "Physics",
    year: "2019",
    question: "In Young's double slit experiment, the slits are separated by 0.5 mm and the screen is placed 1 m away. A beam of light consisting of two wavelengths 650 nm and 520 nm is used to obtain interference fringes. Find the minimum distance from the central maximum where the bright fringes of the two wavelengths overlap.",
    marks: 5,
    weakTopics: ["Wave Optics", "Interference"],
    relatedNotes: {
      title: "Young's Double Slit Experiment",
      keyPoints: [
        "Position of nth bright fringe: yn = nλD/d",
        "Fringe width: β = λD/d",
        "For overlapping fringes: n₁λ₁ = n₂λ₂",
        "Path difference condition: Δx = d sinθ"
      ]
    }
  }
];

// Filter options for the application
const FILTER_OPTIONS = {
  boards: ["CBSE", "ICSE", "State Board"],
  subjects: ["Physics", "Chemistry", "Mathematics"],
  years: ["2019", "2020", "2021", "2022", "2023"],
  weakTopics: [
    "Electromagnetic Induction", 
    "Charged Particles in Fields",
    "Electrostatics", 
    "Capacitors",
    "Magnetism", 
    "Magnetic Force",
    "Wave Optics", 
    "Interference",
    "Transition Elements", 
    "Coordination Chemistry",
    "Electrochemistry", 
    "Nernst Equation",
    "Metallurgy", 
    "Purification Methods",
    "Integral Calculus", 
    "Area Under Curves",
    "Differential Equations", 
    "First Order ODEs",
    "Vector Calculus", 
    "Kinematics"
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

  // Render the appropriate icon based on the icon name
  const renderIcon = (iconName) => {
    const icons = {
      book: <Book className="w-5 h-5 text-blue-500 mb-2" />,
      brain: <Brain className="w-5 h-5 text-purple-500 mb-2" />,
      clock: <Clock className="w-5 h-5 text-orange-500 mb-2" />,
      trophy: <Trophy className="w-5 h-5 text-green-500 mb-2" />
    };
    
    return icons[iconName] || <CheckCircle className="w-5 h-5 text-gray-500 mb-2" />;
  };

  const handleTimeSubmit = async () => {
    if (!timeValue || isNaN(parseInt(timeValue))) {
      alert("Please enter a valid time value");
      return;
    }

    const hours = timeUnit === "days" ? parseInt(timeValue) * 24 : parseInt(timeValue);
    setExamTime(hours);
  
    try {
      const result = await generateTimeBasedRecommendations(hours, subject || "general");
      
      // Check if result exists
      if (!result) {
        throw new Error("No response received");
      }
      
      setRecommendations(result);
      setShowTimeInput(false);
    } catch (error) {
      console.error("Failed to get recommendations:", error);
      // Keep time input open so user can try again
    }
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
            <Input 
              type="number" 
              placeholder="Enter time" 
              value={timeValue} 
              onChange={(e) => setTimeValue(e.target.value)} 
              className="w-full" 
            />
            <Select value={timeUnit} onValueChange={setTimeUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              placeholder="Subject (optional)" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              className="w-full" 
            />
          </div>
          <Button size="sm" onClick={handleTimeSubmit} className="w-full" disabled={loading}>
            {loading ? "Generating..." : "Get Personalized Plan"}
          </Button>
        </div>
      )}

      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            Failed to generate recommendations. Please try again.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations?.cards ? (
            recommendations.cards.map((card, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-sm">
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
            <div className="col-span-3 text-center py-6 text-gray-500">
              Enter time left for your exam to get personalized recommendations
            </div>
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
      let evaluationResult;
      
      // Use the actual Groq service if available, otherwise fall back to mock
      if (import.meta.env.VITE_GROQ_API_KEY === "true" && import.meta.env.VITE_GROQ_API_KEY) {
        // Import dynamically to avoid server-side issues
        const { evaluateAnswer } = await import('@/services/answerEvaluationService');
        evaluationResult = await evaluateAnswer(currentQuestion, userAnswer);
      } else {
        // Use mock evaluation for development/testing
        const { mockEvaluateAnswer } = await import('@/services/answerEvaluationService');
        evaluationResult = mockEvaluateAnswer(currentQuestion, userAnswer);
        console.log("Mock evaluation result:", evaluationResult);
      }
      
      setEvaluation(evaluationResult);
      toast.success('Answer evaluated successfully!');
      
      // Optional: Track weak topics based on evaluation
      if (evaluationResult.score < 6) {
        // Add to weak topics if score is low
        const newWeakTopics = [...currentQuestion.weakTopics];
        // Update user profile or state with these weak topics
      }
      
    } catch (error) {
      console.error("Evaluation error:", error);
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