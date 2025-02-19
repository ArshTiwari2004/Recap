import React, { useEffect, useState } from 'react';
import { 
  Search, Users, Plus, UserPlus, Settings, MessageSquare, 
  BookOpen, Bell, Grid, Filter, ChevronDown, Clock, Star, 
  Lock, Globe, BarChart2, Share2, X, Upload 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import { useFirebase } from '@/context/FirebaseContext';
import CreateGroupModal from '../CreateGroupModal';
import JoinGroupModal from '../JoinGroupModal';
import GroupChat from '../GroupChat';
import GroupNotes from '../GroupNotes';
import Notification from '../Notifications';

const CollaborativeNotes = () => {
  const navigate = useNavigate();
  const { 
    userGroups, 
    loading: groupsLoading,
    joinGroup, // Added this back
    leaveGroup, 
    deleteGroup,
    uploadFile 
  } = useFirebase();
  
  const [activeTab, setActiveTab] = useState('myGroups');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeView, setActiveView] = useState('chat');
  const [user, setUser] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'createGroup') {
      setShowCreateModal(true);
    } else if (tab === 'joinGroup') {
      setShowJoinModal(true);
    }
    setSelectedGroup(null);
  };

  // Added back the joinGroup handler
  const handleJoinGroup = async (groupId) => {
    try {
      await joinGroup(groupId);
      toast.success('Successfully joined the group');
    } catch (error) {
      toast.error('Failed to join group');
      console.error('Error joining group:', error);
    }
  };

  const handleShareGroup = (group) => {
    navigator.clipboard.writeText(group.inviteCode);
    toast.success('Invite code copied to clipboard! Share this code with others to let them join.');
  };

  const handleLeaveGroup = async (groupId) => {
    if (window.confirm('Are you sure you want to leave this group?')) {
      const result = await leaveGroup(groupId);
      if (result.success) {
        toast.success('Successfully left the group');
        setSelectedGroup(null);
      } else {
        toast.error('Failed to leave group');
      }
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      const result = await deleteGroup(groupId);
      if (result.success) {
        toast.success('Group deleted successfully');
        setSelectedGroup(null);
      } else {
        toast.error('Failed to delete group');
      }
    }
  };

  const handleFileUpload = async (groupId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileSize = file.size / 1024 / 1024;
    if (fileSize > 10) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF and image files are allowed');
      return;
    }

    setUploadingFile(true);
    try {
      const result = await uploadFile(groupId, file);
      if (result.success) {
        toast.success('File uploaded successfully');
      } else {
        toast.error('Failed to upload file');
      }
    } catch (error) {
      toast.error('Error uploading file');
    } finally {
      setUploadingFile(false);
    }
  };

  const filteredGroups = userGroups?.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Sort groups based on selected criteria
  const sortedGroups = [...filteredGroups].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      case 'members':
        return (b.members?.length || 0) - (a.members?.length || 0);
      default:
        return 0;
    }
  });

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
          <label className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span className="text-sm">Upload</span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,image/*"
              onChange={(e) => handleFileUpload(group.id, e)}
              disabled={uploadingFile}
            />
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleShareGroup(group)}
            className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
            title="Share group invite code"
          >
            <Share2 className="w-4 h-4" />
          </button>
          
          {group.createdBy === user?.uid ? (
            <button
              onClick={() => handleDeleteGroup(group.id)}
              className="p-2 text-red-400 hover:text-red-500 transition-colors"
            >
              Delete
            </button>
          ) : (
            <button
              onClick={() => handleLeaveGroup(group.id)}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              Leave
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => {
    if (groupsLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading groups...</div>
        </div>
      );
    }

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

    if (sortedGroups.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No groups found</p>
          <button
            onClick={() => handleTabClick('createGroup')}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Create your first group
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedGroups.map(renderGroupCard)}
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
             
              <Notification />
              <div
                className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {user?.displayName?.[0] || 'U'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1\\ p-8 overflow-auto">
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

                    <button className="text-gray-300 hover:text-white transition-colors">
                Group Settings
              </button>
              <button className="text-gray-300 hover:text-white transition-colors">
                Invites
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
                        
                        {activeFilter === 'filter' && (
                          <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                            <div className="p-2">
                              <button
                                onClick={() => {
                                  // Add filter logic here
                                  setActiveFilter(null);
                                }}
                                className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                              >
                                Private Groups
                              </button>
                              <button
                                onClick={() => {
                                  // Add filter logic here
                                  setActiveFilter(null);
                                }}
                                className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                              >
                                Public Groups
                              </button>
                            </div>
                          </div>
                        )}
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
                        
                        {activeFilter === 'sort' && (
                          <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                            <div className="p-2">
                              <button
                                onClick={() => {
                                  setSortBy('recent');
                                  setActiveFilter(null);
                                }}
                                className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                              >
                                Most Recent
                              </button>
                              <button
                                onClick={() => {
                                  setSortBy('alphabetical');
                                  setActiveFilter(null);
                                }}
                                className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                              >
                                Alphabetical
                              </button>
                              <button
                                onClick={() => {
                                  setSortBy('members');
                                  setActiveFilter(null);
                                }}
                                className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                              >
                                Member Count
                              </button>
                            </div>
                          </div>
                        )}
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
      
      <JoinGroupModal
        isOpen={showJoinModal}
        onClose={() => {
          setShowJoinModal(false);
          setActiveTab('myGroups');
        }}
      />

      {uploadingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
              <span className="text-white">Uploading file...</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CollaborativeNotes;