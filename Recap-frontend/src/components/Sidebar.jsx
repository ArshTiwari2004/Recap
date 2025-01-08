import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  PlusCircle,
  BookOpen,
  BrainCog,
  Users,
  Activity,
  Settings,
  LogOut,
  Calculator,
  Eye,
  BarChart
} from 'lucide-react';
import { IconCards } from '@tabler/icons-react';
import { signOut } from "firebase/auth";
import { auth } from "../config/Firebaseconfig";
import toast from 'react-hot-toast';

const handleLogout = async () => {
  try {
    await signOut(auth);
    toast.success("You have been logged out!");
    // Clear user data from localStorage if stored
    localStorage.removeItem("user");
    // redirect to "/" route 
    window.location.href = "/";
  } catch (error) {
    console.error("Error logging out:", error.message);
    toast.error("Failed to log out. Please try again.");
  }
};


const Sidebar = () => {
  const location = useLocation();

  const navigationLinks = [
    { to: '/main-dashboard', icon: BarChart, label: 'Dashboard', category: 'main' },
    { to: '/upload-note', icon: PlusCircle, label: 'Upload Notes', category: 'main' },
    { to: '/my-notes', icon: Eye, label: 'View Notes', category: 'main' },
    { to: '/flashcards', icon: IconCards, label: 'Flashcards', category: 'main' },
    { to: '/quizzes', icon: Calculator, label: 'Quizzes', category: 'main' },
    { to: '/collaboration', icon: Users, label: 'Collaboration', category: 'main' },
    { to: '/ai-insights', icon: Activity, label: 'AI Insights', category: 'main' },
    { to: '/premium', icon: BrainCog, label: 'Premium', category: 'main' },
    { to: '/settings', icon: Settings, label: 'Settings', category: 'bottom' }
  ];

  return (
    <div className="h-screen w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-6 flex flex-col relative overflow-hidden">
      {/* Logo Section */}
      <div className="mb-8">
        <Link 
            to="/"        
        className="text-2xl font-bold">
          Re<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">cap</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {navigationLinks.filter(link => link.category === 'main').map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group
                  ${location.pathname === link.to 
                    ? 'bg-purple-900/50 text-white shadow-md' 
                    : 'text-gray-300 hover:bg-purple-800/30 hover:text-white'}`}
              >
                <link.icon className={`w-5 h-5 transition-transform group-hover:scale-110 
                  ${location.pathname === link.to ? 'text-purple-400' : ''}`} />
                <span className="font-medium">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Links */}
      <div className="mt-auto border-t border-gray-400/50 pt-4 space-y-2">
        {navigationLinks.filter(link => link.category === 'bottom').map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex items-center space-x-3 p-3 rounded-xl text-gray-300 hover:bg-purple-800/30 hover:text-white transition-all duration-200"
          >
            <link.icon className="w-5 h-5" />
            <span className="font-medium">{link.label}</span>
          </Link>
        ))}
        
        <button
        onClick={handleLogout}
         className="flex w-full items-center space-x-3 p-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;