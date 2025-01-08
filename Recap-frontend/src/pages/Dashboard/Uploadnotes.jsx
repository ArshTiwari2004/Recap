import React, { useState } from 'react';
import { FileUp, Image, Mic, Bell, HelpCircle, BookOpen, X, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useCallback } from 'react';
import Profile from '../Profile';


const Dashboard = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteTopic, setNoteTopic] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [dragActive, setDragActive] = useState(false);


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
    
      const handleFiles = (files) => {
        // Here you would typically handle file upload to your backend
        console.log('Files to upload:', files);
        setIsModalOpen(false);
        setIsSuccessModalOpen(true);
      };
    
      const handleUpload = (type) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = type === 'pdf' ? '.pdf' : 
                       type === 'image' ? 'image/*' : 
                       'audio/*';
        
        input.onchange = (e) => {
          if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
          }
        };
        input.click();
      };
      


  return (
    <div className="flex h-screen bg-gray-900"
        onDragEnter={handleDrag}>
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
             <span className="text-white text-sm font-medium">U</span>
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
                  Back
                </button>
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-colors">
                  Generate Tests
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

       {/* Upload Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
             onDragEnter={handleDrag}
             onDragLeave={handleDrag}
             onDragOver={handleDrag}
             onDrop={handleDrop}>
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Choose Upload Type</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className={`grid grid-cols-3 gap-4 ${dragActive ? 'border-2 border-dashed border-purple-500 rounded-xl p-4' : ''}`}>
              <button
                onClick={() => handleUpload('pdf')}
                className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 to-purple-700 rounded-xl hover:from-purple-800 hover:to-purple-600 transition-all duration-300 group"
              >
                <FileUp className="w-8 h-8 mb-3 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">Upload PDF</span>
                <span className="text-purple-300 text-sm mt-2">Max file size : 25 MB</span>
              </button>

              <button
                onClick={() => handleUpload('image')}
                className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 to-purple-700 rounded-xl hover:from-purple-800 hover:to-purple-600 transition-all duration-300 group"
              >
                <Image className="w-8 h-8 mb-3 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">Upload Image</span>
                <span className="text-purple-300 text-sm mt-2">Max file size : 10 MB</span>
              </button>

              <button
                onClick={() => handleUpload('audio')}
                className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 to-purple-700 rounded-xl hover:from-purple-800 hover:to-purple-600 transition-all duration-300 group"
              >
                <Mic className="w-8 h-8 mb-3 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">Upload Audio</span>
                <span className="text-purple-300 text-sm mt-2">Max file size : 25 MB</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">File Uploaded Successfully!</h3>
              <p className="text-gray-400 mb-6">Your file has been uploaded and is ready to view.</p>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    navigate('/my-notes');
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