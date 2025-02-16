import React, { useState } from 'react';
import { 
  Bell, 
  Shield, 
  Lock,
  User,
  Globe,
  Moon,
  Volume2,
  Clock,
  Palette,
  BookOpen,
  Cloud,
  Key,
  Gift,
  Settings as SettingsIcon,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Notification from '@/components/Notifications';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState({
    studyReminders: true,
    noteUpdates: true,
    groupInvites: true,
    dailyDigest: false
  });
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'english',
    autoSave: true,
    compactView: false
  });

  const handleToggle = (category, key) => {
    if (category === 'notifications') {
      setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    } else if (category === 'preferences') {
      setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const SettingCard = ({ icon: Icon, title, description, children }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gray-700/50 rounded-lg">
          <Icon className="w-6 h-6 text-purple-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <p className="text-gray-400 text-sm mb-4">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );

  const ToggleSwitch = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-300 text-sm">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          checked={enabled}
          onChange={onChange}
          className="sr-only peer" 
        />
        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-hover:bg-gray-600"></div>
      </label>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="h-16 bg-gray-800 border-b border-gray-700 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SettingsIcon className="w-6 h-6 text-purple-400" />
            <span className="text-lg font-semibold text-white">Settings</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors">
              Help Center
            </button>
            {/* <button className="relative text-gray-300 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
            </button> */}
            <Notification />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Settings Navigation */}
            <div className="mb-8 flex space-x-1 bg-gray-800/30 p-1 rounded-lg backdrop-blur-sm">
              {[
                { id: 'general', icon: BookOpen, label: 'General' },
                { id: 'notifications', icon: Bell, label: 'Notifications' },
                { id: 'privacy', icon: Shield, label: 'Privacy' },
                { id: 'appearance', icon: Palette, label: 'Appearance' },
                { id: 'security', icon: Lock, label: 'Security' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Settings Content */}
            <div className="space-y-6">
              {/* Study Preferences */}
              <SettingCard
                icon={BookOpen}
                title="Study Preferences"
                description="Customize your study environment and note-taking experience"
              >
                <div className="space-y-3">
                  <ToggleSwitch
                    enabled={preferences.autoSave}
                    onChange={() => handleToggle('preferences', 'autoSave')}
                    label="Auto-save notes while typing"
                  />
                  <ToggleSwitch
                    enabled={preferences.compactView}
                    onChange={() => handleToggle('preferences', 'compactView')}
                    label="Compact view mode"
                  />
                </div>
              </SettingCard>

              {/* Notification Settings */}
              <SettingCard
                icon={Bell}
                title="Notification Preferences"
                description="Control how and when you want to receive updates"
              >
                <div className="space-y-3">
                  <ToggleSwitch
                    enabled={notifications.studyReminders}
                    onChange={() => handleToggle('notifications', 'studyReminders')}
                    label="Study session reminders"
                  />
                  <ToggleSwitch
                    enabled={notifications.noteUpdates}
                    onChange={() => handleToggle('notifications', 'noteUpdates')}
                    label="Note collaboration updates"
                  />
                  <ToggleSwitch
                    enabled={notifications.groupInvites}
                    onChange={() => handleToggle('notifications', 'groupInvites')}
                    label="Study group invitations"
                  />
                  <ToggleSwitch
                    enabled={notifications.dailyDigest}
                    onChange={() => handleToggle('notifications', 'dailyDigest')}
                    label="Daily study progress digest"
                  />
                </div>
              </SettingCard>

              {/* Privacy Settings */}
              <SettingCard
                icon={Shield}
                title="Privacy & Sharing"
                description="Control your note visibility and sharing preferences"
              >
                <div className="space-y-4">
                  <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="private">Private - Only me</option>
                    <option value="friends">Friends only</option>
                    <option value="public">Public</option>
                  </select>
                </div>
              </SettingCard>

              {/* Security Settings */}
              <SettingCard
                icon={Key}
                title="Security"
                description="Manage your account security and authentication"
              >
                <button className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors">
                  Change Password
                </button>
              </SettingCard>

              {/* Premium Features */}
              <SettingCard
                icon={Gift}
                title="Premium Features"
                description="Unlock advanced study tools and features"
              >
                <div className="p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-purple-400 font-medium">Premium Study Tools</h4>
                      <p className="text-sm text-gray-400">Access AI-powered study assistance and more</p>
                    </div>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Upgrade
                    </button>
                  </div>
                </div>
              </SettingCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;