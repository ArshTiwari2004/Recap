import React, { useState, useEffect } from 'react';
import { storage, fireDB } from '../../config/Firebaseconfig';
import { collection, getDocs, query, where, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';
import { 
  Search, Grid, List, Filter, ChevronDown, BookOpen, Bell, Tag, 
  Archive, Folder, Clock, Eye, Download, Share2, Edit2, Trash2, 
  FileUp, Image, Mic, NotebookPen, Save, X 
} from 'lucide-react';
import { Loader } from '@/components/Loader';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import Notification from '@/components/Notifications';
import NavBar from '@/components/NavBar';
import Chatbot from '../ChatBot';
import ShareModal from '@/components/ShareModal';
import DownloadModal from '@/components/DownloadModal';

// View Modal Component
const Modal = ({ note, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-xl w-4/5 sm:w-3/4 lg:w-1/2 relative max-h-[80vh] overflow-y-auto border border-white">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onClose} 
            className="text-white absolute top-4 right-4 text-3xl font-bold hover:text-red-500 transition-colors"
          >
            &times;
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <FileUp className="w-5 h-5 text-white" />
          </div>
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

// Edit Modal Component
const EditNoteModal = ({ note, onClose, onUpdate }) => {
  const [editedNote, setEditedNote] = useState({
    subject: note.subject,
    topic: note.topic,
    content: note.content
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedNote(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const noteRef = doc(fireDB, 'notes', note.id);
      await updateDoc(noteRef, {
        ...editedNote,
        updatedAt: new Date()
      });
      
      onUpdate({
        ...note,
        ...editedNote,
        updatedAt: new Date()
      });
      
      toast.success('Note updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded-xl w-4/5 sm:w-3/4 lg:w-1/2 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-xl text-white font-semibold mb-4">Edit Note</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={editedNote.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Topic</label>
            <input
              type="text"
              name="topic"
              value={editedNote.topic}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Content</label>
            <textarea
              name="content"
              value={editedNote.content}
              onChange={handleChange}
              rows="6"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Component
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
  const [editingNote, setEditingNote] = useState(null);
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

      const userFolderRef = ref(storage, `${userId}/`);
      const subjectSnapshot = await listAll(userFolderRef);
      const subjectFolders = subjectSnapshot.prefixes;

      const notesBySubject = {};

      for (const subjectFolder of subjectFolders) {
        const subjectName = subjectFolder.name;
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

  const handleNoteUpdate = (updatedNote) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
  };

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
    setSelectedCategory('subjects');
  };

  const openModal = (note) => {
    setSelectedNote(note);
  };

  const closeModal = () => {
    setSelectedNote(null);
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <NavBar icon={<BookOpen className="w-6 h-6 text-purple-400" />} header={"My Notes"} button1={"Feedback"} button2={"Help"} button3={"Docs"} />

        <div className="flex-1 p-8 overflow-auto">
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
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                        <NotebookPen className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-white font-medium">{note.subject}</h3>
                        <p className="text-gray-400 text-sm">{note.topic}</p>
                      </div>
                    </div>

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
                        <button 
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
            e.stopPropagation();
            setEditingNote(note);
            setSelectedNote(null);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {/* <button 
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="w-4 h-4" />
                        </button> */}
                        <DownloadModal note={note} />
                        <ShareModal note={note} />
                        <button 
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
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
      {editingNote && (
        <EditNoteModal
          note={editingNote}
          onClose={() => setEditingNote(null)}
          onUpdate={handleNoteUpdate}
        />
      )}
      <Chatbot />
    </div>
  );
};

export default MyNotes;