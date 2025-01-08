import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Settings() {
  const [expandedSection, setExpandedSection] = useState('notifications');
  const [notifications, setNotifications] = useState({
    newsletter: true,
    reminders: true,
    organizerEmails: true
  });
  const [visibility, setVisibility] = useState('public');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
    <h1 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 ">Settings</h1>
      
      {/* Notifications Section */}
      <div className="mb-4">
        <button 
          onClick={() => toggleSection('notifications')}
          className="w-full flex justify-between items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700"
        >
          <span className="text-lg">Notifications</span>
          {expandedSection === 'notifications' ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {expandedSection === 'notifications' && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg space-y-6">
            <div>
              <h3 className="text-lg mb-2">Newsletter Preference</h3>
              <p className="text-gray-400 mb-3">Our newsletter will gain you access to the latest updates regarding hiring challenges.</p>
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifications.newsletter}
                    onChange={() => handleToggle('newsletter')}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg">Notification Preferences</h3>
              <div className="flex items-center justify-between">
                <span>Automated reminders</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifications.reminders}
                    onChange={() => handleToggle('reminders')}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span>Organizer emails</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifications.organizerEmails}
                    onChange={() => handleToggle('organizerEmails')}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className="mb-4">
        <button 
          onClick={() => toggleSection('password')}
          className="w-full flex justify-between items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700"
        >
          <span className="text-lg">Password</span>
          {expandedSection === 'password' ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {expandedSection === 'password' && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg mb-4">Change Password</h3>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
              <div className="flex gap-4">
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                Submit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="mb-4">
        <button 
          onClick={() => toggleSection('profile')}
          className="w-full flex justify-between items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700"
        >
          <span className="text-lg">Profile</span>
          {expandedSection === 'profile' ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {expandedSection === 'profile' && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <div className="space-y-4">
              <h3 className="text-lg">Profile Visibility</h3>
              <p className="text-gray-400">You can choose to make your profile public or private.</p>
              <select 
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}