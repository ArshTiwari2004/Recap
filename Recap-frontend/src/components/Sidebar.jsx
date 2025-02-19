import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  PlusCircle,
  BarChart,
  Eye,
  Calculator,
  Users,
  Activity,
  BrainCog,
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { IconCards } from '@tabler/icons-react';
import { signOut } from "firebase/auth";
import { auth } from "../config/Firebaseconfig";
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip'; // Assuming you're using a tooltip library

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationLinks = [
    { to: '/main-dashboard', icon: BarChart, label: 'Dashboard', category: 'main' },
    { to: '/upload-note', icon: PlusCircle, label: 'Upload Notes', category: 'main' },
    { to: '/my-notes', icon: Eye, label: 'View Notes', category: 'main' },
    { to: '/flashcards', icon: IconCards, label: 'Flashcards', category: 'main' },
    { to: '/quizzes', icon: Calculator, label: 'Quizzes', category: 'main' },
    { to: '/collaboration', icon: Users, label: 'Collaboration', category: 'main' },
    { to: '/ai-insights', icon: Activity, label: 'AI Insights', category: 'main' },
    { to: '/premium', icon: BrainCog, label: 'Premium', category: 'main' },
   { to: '/settings', icon: Settings, label: 'Settings', category: 'bottom' },
   { to: '/profile', icon: User, label: 'Profile', category: 'bottom' },
  ];

  // Example user data; replace with actual user data as needed
  const user = {
    name: "John Doe",
    avatar: "https://via.placeholder.com/150"
  };

  return (
    <div
      className={`h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-4 flex flex-col transition-width duration-300 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="text-gray-300 hover:text-white focus:outline-none mb-4"
        aria-label="Toggle Sidebar"
      >
        {/* Simple hamburger icon; replace with a proper icon if desired */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isCollapsed ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Logo Section */}
      <div className="flex items-center mb-8">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">
            Re<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">cap</span>
          </span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {navigationLinks.filter(link => link.category === 'main').map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center space-x-3 p-2 rounded-md transition-all duration-200 group
                    ${isActive 
                      ? 'bg-purple-900 text-white shadow-md' 
                      : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-current'} transition-transform group-hover:scale-110`} />
                  {!isCollapsed && <span className="font-medium">{link.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Links */}
      <div className="mt-auto border-t border-gray-600 pt-4 space-y-2">
        <ul className="space-y-2">
          {navigationLinks.filter(link => link.category === 'bottom').map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center space-x-3 p-2 rounded-md text-gray-300 hover:bg-purple-800 hover:text-white transition-all duration-200`}
                >
                  <Icon className="w-5 h-5" />
                  {!isCollapsed && <span className="font-medium">{link.label}</span>}
                </Link>
              </li>
            );
          })}
          {!isCollapsed && (
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 p-2 w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-md transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}


export default Sidebar;
   