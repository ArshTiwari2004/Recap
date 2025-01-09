import React, { useState } from 'react';
import { Search, Users, Plus, UserPlus, Settings, MessageSquare, BookOpen, Bell, Grid, Filter, ChevronDown, Clock, Star, Lock, Globe, BarChart2 } from 'lucide-react';
import Sidebar from '../Sidebar';
import { useFirebase } from '@/context /FirebaseContext';
import CreateGroupModal from '../CreateGroupModal';
import GroupChat from '../GroupChat';
import  GroupNotes from '../GroupNotes';

const CollaborativeNotes = () => {
  const { userGroups, joinGroup } = useFirebase();
  const [activeTab, setActiveTab] = useState('myGroups');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeView, setActiveView] = useState('chat');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'createGroup') {
      setShowCreateModal(true);
    }
    setSelectedGroup(null);
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await joinGroup(groupId);
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const filteredGroups = userGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderGroupCard = (group) => (
    <div 
      key={group.id} 
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300"
    >
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
          <span className="text-gray-400">{group.members?.length || 0}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {group.tags?.map(tag => (
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
          <button 
            onClick={() => {
              setSelectedGroup(group);
              setActiveView('chat');
            }}
            className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">Chat</span>
          </button>
          <button 
            onClick={() => {
              setSelectedGroup(group);
              setActiveView('notes');
            }}
            className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Notes</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors">
            <BarChart2 className="w-4 h-4" />
            <span className="text-sm">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => {
    if (selectedGroup) {
      return (
        <div className="h-full p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">{selectedGroup.name}</h2>
            <button 
              onClick={() => setSelectedGroup(null)}
              className="text-gray-400 hover:text-white"
            >
              Back to Groups
            </button>
          </div>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveView('chat')}
              className={`px-4 py-2 rounded-lg ${
                activeView === 'chat' 
                  ? 'bg-purple-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveView('notes')}
              className={`px-4 py-2 rounded-lg ${
                activeView === 'notes' 
                  ? 'bg-purple-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Notes
            </button>
          </div>
          {activeView === 'chat' ? (
            <GroupChat groupId={selectedGroup.id} />
          ) : (
            <GroupNotes groupId={selectedGroup.id} />
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-6">
        {filteredGroups.map(renderGroupCard)}
      </div>
    );
  };

  return (
    <>
      <div className="flex h-screen bg-gray-900">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
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

          <div className="flex-1 p-8 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {!selectedGroup && (
                <>
                  <div className="flex items-center space-x-6 mb-8">
                    <button
                      onClick={() => handleTabClick('myGroups')}
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
                      onClick={() => handleTabClick('joinGroup')}
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
                      onClick={() => handleTabClick('createGroup')}
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
                </>
              )}

              {renderMainContent()}
            </div>
          </div>
        </div>
      </div>

      <CreateGroupModal 
        isOpen={showCreateModal} 
        onClose={() => {
          setShowCreateModal(false);
          setActiveTab('myGroups');
        }} 
      />
    </>
  );
};

export default CollaborativeNotes;