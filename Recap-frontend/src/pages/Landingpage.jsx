import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Users, Brain, Mic, Scan, Clipboard, ExternalLink, Github } from 'lucide-react';
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
import Features from './Features';
import FAQ from './FAQ';
import FeedbackDisplay from '@/components/FeedbackDisplay';
import Numbersection from '@/components/Numbersection';

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
  
  const scrollToTestimonials = () => {
    const testimonialSection = document.getElementById('testimonials');
    if (testimonialSection) {
      testimonialSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openDemoVideo = () => {
    // Replace this URL with your actual demo video URL
    window.open('https://yourdemovideo.com', '_blank');
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
<div className="backdrop-blur-sm ">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center h-20">
      <div className="flex items-center space-x-10">
        <Link to="/" className="flex items-center">
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-3xl tracking-tight drop-shadow-sm">
            Recap
          </span>
        </Link>
        
        <div className="flex items-center space-x-8">
          <a 
            href="https://github.com/ArshTiwari2004/Recap" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white"
          >
            <Github className="h-5 w-5" />
          </a>
          
          <button 
            onClick={openDemoVideo}
            className="text-sm text-gray-400 hover:text-white  flex items-center gap-1.5 "
          >
            <ExternalLink className="h-4 w-4" />
            Get a Demo now!
          </button>
        </div>
      </div>
      
      <div className="hidden md:flex items-center space-x-8 ml-auto">
        <button 
          onClick={() => {/* Add install logic */}}
          className="text-sm text-gray-400 hover:text-white  flex items-center gap-1.5 "
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Install App
        </button>
        
        <a className="text-sm text-gray-400 hover:text-white " href="#features">Features</a>
        <a className="text-sm text-gray-400 hover:text-white" href="#team">Team</a>
        <button 
          onClick={scrollToTestimonials} 
          className="text-sm text-gray-400 hover:text-white"
        >
          Testimonials
        </button>
        
        {user ? (
          <button
            onClick={handleLogout}
            className="ml-6 border-2 border-purple-500 text-white bg-gradient-to-br from-purple-900 to-purple-700 px-6 py-2 rounded-lg hover:bg-purple-600 transition-all"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => setLoginOpen(true)}
              className="ml-6 border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-all px-6 py-2 rounded-lg"
            >
              Log In
            </button>
            <button
              onClick={() => setSignupOpen(true)}
              className="ml-4 border-2 border-purple-500 text-white bg-gradient-to-br from-purple-900 to-purple-700 px-6 py-2 rounded-lg hover:bg-purple-600 transition-all"
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

      {/* Numbers section */}
      <Numbersection/>
      {/* Updated Features Section */}
      <Features />
      
      {/* Feedback Display remains the same */}
      <FeedbackDisplay />

      {/* New FAQ Section */}
      <FAQ />

      {/* Team Section remains the same */}
      <TeamSection />

      \

      {/* Footer remains the same */}
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


