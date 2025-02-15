import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Edit, LogOut, Settings, Sun, Moon, Lock, CircleHelp , User  } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '@/config/Firebaseconfig';
import toast from 'react-hot-toast';
import { signOut } from 'firebase/auth';

const ProfileDropdown = ({ email }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleThemeToggle = () => {
    setIsDarkMode((prevState) => !prevState);
  };

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

  return (
    <div className="absolute right-4 top-16 w-64 bg-gray-800 rounded-lg shadow-lg z-50">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-white font-medium">Account</h3>
        <p className="text-gray-400">{email}</p>
      </div>

      <div className="space-y-1 p-2">
        <Link 
        to = "/main-dashboard"
        className="flex items-center space-x-3 hover:bg-gray-700 rounded-lg p-2 cursor-pointer">
          <BookOpen className="w-5 h-5 text-purple-400" />
          <span className="text-white">Dashboard</span>
        </Link>
        <Link
        to = "/profile"
        className="flex items-center space-x-3 hover:bg-gray-700 rounded-lg p-2 cursor-pointer">
          <User className="w-5 h-5 text-purple-400" />
          <span className="text-white">Profile</span>
        </Link>
       




        <Link
        to ="/settings"
        className="flex items-center space-x-3 hover:bg-gray-700 rounded-lg p-2 cursor-pointer">
          <Settings className="w-5 h-5 text-purple-400" />
          <span className="text-white">Account Settings</span>
        </Link>

        <div className="flex items-center space-x-3 hover:bg-gray-700 rounded-lg p-2 cursor-pointer" onClick={handleThemeToggle}>
          {isDarkMode ? (
            <>
              <Sun className="w-5 h-5 text-purple-400" />
              <span className="text-white">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-5 h-5 text-purple-400" />
              <span className="text-white">Dark Mode</span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-3 hover:bg-gray-700 rounded-lg p-2 cursor-pointer">
          <Lock className="w-5 h-5 text-purple-400" />
          <span className="text-white">Privacy & Terms</span>
        </div>

        <div className="flex items-center space-x-3 hover:bg-gray-700 rounded-lg p-2 cursor-pointer">
          <CircleHelp className="w-5 h-5 text-purple-400" />
          <span className="text-white">FAQs</span>
        </div>

        <div className="flex items-center space-x-3 hover:bg-gray-700 rounded-lg p-2 cursor-pointer" onClick={handleLogout}>
          <LogOut className="w-5 h-5 text-purple-400" />
          <span className="text-white">Logout</span>
        </div>
      </div>

      <Link
      to = "/premium"
      className=" py-4  border-t border-gray-700">
        <button className="w-full px-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-colors">
          Upgrade to Premium
        </button>
      </Link>
    </div>
  );
};

export default ProfileDropdown;