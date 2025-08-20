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
import DemoModal from '../components/DemoModal';

const LandingPage = () => {

  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDemoOpen, setDemoOpen] = useState(false);

  
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
      <div className="backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-3xl tracking-tight drop-shadow-sm">
                  Recap
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="https://github.com/ArshTiwari2004/Recap"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white"
              >
                <Github className="h-5 w-5" />
              </a>

             <button
  onClick={() => setDemoOpen(true)}
  className="text-sm text-gray-400 hover:text-white flex items-center gap-1.5"
>
  <ExternalLink className="h-4 w-4" />
  Get a Demo now!
</button>


              {/* <button
                onClick={() => {}}
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Install App
              </button> */}

              <a className="text-sm text-gray-400 hover:text-white" href="#features">Features</a>
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
                  className="border-2 border-purple-500 text-white bg-gradient-to-br from-purple-900 to-purple-700 px-6 py-2 rounded-lg hover:bg-purple-600 transition-all"
                >
                  Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setLoginOpen(true)}
                    className="border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-all px-6 py-2 rounded-lg"
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

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/20 backdrop-blur-sm rounded-lg mt-2">
                <a
                  href="https://github.com/ArshTiwari2004/Recap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white block px-3 py-2 text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    GitHub
                  </div>
                </a>

                <button
                 onClick={() => setDemoOpen(true)}
                  className="text-gray-400 hover:text-white block px-3 py-2 text-base font-medium w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Get a Demo now!
                  </div>
                </button>

                <button
                  onClick={() => {
                    /* Add install logic */
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-400 hover:text-white block px-3 py-2 text-base font-medium w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Install App
                  </div>
                </button>

                <a
                  className="text-gray-400 hover:text-white block px-3 py-2 text-base font-medium"
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>

                <a
                  className="text-gray-400 hover:text-white block px-3 py-2 text-base font-medium"
                  href="#team"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Team
                </a>

                <button
                  onClick={() => {
                    scrollToTestimonials();
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-400 hover:text-white block px-3 py-2 text-base font-medium w-full text-left"
                >
                  Testimonials
                </button>

                {/* Mobile Auth Buttons */}
                <div className="pt-4 pb-3 border-t border-gray-700">
                  {user ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full border-2 border-purple-500 text-white bg-gradient-to-br from-purple-900 to-purple-700 px-6 py-3 rounded-lg hover:bg-purple-600 transition-all text-center"
                    >
                      Logout
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setLoginOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-all px-6 py-3 rounded-lg text-center"
                      >
                        Log In
                      </button>
                      <button
                        onClick={() => {
                          setSignupOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full border-2 border-purple-500 text-white bg-gradient-to-br from-purple-900 to-purple-700 px-6 py-3 rounded-lg hover:bg-purple-600 transition-all text-center"
                      >
                        Signup
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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
                Transform the Way You
                <span className="  block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Learn & Succeed.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                ~ AI that knows your weak spots before you do.
              </p>
              <div className="flex justify-center">
                {user ? (
                  <ButtonsCard
                    onClick={() => navigate('/main-dashboard')}
                    className="group bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg rounded-xl flex items-center gap-3 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                  >
                    <span className="flex items-center gap-2">
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </ButtonsCard>
                ) : (
                  <ButtonsCard
                    onClick={() => setSignupOpen(true)}
                    className="group bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg rounded-xl flex items-center gap-3 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 cursor-pointer"
                  >
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

      <DemoModal isOpen={isDemoOpen} onClose={() => setDemoOpen(false)} />


      {/* Numbers section */}
      <Numbersection />
      {/* Updated Features Section */}
      <Features />

      {/* Feedback Display remains the same */}
      <FeedbackDisplay />

      {/* New FAQ Section */}
      <FAQ />

      {/* Team Section remains the same */}
      <TeamSection />

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


