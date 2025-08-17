import React, { useEffect, useState } from 'react';
import { 
  BarChart, LineChart, PieChart, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  BookOpen, Bell, Clock, Target, Brain, Trophy, Users, 
  TrendingUp, Activity, Star, FileText, AlertCircle, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Sidebar from '../components/Sidebar';
import NavBar from '@/components/NavBar';
import Chatbot from './ChatBot';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { fireDB } from '../config/Firebaseconfig';
import TimeSpent from '@/components/TimeSpent';


const Maindashboard = () => {
  // Sample data for charts
  const studyProgress = [
    { subject: 'Math', notes: 12, hours: 8 },
    { subject: 'Physics', notes: 8, hours: 6 },
    { subject: 'Chemistry', notes: 15, hours: 10 },
    { subject: 'Biology', notes: 10, hours: 7 }
  ];

  const activityData = [
    { day: 'Mon', minutes: 120 },
    { day: 'Tue', minutes: 90 },
    { day: 'Wed', minutes: 150 },
    { day: 'Thu', minutes: 80 },
    { day: 'Fri', minutes: 160 },
    { day: 'Sat', minutes: 40 },
    { day: 'Sun', minutes: 100 }
  ];
const [userStats, setUserStats] = useState({
    totalFlashcards: 0,
    flashcardsToday: 0
  });
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [streak, setStreak] = useState(0);


  console.log("current user:", currentUser);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!currentUser) return;
      
      try {
        const userStatsRef = doc(fireDB, "userStats", currentUser.uid);
        const statsSnap = await getDoc(userStatsRef);
        
        if (statsSnap.exists()) {
          setUserStats({
            totalFlashcards: statsSnap.data().totalFlashcards || 0,
            flashcardsToday: statsSnap.data().flashcardsToday || 0
          });
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchUserStats();
  }, [currentUser]);

  console.log("User Stats:", userStats);

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

  
  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Navbar */}

        <NavBar icon={<Activity className="w-6 h-6 text-purple-400" />} header={"Dashboard"} button1={"Feedback"} button2={"Help"} button3={"Docs"}/>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
       <Card className="bg-gray-800 border-gray-700">
  <CardContent>
    <TimeSpent />
  </CardContent>
</Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <Target className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Study Streak</p>
                      <p className="text-xl font-semibold text-white">{streak} day{streak !== 1 ? 's' : ''}</p>

           <p className="text-xs text-purple-400 flex items-center gap-1">
  {streak >= 7 ? (
    <>
      <Zap className="w-4 h-4" /> Amazing streak!
    </>
  ) : (
    "Keep it up!"
  )}
</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <Brain className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Flashcards</p>
                      <p className="text-xl font-semibold text-white">{userStats?.totalFlashcards}</p>
                      <p className="text-xs text-green-400">+{userStats?.flashcardsToday} new today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <Trophy className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Total Notes Uploaded</p>
                      <p className="text-xl font-semibold text-white">5</p>
                      <p className="text-xs text-green-400">+2 today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-6 mb-6">
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

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Weekly Activity</CardTitle>
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
                        />
                        <Line type="monotone" dataKey="minutes" stroke="#8B5CF6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-3 gap-6">
              {/* Recent Activity */}
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

              {/* Knowledge Gaps */}
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

              {/* Group Activity */}
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