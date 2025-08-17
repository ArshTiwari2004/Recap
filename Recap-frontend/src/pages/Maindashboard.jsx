import React, { useEffect, useState } from 'react';
import { 
  BarChart, LineChart, PieChart, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  BookOpen, Bell, Clock, Target, Brain, Trophy, Users, 
  TrendingUp, Activity, Star, FileText, AlertCircle, Zap, Sparkles , ChevronRight, ChevronLeft , Atom 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Sidebar from '../components/Sidebar';
import NavBar from '@/components/NavBar';
import Chatbot from './ChatBot';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { fireDB } from '../config/Firebaseconfig';
import TimeSpent from '@/components/TimeSpent';
import { getWeekTimeData } from '../services/TimeSpentService';
import { useNavigate } from 'react-router-dom';
import {Link} from 'react-router-dom'; 

const Maindashboard = () => {
  const navigate = useNavigate();

  // Sample data for charts
  const studyProgress = [
    { subject: 'Math', notes: 12, hours: 8 },
    { subject: 'Physics', notes: 8, hours: 6 },
    { subject: 'Chemistry', notes: 15, hours: 10 },
    { subject: 'Biology', notes: 10, hours: 7 }
  ];

  const [activityData, setActivityData] = useState([
    { day: 'Mon', minutes: 0 },
    { day: 'Tue', minutes: 0 },
    { day: 'Wed', minutes: 0 },
    { day: 'Thu', minutes: 0 },
    { day: 'Fri', minutes: 0 },
    { day: 'Sat', minutes: 0 },
    { day: 'Sun', minutes: 0 }
  ]);
  
  const [userStats, setUserStats] = useState({
    totalFlashcards: 0,
    flashcardsToday: 0,
    totalNotesUploaded: 0,
    notesUploadedToday: 0
  });
  const [streak, setStreak] = useState(0);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  console.log("Current User:", currentUser);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!currentUser) return;
      
      try {
        // Fetch flashcards stats
        const userStatsRef = doc(fireDB, "userStats", currentUser.uid);
        const statsSnap = await getDoc(userStatsRef);
        
        // Fetch notes stats
        const notesStatsRef = doc(fireDB, "notesStats", currentUser.uid);
        const notesStatsSnap = await getDoc(notesStatsRef);

        setUserStats({
          totalFlashcards: statsSnap.exists() ? statsSnap.data().totalFlashcards || 0 : 0,
          flashcardsToday: statsSnap.exists() ? statsSnap.data().flashcardsToday || 0 : 0,
          totalNotesUploaded: notesStatsSnap.exists() ? notesStatsSnap.data().totalNotesUploaded || 0 : 0,
          notesUploadedToday: notesStatsSnap.exists() ? notesStatsSnap.data().notesUploadedToday || 0 : 0
        });
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchUserStats();
  }, [currentUser]);

  useEffect(() => {
    const fetchUserStreak = async () => {
      if (!currentUser) return;
      
      try {
        const userRef = doc(fireDB, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setStreak(userSnap.data().streak || 0);
        }
      } catch (error) {
        console.error("Error fetching streak:", error);
      }
    };

    fetchUserStreak();
  }, [currentUser]);

  useEffect(() => {
    const fetchWeeklyActivity = async () => {
      if (!currentUser) return;
      
      try {
        const weekData = await getWeekTimeData(currentUser.uid);
        
        // Map the data to our chart format
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
        
        const updatedActivityData = days.map((day, index) => {
          // Find the corresponding day data from weekData
          const dayData = weekData.find(d => d.dayOfWeek === index);
          return {
            day,
            minutes: dayData ? dayData.minutes : 0
          };
        });

        setActivityData(updatedActivityData);
      } catch (error) {
        console.error("Error fetching weekly activity:", error);
      }
    };

    fetchWeeklyActivity();
  }, [currentUser]);

  console.log("activityData:", activityData);


  return (
  <div className="flex h-screen bg-gray-900">
    <Sidebar />
    
    <div className="flex-1 flex flex-col">
      <NavBar 
        icon={<Activity className="w-6 h-6 text-purple-400" />} 
        header={"Dashboard"} 
        button1={"Feedback"} 
        button2={"Help"} 
        button3={"Docs"}
      />

      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent>
                <TimeSpent />
              </CardContent>
            </Card>
   <Card
      onClick={() => navigate("/leaderboard")}
      className="bg-gray-800 border-gray-700 cursor-pointer transition hover:scale-105"
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <Target className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Your Learning Streak</p>
            <p className="text-xl font-semibold text-white">
              {streak} day{streak !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-purple-400 flex items-center gap-1">
              {streak >= 7 ? (
                <>
                  <Zap className="w-4 h-4" /> Consistency pays off, keep pushing!
                </>
              ) : (
                "You're building a powerful habit, keep going!"
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

            <Card 
            
              onClick={() => navigate("/flashcards")}
      className="bg-gray-800 border-gray-700 cursor-pointer transition hover:scale-105"
            
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Brain className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Flashcards Mastered</p>
                    <p className="text-xl font-semibold text-white">
                      {userStats?.totalFlashcards}
                    </p>
                    <p className="text-xs text-green-400">
                      +{userStats?.flashcardsToday} today, every card makes you sharper!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card    
            onClick={() => navigate("/my-notes")}
            className="bg-gray-800 border-gray-700 cursor-pointer transition hover:scale-105"
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Trophy className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Notes Uploaded</p>
                    <p className="text-xl font-semibold text-white">
                      {userStats.totalNotesUploaded}
                    </p>
                    <p className="text-xs text-green-400">
                      +{userStats.notesUploadedToday} today, your library is growing!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* --- COMMENTED OUT STUDY PROGRESS BY SUBJECT CHART ---
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Study Progress by Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={studyProgress}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="subject" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="notes" fill="#8B5CF6" />
                      <Bar dataKey="hours" fill="#EC4899" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            ------------------------------------------------------ */}

       <div className="flex flex-col gap-4">
  {/* Collaboration Groups Box */}
  <div
    onClick={() => navigate('/collaboration')}
    className="bg-gray-800 border border-gray-700 p-6 rounded-xl cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg flex items-center justify-between"
  >
    <div className="flex items-center gap-4">
      <Users className="w-8 h-8 text-pink-400" />
      <div>
        <h3 className="text-white text-lg font-semibold">Collaboration Groups</h3>
        <p className="text-gray-400 text-sm">View all the groups you have joined</p>
      </div>
    </div>
    <ChevronRight className="w-6 h-6 text-pink-400" />
  </div>

  {/* Quizzes Box */}
  <div
    onClick={() => navigate('/quizzes')}
    className="bg-gray-800 border border-gray-700 p-6 rounded-xl cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg flex items-center justify-between"
  >
    <div className="flex items-center gap-4">
      <FileText className="w-8 h-8 text-pink-400" />
      <div>
        <h3 className="text-white text-lg font-semibold">Quizzes</h3>
        <p className="text-gray-400 text-sm">Generate and view your quizzes</p>
      </div>
    </div>
    <ChevronRight className="w-6 h-6 text-pink-400" />
  </div>


    <div
    onClick={() => navigate('/ai-insights')}
    className="bg-gray-800 border border-gray-700 p-6 rounded-xl cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg flex items-center justify-between"
  >
    <div className="flex items-center gap-4">
      <Atom className="w-8 h-8 text-pink-400" />
      <div>
        <h3 className="text-white text-lg font-semibold">AI Insights</h3>
        <p className="text-gray-400 text-sm">Get insights based on your uploaded notes</p>
      </div>
    </div>
    <ChevronRight className="w-6 h-6 text-pink-400" />
  </div>
</div>

            

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  Weekly Activity of{" "}
                  {currentUser?.displayName?.split(" ")[0] || "User"}
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                        labelStyle={{ color: '#fff' }}
                        formatter={(value) => [`${value} minutes`, 'Time spent']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="minutes" 
                        stroke="#8B5CF6" 
                        strokeWidth={2}
                        dot={{ fill: '#8B5CF6', r: 4 }}
                        activeDot={{ r: 6, fill: '#EC4899' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <p className="text-gray-300">Added new flashcards to Physics</p>
                      <span className="text-gray-500 text-xs">2h ago</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Knowledge Gaps</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="p-1 bg-yellow-500/20 rounded">
                        <Zap className="w-4 h-4 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">Review Quantum Mechanics</p>
                        <p className="text-gray-500 text-xs">AI suggests adding more examples</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Group Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">JD</span>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">John shared Chemistry notes</p>
                        <p className="text-gray-500 text-xs">5m ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default Maindashboard;