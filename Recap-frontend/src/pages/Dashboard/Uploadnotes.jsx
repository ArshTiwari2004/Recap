import React, { useState, useCallback, useEffect } from 'react';
import { FileUp, Image, Mic, Bell, BookOpen, X, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage, fireDB } from '../../config/Firebaseconfig';
import Profile from '../Profile';
import AudioTranscription from './Audio';
import { Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import ProgressBar from '@/components/ProgressBar';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteTopic, setNoteTopic] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState(null);
  const [showTranscriptionReview, setShowTranscriptionReview] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [topicName, setTopicName] = useState('');
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFiles(files);
    }
  }, []);

  const handleSaveClick = () => {
    setIsSuccessModalOpen(true); // Open the modal
  };


  const handleFiles = async (files) => {
    const file = files[0];
    try {
      const storageRef = ref(storage, `uploads/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log('File uploaded successfully:', downloadURL);
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  const selectFile = async (fileType) => {
    return new Promise((resolve, reject) => {
      // If the file type is audio, do not open the file selector
      if (fileType === "audio") {
        reject(new Error("Audio file selection is not supported"));
        return;
      }
  
      const input = document.createElement("input");
      input.type = "file";
  
      // Set accepted file types based on the selected file type
      switch (fileType) {
        case "audio":
        // Directly resolve "audio" type
        resolve("audio");
        return;
        case "pdf":
          input.accept = "application/pdf";
          break;
        case "image":
          // input.accept = "image/*";
          // break;
          resolve("image");
          return;
        default:
          reject(new Error("Unsupported file type"));
          return;
      }
  
      // Handle file selection
      input.onchange = () => {
        if (input.files && input.files[0]) {
          resolve(input.files[0]);
        } else {
          reject(new Error("No file selected"));
        }
      };
  
      // Handle errors
      input.onerror = () => reject(new Error("File selection failed"));
  
      // Trigger file input
      input.click();
    });
  };

  // Handle file upload
  const handleUpload = async (fileType) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.uid;

    if (!userId) {
      console.error("User ID not found. Ensure the user is logged in.");
      toast.error("Session expired. Please log in again.");
      return;
    }

    if (!subjectName || !topicName) {
      toast.error("Please enter both Subject Name and Topic Name before uploading.");
      return;
    }

    const sanitizedSubjectName = subjectName.trim().toLowerCase();
    const sanitizedTopicName = topicName.trim().toLowerCase();

    try {
      if (fileType === 'audio') {
        setIsModalOpen(false);
        setActiveComponent('audio');
      }
      if (fileType === "image") {
        navigate("/ocr");
      }
      const file = await selectFile(fileType);
      if (!file) return;

      const storageRef = ref(
        storage,
        `${userId}/${sanitizedSubjectName}/${sanitizedTopicName}/${file.name}`
      );

      const uploadTask = uploadBytesResumable(storageRef, file);

      setIsUploading(true);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload failed:", error);
          alert("An error occurred during upload. Please try again.");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at:", downloadURL);
          setNotees((prevNotees) => [...prevNotees, downloadURL]);
          setIsSuccessModalOpen(true);
          // alert("File uploaded successfully!");
        }
      );
      setSubjectName("");
      setTopicName("");
    } catch (error) {
      console.error("Error during file selection or upload:", error);
      // alert("Failed to upload the file. Please try again.");
    }
  };

  const handleTranscriptionComplete = (transcriptionData) => {
    setTranscriptionResult(transcriptionData);
    setActiveComponent(null);
    setShowTranscriptionReview(true);
  };

  const handleDeleteTranscription = () => {
    setTranscriptionResult(null);
    setShowTranscriptionReview(false);
  };

 const handleSaveNote = async () => {
    if (!noteTitle.trim() || !noteTopic.trim() || noteContent.trim().length < 20) {
      toast.error('Please fill all fields and ensure the content is at least 20 characters.');
      return;
    }
  
    setLoading(true);
  
    try {
      // Retrieve logged-in user's data
      const user = JSON.parse(localStorage.getItem("user")); 
      if (!user?.uid) {
        throw new Error("User not logged in! Please log in to save your notes.");
      }
  
      // Create the note object
      const noteData = {
        subject: noteTitle.trim(),
        topic: noteTopic.trim(),
        content: noteContent.trim(),
        uid: user.uid,
        createdAt: serverTimestamp(),
      };
  
      // Save note to Firestore
      const docRef = await addDoc(collection(fireDB, 'notes'), noteData);
  
      // Notify the user
      toast.success('Note saved successfully!');
      console.log(`Note ID: ${docRef.id}`);
  
      // Clear input fields
      setNoteTitle('');
      setNoteTopic('');
      setNoteContent('');
    } catch (error) {
      console.error('Error saving note:', error);
      if (error.message.includes("User not logged in")) {
        toast.error(error.message); // Specific error message
      } else {
        toast.error('Failed to save the note. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);
  
  return (
    <div className="flex h-screen bg-gray-900" onDragEnter={handleDrag}>
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="h-16 bg-gray-800 border-b border-gray-700 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <span className="text-lg font-semibold text-white">Notes Dashboard</span>
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
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="mb-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-purple-500/25 group"
              >
                <Upload className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">Upload Notes</span>
              </button>
              <p className="text-gray-500 text-sm mb-8">Drop files here (Max file size: 25 MB per file)</p>
            </div>

            {/* Note Editor */}
            <div className="space-y-4 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <input
                type="text"
                placeholder="Subject Name"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
              />

              <input
                type="text"
                placeholder="Topic"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                value={noteTopic}
                onChange={(e) => setNoteTopic(e.target.value)}
              />

              <textarea
                placeholder="Your note must contain at least 20 characters..."
                className="w-full h-64 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />

              <div className="flex justify-end space-x-4">
                <button className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                  Delete
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-colors">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Upload Notes</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Enter Subject Name"
                className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:outline-none"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Enter Topic Name"
                className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:outline-none"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
              />
            </div>

            <div className={`grid grid-cols-3 gap-4 ${dragActive ? 'border-2 border-dashed border-purple-500 rounded-xl p-4' : ''}`}>
              <button onClick={() => handleUpload("pdf")}
                className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 to-purple-700 rounded-xl hover:from-purple-800 hover:to-purple-600 transition-all duration-300 group">
                <FileUp className="w-8 h-8 mb-3 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">Upload PDF</span>
                <span className="text-purple-300 text-sm mt-2">Max file size: 25 MB</span>
              </button>

              <button onClick={() => handleUpload('image')}
                className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-900 to-pink-700 rounded-xl hover:from-pink-800 hover:to-pink-600 transition-all duration-300 group">
                <Image className="w-8 h-8 mb-3 text-pink-400 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">Upload Image</span>
                <span className="text-pink-300 text-sm mt-2">Max file size: 25 MB</span>
              </button>

              <button onClick={() => handleUpload('audio')}
                className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl hover:from-blue-800 hover:to-blue-600 transition-all duration-300 group">
                <Mic className="w-8 h-8 mb-3 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">Upload Audio</span>
                <span className="text-blue-300 text-sm mt-2">Max file size: 25 MB</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Transcription Review Modal */}
      {showTranscriptionReview && transcriptionResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full mx-4 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Transcription Result</h3>
              <button
                onClick={() => setShowTranscriptionReview(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Transcription Content */}
            <div className="bg-gray-700/50 rounded-xl p-6 mb-6 max-h-[60vh] overflow-y-auto">
              <h4 className="text-purple-400 font-medium mb-2">
                {transcriptionResult.title || 'Audio Transcription'}
              </h4>
              <div className="text-gray-200 whitespace-pre-wrap">
                {transcriptionResult.content}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDeleteTranscription}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
              <button
                onClick={handleSaveClick}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Note</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio Transcription Modal */}
      {activeComponent === 'audio' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full mx-4 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Audio Transcription</h3>
              <button onClick={() => setActiveComponent(null)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <AudioTranscription onTranscriptionComplete={handleTranscriptionComplete} />
          </div>
        </div>
      )}

      {isUploading && (
        <div className="mt-4">
          <p className="text-center text-gray-500">Uploading... {Math.round(progress)}%</p>
          <ProgressBar progress={progress} />
        </div>
      )}

      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">File Saved Successfully!</h3>
              <p className="text-gray-400 mb-6">Your file has been saved and is ready to view.</p>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    navigate('/my-notes'); // Navigating to the notes page
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-colors"
                >
                  View Your Notes
                </button>
                <button
                  onClick={() => setIsSuccessModalOpen(false)}
                  className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
