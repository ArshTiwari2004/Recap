import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Users, Brain, Mic, Scan, Clipboard } from 'lucide-react';
import { ButtonsCard } from '../components/ui/tailwindcss-buttons';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import Footer from '../components/Footer';
import { signOut } from "firebase/auth";
import { auth } from "../config/Firebaseconfig";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import TeamSection from '@/components/Team';
import { Link } from 'react-router-dom';

const LandingPage = () => {

  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user'); // Remove user data from localStorage
      setUser(null); // Update the state
      toast.success("You have been logged out!");
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
      console.log("Error logging out:", error.message);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    // console.log(storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 ">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex text-white text-bold items-center">
            <Link to = "/">
             <span className=" text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-bold text-2xl">Recap</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-10">
              <a className="text-gray-300 hover:text-white transition-colors text-sm font-medium" href="#features">Features</a>
              <a className="text-gray-300 hover:text-white transition-colors text-sm font-medium" href="#team">Team</a>
             
              {user ? (
                <button
                onClick={handleLogout}
                className="border-2 border-purple-500 text-purple-400 bg-gradient-to-br from-purple-900 to-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-500 hover:text-white transition-all"
              >
                Logout
              </button>
              ) : (
                <>
                  <button
                    onClick={() => setLoginOpen(true)}
                    className="border-2 border-purple-500 text-purple-400 hover:bg-purple-500 text-white mr-4 px-6 py-2 rounded-lg"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => setSignupOpen(true)}
                    className="border-2 border-purple-500 text-purple-400 bg-gradient-to-br from-purple-900 to-purple-700 text-white mr-4 px-6 py-2 rounded-lg"
                  >
                    Signup
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
      <SignupModal isOpen={isSignupOpen} onClose={() => setSignupOpen(false)} />

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-20 -left-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-8">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white">
                Transform Your Study Notes
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Into Knowledge
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                AI-powered note organization that adapts to your learning style.
                Capture, connect, and master your study materials effortlessly.
              </p>
              <div className="flex justify-center">
              {user ? (<ButtonsCard 
                 onClick={() => navigate('/main-dashboard')}
                className="group bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg rounded-xl flex items-center gap-3 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40">
                  <span className="flex items-center gap-2">
                    Go to Dashboard 
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </ButtonsCard>):(
                  <ButtonsCard 
                  onClick={() => setSignupOpen(true)}
                 className="group bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg rounded-xl flex items-center gap-3 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40">
                   <span className="flex items-center gap-2">
                     Get Started Free
                     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </span>
                 </ButtonsCard>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24" id = "features">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="bg-purple-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex justify-center my-12">
        <button
          onClick={() => setSignupOpen(true)}
          className="bg-purple-500/50 text-white font-semibold text-lg py-3 px-8 rounded-full transition-transform transform hover:scale-105 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          Start Your Smart Study Journey Now!
        </button>
      </div>

      {/* Team Section */}
      <TeamSection />



      {/* Footer */}
      <Footer />
    </div>
  );
};

const features = [
  {
    icon: <BookOpen className="w-8 h-8 text-purple-400" />,
    title: "Smart Organization",
    description: "Automatically categorize and link your notes across subjects for seamless learning."
  },
  {
    icon: <Brain className="w-8 h-8 text-purple-400" />,
    title: "AI-Enhanced Learning",
    description: "Get personalized insights and suggestions to improve your study materials."
  },
  {
    icon: <Users className="w-8 h-8 text-purple-400" />,
    title: "Collaborative Study",
    description: "Share and collaborate on notes with classmates in real-time."
  },
  {
    icon: <Mic className="w-8 h-8 text-purple-400" />,
    title: "Voice-to-Text",
    description: "Convert voice recordings into text notes for easy review and study."
  },
  {
    icon: <Scan className="w-8 h-8 text-purple-400" />,
    title: "Handwriting to Digital Notes",
    description: "Scan handwritten notes and convert them into editable, searchable text."
  },
  {
    icon: <Clipboard className="w-8 h-8 text-purple-400" />,
    title: "Customizable Quizzes",
    description: "Create custom quizzes, adjust difficulty, and track progress to enhance learning."
  }
];

export default LandingPage;


