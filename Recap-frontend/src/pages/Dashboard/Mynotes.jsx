import React, { useState } from 'react';
import { Search, Grid, List, Filter, ChevronDown, BookOpen, Bell, Tag, Archive, Folder, Clock, Eye, Download, Share2, Edit2, Trash2, FileUp, Image, Mic } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const MyNotes = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [activeFilter, setActiveFilter] = useState(null);

  // Sample data - replace with your actual data
  const notes = [
    {
      id: 1,
      title: 'Introduction to React',
      subject: 'Web Development',
      format: 'pdf',
      tags: ['important', 'frontend'],
      dateUploaded: '2024-01-05',
      lastEdited: '2024-01-07',
      views: 15,
    },
    {
      id: 2,
      title: 'Database Design Basics',
      subject: 'Database Systems',
      format: 'pdf',
      tags: ['backend', 'final-exam'],
      dateUploaded: '2024-01-06',
      lastEdited: '2024-01-08',
      views: 10,
    },
    {
      id: 3,
      title: 'Lecture Recording - AI Fundamentals',
      subject: 'Artificial Intelligence',
      format: 'audio',
      tags: ['important', 'research'],
      dateUploaded: '2024-01-07',
      lastEdited: '2024-01-07',
      views: 8,
    }
  ];

  const renderNoteCard = (note) => {
    return (
      <div key={note.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-purple-500 transition-all duration-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              {note.format === 'pdf' && <FileUp className="w-5 h-5 text-white" />}
              {note.format === 'image' && <Image className="w-5 h-5 text-white" />}
              {note.format === 'audio' && <Mic className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h3 className="text-white font-medium">{note.title}</h3>
              <p className="text-gray-400 text-sm">{note.subject}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {note.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{new Date(note.dateUploaded).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>{note.views} views</span>
          </div>
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
            <BookOpen className="w-6 h-6 text-purple-400" />
            <span className="text-lg font-semibold text-white">My Notes</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors">
              Feedback
            </button>
            <button className="text-gray-300 hover:text-white transition-colors">
              Help
            </button>
            <button className="text-gray-300 hover:text-white transition-colors">
              Docs
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
          {/* Top Bar with Category Selection */}
          <div className="max-w-7xl mx-auto mb-8">
            <div className="flex items-center space-x-6 mb-6">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Folder className="w-4 h-4" />
                <span>All Notes</span>
              </button>
              <button
                onClick={() => setSelectedCategory('subjects')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === 'subjects' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>By Subject</span>
              </button>
              <button
                onClick={() => setSelectedCategory('tagged')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === 'tagged' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Tagged Notes</span>
              </button>
              <button
                onClick={() => setSelectedCategory('archived')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === 'archived' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Archive className="w-4 h-4" />
                <span>Archived Notes</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
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

                <div className="border-l border-gray-700 pl-4 flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-purple-500 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-purple-500 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notes Grid */}
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-3' : 'grid-cols-1'} gap-4`}>
              {notes.map(note => renderNoteCard(note))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyNotes;