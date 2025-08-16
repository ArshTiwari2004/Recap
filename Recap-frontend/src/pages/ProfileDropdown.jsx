import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, LogOut, Settings, Sun, Moon, Lock, CircleHelp, User } from 'lucide-react';
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
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error.message);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="absolute right-4 top-16 w-72 bg-gray-800 rounded-xl shadow-xl border border-gray-700 z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-white font-semibold text-base">Account</h3>
        <p className="text-gray-400 text-sm truncate">{email}</p>
      </div>

      {/* Links */}
      <div className="p-2 space-y-1">
        {/* <Link 
          to="/main-dashboard"
          className="flex items-center gap-3 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
        >
          <BookOpen className="w-5 h-5 text-purple-400" />
          <span className="text-white text-sm">Dashboard</span>
        </Link> */}

        <Link
          to="/profile"
          className="flex items-center gap-3 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
        >
          <User className="w-5 h-5 text-purple-400" />
          <span className="text-white text-sm">Profile</span>
        </Link>

        <Link
          to="/settings"
          className="flex items-center gap-3 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
        >
          <Settings className="w-5 h-5 text-purple-400" />
          <span className="text-white text-sm">Account Settings</span>
        </Link>

        {/* <div
          onClick={handleThemeToggle}
          className="flex items-center gap-3 hover:bg-gray-700 rounded-lg px-3 py-2 cursor-pointer transition-colors"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-5 h-5 text-purple-400" />
              <span className="text-white text-sm">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-5 h-5 text-purple-400" />
              <span className="text-white text-sm">Dark Mode</span>
            </>
          )}
        </div> */}

     <Link
  to="/help"
  className="flex items-center gap-3 hover:bg-gray-700 rounded-lg px-3 py-2 cursor-pointer transition-colors"
>
  <Lock className="w-5 h-5 text-purple-400" />
  <span className="text-white text-sm">Privacy & Terms</span>
</Link>

       <Link
  to="/help"
  className="flex items-center gap-3 hover:bg-gray-700 rounded-lg px-3 py-2 cursor-pointer transition-colors"
>
  <CircleHelp className="w-5 h-5 text-purple-400" />
  <span className="text-white text-sm">FAQs</span>
</Link>
        <div
          onClick={handleLogout}
          className="flex items-center gap-3 hover:bg-gray-700 rounded-lg px-3 py-2 cursor-pointer transition-colors"
        >
          <LogOut className="w-5 h-5 text-purple-400" />
          <span className="text-white text-sm">Logout</span>
        </div>
      </div>

      {/* Upgrade Button */}
      <div className="border-t border-gray-700 p-4">
        <Link to="/premium">
          <button className="w-full py-2.5 text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all">
            Upgrade to Premium
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProfileDropdown;
