import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Notification from '@/components/Notifications';
import toast from 'react-hot-toast';
import ProfileDropdown from '@/pages/ProfileDropdown';
import FeedbackButton from './FeedbackButton';

const NavBar = ({ icon, header, button1, button2, button3, userProfile, panelToggleButton }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const handleProfileDropdownToggle = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

//   const handleFeedbackClick = () => {
//     toast.success('Feedback button clicked!');
//   };

//   const handleDocsClick = () => {
//     toast.success('Docs button clicked!');
//   };

  return (
    <div className="h-16 bg-gray-800 border-b border-gray-700 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-2">
      {panelToggleButton}
        {icon || <BookOpen className="w-6 h-6 text-purple-400" />}
        <span className="text-lg font-semibold text-white">{header || "Add Header here"}</span>
      </div>

      <div className="flex items-center space-x-6">
        {/* <button 
          className="text-gray-300 hover:text-white transition-colors"
        //   onClick={handleFeedbackClick}
        >
          {button1}
        </button> */}
        <FeedbackButton />
      
        <button 
          className="text-gray-300 hover:text-white transition-colors"
        //   onClick={handleDocsClick}
        >
          {button2}
        </button>

        <button 
          className="text-gray-300 hover:text-white transition-colors"
        //   onClick={handleDocsClick}
        >
          {button3}
        </button>

        {<Notification />}

        <div className="relative">
          {userProfile || (
            <button
              className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center cursor-pointer"
              onClick={handleProfileDropdownToggle}
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-sm font-medium">
                  {user?.displayName?.charAt(0).toUpperCase()}
                </span>
              )}
            </button>
          )}
          {isProfileDropdownOpen && (
            <ProfileDropdown email={user?.email} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;