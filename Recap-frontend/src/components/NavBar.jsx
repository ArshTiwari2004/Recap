import React, { useState, useEffect, useRef } from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Notification from '@/components/Notifications';
import ProfileDropdown from '@/pages/ProfileDropdown';
import FeedbackButton from './FeedbackButton';

const NavBar = ({ icon, header, button1, button2, button3, userProfile, panelToggleButton }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for dropdown

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const handleProfileDropdownToggle = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  const handleHelpClick = () => {
    navigate('/help');
  };

  const HandleDocsCick = () => {
    navigate('/docs');
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  return (
    <div className="h-16 bg-gray-800 border-b border-gray-700 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {panelToggleButton}
        {icon || <BookOpen className="w-6 h-6 text-purple-400" />}
        <span className="text-lg font-semibold text-white">{header || "PYQ Practice"}</span>
      </div>

      <div className="flex items-center space-x-6">
        <FeedbackButton />
      
        <button 
          className="text-gray-300 hover:text-white transition-colors"
          onClick={handleHelpClick}
        >
          {button2}
        </button>

        <button 
          className="text-gray-300 hover:text-white transition-colors"
          onClick={HandleDocsCick}  
        >
          {button3}
        </button>

        {<Notification />}

        <div className="relative" ref={dropdownRef}>
          {userProfile || (
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
              onClick={handleProfileDropdownToggle}
            >
              {user?.photoURL ? (
                <div className="w-full h-full rounded-full border-2 border-purple-500 p-1">
                  <img
                    src={user.photoURL}
                    alt="User Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
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
