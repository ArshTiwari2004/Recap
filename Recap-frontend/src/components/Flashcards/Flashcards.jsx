import React, { useState } from 'react';
import { Search, Grid, List, Filter, ChevronDown, BookOpen, Bell, Tag, Star, Clock, Eye, Edit2, Trash2, Heart, RotateCw, Check, X } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const Flashcards = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [activeFilter, setActiveFilter] = useState(null);
  const [currentFlashcard, setCurrentFlashcard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // Sample flashcard data
  const flashcards = [
    {
      id: 1,
      title: "React Hooks Overview",
      question: "What are the main React hooks and their purposes?",
      answer: "useState: State management\nuseEffect: Side effects\nuseContext: Context consumption\nuseRef: Mutable references",
      subject: "Web Development",
      tags: ["react", "important"],
      mastered: false,
      favorite: true,
      lastReviewed: "2024-01-07",
      timesReviewed: 15,
      difficulty: "medium"
    },
    {
      id: 2,
      title: "Database Indexing",
      question: "What are the benefits and drawbacks of database indexing?",
      answer: "Benefits:\n- Faster data retrieval\n- Improved query performance\n\nDrawbacks:\n- Additional storage space\n- Slower write operations",
      subject: "Database Systems",
      tags: ["sql", "performance"],
      mastered: true,
      favorite: false,
      lastReviewed: "2024-01-08",
      timesReviewed: 8,
      difficulty: "hard"
    },
    {
        id: 3,
        title: "Python Data Structures",
        question: "What are the main data structures in Python?",
        answer: "Lists, Tuples, Sets, Dictionaries",
        subject: "Python Programming",
        tags: ["python", "data structures"],
        mastered: false,
        favorite: true,
        lastReviewed: "2024-01-08",
        timesReviewed: 12,
        difficulty: "medium"
        },
        {
        id: 4,
        title: "Linear Regression",
        question: "What is linear regression and how is it used in machine learning?",
        answer: "Linear regression is a statistical method used to model the relationship between two variables. In machine learning, it is used to predict the value of a dependent variable based on the value of one or more independent variables.",
        subject: "Machine Learning",
        tags: ["machine learning", "algorithms"],
        mastered: true,
        favorite: false,
        lastReviewed: "2024-01-09",
        timesReviewed: 5,
        difficulty: "easy"
        },
        {
        id: 5,
        title: "HTML5 Tags",
        question: "What are some new tags introduced in HTML5?",
        answer: "header, footer, nav, article, section, aside",
        subject: "Web Development",
        tags: ["html", "html5"],
        mastered: false,
        favorite: false,
        lastReviewed: "2024-01-10",
        timesReviewed: 10,
        difficulty: "medium"
        },
        {
        id: 6,
        title: "CSS Box Model",
        question: "What is the CSS box model and how does it work?",
        answer: "The CSS box model is a design and layout concept that defines the structure of elements in a web page. It consists of content, padding, border, and margin.",
        subject: "Web Development",
        tags: ["css", "box model"],
        mastered: true,
        favorite: true,
        lastReviewed: "2024-01-11",
        timesReviewed: 7,
        difficulty: "medium"
        },
        {
        id: 7,
        title: "JavaScript Promises",
        question: "What are JavaScript promises and how do they work?",
        answer: "Promises are objects that represent the eventual completion or failure of an asynchronous operation. They are used to handle asynchronous operations in JavaScript.",
        subject: "Web Development",
        tags: ["javascript", "promises"],
        mastered: false,
        favorite: false,
        lastReviewed: "2024-01-12",
        timesReviewed: 3,
        difficulty: "easy"
        },
        {
        id: 8,
        title: "React Component Lifecycle",
        question: "What are the main lifecycle methods in a React component?",
        answer: "componentDidMount, componentDidUpdate, componentWillUnmount",
        subject: "Web Development",
        tags: ["react", "lifecycle"],
        mastered: true,
        favorite: true,
        lastReviewed: "2024-01-13",
        timesReviewed: 9,
        difficulty: "hard"
        },
        {
        id: 9,
        title: "SQL Joins",
        question: "What are the different types of SQL joins?",
        answer: "INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN",
        subject: "Database Systems",
        tags: ["sql", "joins"],
        mastered: false,
        favorite: false,
        lastReviewed: "2024-01-14",
        timesReviewed: 6,
        difficulty: "medium"
        },
        {
        id: 10,
        title: "Binary Search Algorithm",
        question: "How does the binary search algorithm work?",
        answer: "The binary search algorithm works by repeatedly dividing the search interval in half. It compares the target value to the middle element of the array and eliminates half of the remaining elements based on the comparison.",
        subject: "Algorithms",
        tags: ["algorithms", "searching"],
        mastered: true,
        favorite: true,
        lastReviewed: "2024-01-15",
        timesReviewed: 4,
        difficulty:"hard"
        },
  ];

  const renderFlashcard = (card) => {
    return (
      <div key={card.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white font-medium text-lg mb-1">{card.title}</h3>
            <p className="text-gray-400 text-sm">{card.subject}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className={`p-2 ${card.favorite ? 'text-purple-400' : 'text-gray-400'} hover:text-purple-400 transition-colors`}>
              <Heart className="w-4 h-4" fill={card.favorite ? "currentColor" : "none"} />
            </button>
            <button className={`p-2 ${card.mastered ? 'text-green-400' : 'text-gray-400'} hover:text-green-400 transition-colors`}>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <p className="text-white">{card.question}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {card.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
              {tag}
            </span>
          ))}
          <span className={`px-2 py-1 rounded-full text-xs ${
            card.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
            card.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-green-500/20 text-green-400'
          }`}>
            {card.difficulty}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Last reviewed: {new Date(card.lastReviewed).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <RotateCw className="w-4 h-4" />
            <span>{card.timesReviewed} reviews</span>
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
            <span className="text-lg font-semibold text-white">Flashcards</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors">
              Study Mode
            </button>
            <button className="text-gray-300 hover:text-white transition-colors">
              Quiz Mode
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
            {/* Categories */}
            <div className="flex items-center space-x-6 mb-8">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>All Flashcards</span>
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
                onClick={() => setSelectedCategory('favorites')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === 'favorites' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Favorites</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center justify-between mb-8">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search flashcards..."
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

            {/* Flashcards Grid */}
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
              {flashcards.map(card => renderFlashcard(card))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;