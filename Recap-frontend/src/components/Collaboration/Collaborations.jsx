import React, { useState } from 'react';
import { Search, Users, Plus, UserPlus, Settings, MessageSquare, BookOpen, Bell, Grid, Filter, ChevronDown, Clock, Star, Lock, Globe, BarChart2 } from 'lucide-react';
import Sidebar from '../Sidebar';


const CollaborativeNotes = () => {
  const [activeTab, setActiveTab] = useState('myGroups');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortBy, setSortBy] = useState('recent');

  // Sample groups data
  const groups = [
    {
      id: 1,
      name: "Advanced Physics Study Group",
      description: "Group for discussing quantum mechanics and relativity",
      members: 15,
      isPrivate: true,
      subject: "Physics",
      tags: ["quantum mechanics", "finals prep"],
      recentActivity: "2024-01-15",
      unreadMessages: 3
    },
    {
      id: 2,
      name: "Web Development Workshop",
      description: "Collaborative learning of React, Node.js, and modern web technologies",
      members: 28,
      isPrivate: false,
      subject: "Computer Science",
      tags: ["react", "nodejs", "web dev"],
      recentActivity: "2024-01-14",
      unreadMessages: 0
    },
    // Add more sample groups as needed
  ];

  const renderGroupCard = (group) => {
    return (
      <div key={group.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-medium text-lg">{group.name}</h3>
              {group.isPrivate ? 
                <Lock className="w-4 h-4 text-gray-400" /> : 
                <Globe className="w-4 h-4 text-gray-400" />
              }
            </div>
            <p className="text-gray-400 text-sm mt-1">{group.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">{group.members}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {group.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
              {tag}
            </span>
          ))}
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
            {group.subject}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">Chat</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Notes</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors">
              <BarChart2 className="w-4 h-4" />
              <span className="text-sm">Analytics</span>
            </button>
          </div>
          
          {group.unreadMessages > 0 && (
            <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
              {group.unreadMessages} new
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="h-16 bg-gray-800 border-b border-gray-700 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-purple-400" />
            <span className="text-lg font-semibold text-white">Collaborative Notes</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors">
              Group Settings
            </button>
            <button className="text-gray-300 hover:text-white transition-colors">
              Invites
            </button>
            <button className="relative text-gray-300 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Tabs */}
            <div className="flex items-center space-x-6 mb-8">
              <button
                onClick={() => setActiveTab('myGroups')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'myGroups' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>My Groups</span>
              </button>
              <button
                onClick={() => setActiveTab('joinGroup')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'joinGroup' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Join a Group</span>
              </button>
              <button
                onClick={() => setActiveTab('createGroup')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'createGroup' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Create Group</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center justify-between mb-8">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search groups..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button 
                    onClick={() => setActiveFilter(activeFilter === 'filter' ? null : 'filter')}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white flex items-center space-x-2 hover:border-purple-500 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setActiveFilter(activeFilter === 'sort' ? null : 'sort')}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white flex items-center space-x-2 hover:border-purple-500 transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Sort by</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-2 gap-6">
              {groups.map(group => renderGroupCard(group))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeNotes;