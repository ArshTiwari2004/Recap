import React, { useState, useEffect } from 'react';
import { storage, fireDB } from '../../config/Firebaseconfig'; // Import your Firebase configuration
import { collection, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Sidebar'; // Assuming you have a Sidebar component
import { Search, Grid, List, Filter, ChevronDown, BookOpen, Bell, Tag, Archive, Folder, Clock, Eye, Download, Share2, Edit2, Trash2, FileUp, Image, Mic, NotebookPen, } from 'lucide-react';
import { Loader } from '@/components/Loader';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

const Modal = ({ note, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-xl w-4/5 sm:w-3/4 lg:w-1/2 relative max-h-[80vh] overflow-y-auto">
        <div className="flex items-center space-x-4">
          <button 
      onClick={onClose} 
      className="text-white absolute top-4 right-4 text-3xl font-bold hover:text-red-500 transition-colors"
    >
      &times; {/* Close icon */}
    </button>
          {/* Note Icon */}
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <FileUp className="w-5 h-5 text-white" />
          </div>

          {/* Subject and Topic */}
          <div className="flex-1">
            <h3 className="text-white font-medium">{note.subject}</h3>
            <p className="text-gray-400 text-sm">{note.topic}</p>
          </div>
        </div>
        <div className="text-gray-400 mt-4">
          <p>{note.content}</p>
        </div>
        <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
          <span>
            Added on {note.createdAt
              ? new Date(note.createdAt.seconds * 1000).toLocaleDateString()
              : 'Date not available'}
          </span>
        </div>
      </div>
    </div>
  );
};


const MyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [activeFilter, setActiveFilter] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedNote, setSelectedNote] = useState(null);
  const [notesBySubject, setNotesBySubject] = useState({});
  const [user, setUser] = useState(null);

  const fetchNotesBySubject = async () => {
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.uid;

      if (!userId) {
        toast.error('Please log in to view your notes.');
        setLoading(false);
        return;
      }

      // Reference to the user's folder
      const userFolderRef = ref(storage, `${userId}/`);

      // Fetch all subjects in the user's folder
      const subjectSnapshot = await listAll(userFolderRef);
      const subjectFolders = subjectSnapshot.prefixes;

      const notesBySubject = {};

      // Iterate over each subject folder
      for (const subjectFolder of subjectFolders) {
        const subjectName = subjectFolder.name;

        // Fetch all files in the subject folder
        const notesSnapshot = await listAll(subjectFolder);

        const filePromises = notesSnapshot.items.map(async (item) => {
          const downloadURL = await getDownloadURL(item);
          return {
            name: item.name,
            url: downloadURL,
            path: item.fullPath,
          };
        });

        const subjectNotes = await Promise.all(filePromises);

        // Group notes by subject
        notesBySubject[subjectName] = subjectNotes;
      }

      setNotesBySubject(notesBySubject);
    } catch (error) {
      console.error('Error fetching notes by subject:', error);
      toast.error('Failed to load notes by subject.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory === 'subjects') {
      fetchNotesBySubject();
    }
  }, [selectedCategory]);

  // Fetch notes from Firestore
  useEffect(() => {
    const fetchNotes = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.uid;

      if (!userId) {
        toast.error("Please log in to view your notes.");
        setLoading(false);
        return;
      }

      try {
        const notesCollection = collection(fireDB, 'notes');
        const q = query(notesCollection, where('uid', '==', userId));
        const querySnapshot = await getDocs(q);

        const fetchedNotes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNotes(fetchedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast.error("Failed to load your notes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const getLimitedContent = (content) => {
    const words = content.split(' ');
    return words.length > 20 ? words.slice(0, 20).join(' ') + '...' : content;
  };

  const filteredNotes = selectedCategory === 'all'
    ? notes
    : selectedCategory === 'subjects' && selectedSubject
    ? notes.filter(note => note.subject === selectedSubject)
    : notes.filter(note => note.tags && note.tags.includes(selectedCategory));

  const handleSubjectFilterChange = (subject) => {
    setSelectedSubject(subject);
    setSelectedCategory('subjects'); // Change category to 'subjects' when a subject is selected
  };

  const openModal = (note) => {
    setSelectedNote(note);
  };

  // Handle closing the modal
  const closeModal = () => {
    setSelectedNote(null);
  };

  useEffect(() => {
      // Retrieve user data from localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser);
    }, []);

  // Render notes in the UI
  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
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
                U
              </span>
            )}
          </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex items-center space-x-6 mb-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${selectedCategory === 'all'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              <Folder className="w-4 h-4" />
              <span>All Notes</span>
            </button>
            <button
              onClick={() => setSelectedCategory('subjects')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${selectedCategory === 'subjects'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>By Subject</span>
            </button>
            <button
              onClick={() => setSelectedCategory('tagged')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${selectedCategory === 'tagged'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              <Tag className="w-4 h-4" />
              <span>Tagged Notes</span>
            </button>
            <button
              onClick={() => setSelectedCategory('archived')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${selectedCategory === 'archived'
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
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.length === 0 ? (
                <div className="text-center text-white">No notes found.</div>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => openModal(note)}
                    className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-purple-500 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Note Icon */}
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                        <NotebookPen className="w-5 h-5 text-white"  />
                      </div>

                      {/* Subject and Topic */}
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{note.subject}</h3>
                        <p className="text-gray-400 text-sm">{note.topic}</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-gray-400 mt-2">
                      <p>{getLimitedContent(note.content)}</p>
                    </div>

                    <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                      <span>
                        Added on {note.createdAt
                          ? new Date(note.createdAt.seconds * 1000).toLocaleDateString()
                          : 'Date not available'}
                      </span>
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
                  </div>

                ))
              )}
            </div>
          )}
        </div>
      </div>
      {selectedNote && <Modal note={selectedNote} onClose={closeModal} />}
    </div>
  );
};

export default MyNotes;
