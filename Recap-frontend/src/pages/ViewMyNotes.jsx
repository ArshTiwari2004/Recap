// ViewMyNotes.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { fireDB } from "../config/Firebaseconfig";
import {
  ChevronLeft,
  Edit,
  Download,
  Share,
  Trash2,
  Save,
  X,
  Copy,
  MessageCircle,
  Mail,
  Users,
  Brain,
  FileQuestion,
  FileText,
  Calendar
} from "lucide-react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import html2pdf from "html2pdf.js";

const ViewMyNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [showGroupShare, setShowGroupShare] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) return;

      try {
        const docRef = doc(fireDB, "notes", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const noteData = { id: docSnap.id, ...docSnap.data() };
          setNote(noteData);
          setEditedContent(noteData.content);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  useEffect(() => {
    const fetchUserGroups = async () => {
      if (!note?.uid) return;
      
      try {
        const q = query(
          collection(fireDB, "groups"), 
          where("members", "array-contains", note.uid)
        );
        const querySnapshot = await getDocs(q);
        const groups = [];
        querySnapshot.forEach((doc) => {
          groups.push({ id: doc.id, ...doc.data() });
        });
        setUserGroups(groups);
      } catch (error) {
        console.error("Error fetching user groups:", error);
      }
    };

    if (showGroupShare) {
      fetchUserGroups();
    }
  }, [showGroupShare, note?.uid]);

  const handleSave = async () => {
    try {
      const docRef = doc(fireDB, "notes", id);
      await updateDoc(docRef, {
        content: editedContent,
        updatedAt: new Date()
      });
      
      setNote({ ...note, content: editedContent });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(fireDB, "notes", id));
      navigate("/my-notes");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const downloadAsText = () => {
    const element = document.createElement("a");
    const file = new Blob([`Subject: ${note.subject}\nTopic: ${note.topic}\n\n${note.content}`], 
      { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${note.subject}_${note.topic}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAsPDF = () => {
    const element = document.getElementById("note-content");
    const opt = {
      margin: 10,
      filename: `${note.subject}_${note.topic}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  const downloadAsMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([`# ${note.subject}\n## ${note.topic}\n\n${note.content}`], 
      { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${note.subject}_${note.topic}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const shareToGroup = async () => {
    if (!selectedGroup) return;
    
    try {
      await addDoc(collection(fireDB, "sharedNotes"), {
        noteId: id,
        groupId: selectedGroup,
        sharedBy: note.uid,
        sharedAt: new Date(),
        noteSubject: note.subject,
        noteTopic: note.topic
      });
      
      alert("Note shared to group successfully!");
      setShowGroupShare(false);
      setSelectedGroup("");
    } catch (error) {
      console.error("Error sharing note to group:", error);
    }
  };

  const shareToWhatsApp = () => {
    const text = `Check out my note on ${note.subject} - ${note.topic}: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToEmail = () => {
    const subject = `My note on ${note.subject} - ${note.topic}`;
    const body = `I wanted to share this note with you:\n\n${window.location.href}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading note...</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Note not found</div>
      </div>
    );
  }

return (

  <div className="min-h-screen bg-gray-900 text-white">
    {/* Animated background pattern */}
    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%239C92AC%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
    
    <div className="relative z-10 p-6">
      {/* Header with back button and note info */}
      <div className="max-w-5xl mx-auto mb-8">
        {/* Back button with enhanced styling */}
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center text-purple-300 hover:text-white mb-8 transition-all duration-300 hover:translate-x-[-4px]"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 mr-3 group-hover:bg-white/20 transition-all duration-300">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Notes</span>
        </button>
        
        {/* Note header with glassmorphism card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-3 leading-tight">
                {note.subject}
              </h1>
              <p className="text-xl text-gray-300 mb-4 font-medium">{note.topic}</p>
              <div className="flex items-center text-sm text-gray-400">
                <div className="bg-white/10 rounded-full p-1 mr-2">
                  <Calendar className="w-3 h-3" />
                </div>
                Created: {note.createdAt?.toDate ? 
                  new Date(note.createdAt.toDate()).toLocaleDateString() : 
                  new Date(note.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            {/* Action buttons with enhanced styling */}
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="group flex items-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-4 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 hover:scale-105"
                  >
                    <Save className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                    <span className="font-medium">Save</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedContent(note.content);
                    }}
                    className="group flex items-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <X className="w-4 h-4 mr-2" />
                    <span className="font-medium">Cancel</span>
                  </button>
                </>
              ) : (
                <>
              <button
  onClick={() => setIsEditing(true)}
  className="flex justify-center items-center  
             hover:from-blue-600 hover:to-indigo-600 w-12 h-12 rounded-full 
             transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105"
>
  <Edit className="w-5 h-5 transition-transform group-hover:rotate-12" />
</button>

             <button
  onClick={() => setShowShareOptions(!showShareOptions)}
  className="flex justify-center items-center  
             hover:from-purple-600 hover:to-pink-600 w-12 h-12 rounded-full 
             transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105"
>
  <Share className="w-5 h-5 transition-transform group-hover:rotate-12" />
</button>

<button
  onClick={() => setShowDeleteConfirm(true)}
  className="flex justify-center items-center 
             hover:from-red-600 hover:to-rose-600 w-12 h-12 rounded-full 
             transition-all duration-300 shadow-lg hover:shadow-red-500/25 hover:scale-105"
>
  <Trash2 className="w-5 h-5 transition-transform group-hover:animate-bounce" />
</button>

                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Share options dropdown with glassmorphism */}
        {showShareOptions && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8 shadow-2xl animate-in slide-in-from-top duration-300">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Share Your Note</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={copyLink}
                className="group flex flex-col items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="bg-gradient-to-r from-gray-400 to-gray-600 p-2 rounded-lg mb-2 group-hover:animate-pulse">
                  <Copy className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">Copy Link</span>
              </button>
              <button
                onClick={shareToWhatsApp}
                className="group flex flex-col items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="bg-gradient-to-r from-green-400 to-green-600 p-2 rounded-lg mb-2 group-hover:animate-pulse">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">WhatsApp</span>
              </button>
              <button
                onClick={shareToEmail}
                className="group flex flex-col items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-2 rounded-lg mb-2 group-hover:animate-pulse">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">Email</span>
              </button>
              <button
                onClick={() => setShowGroupShare(true)}
                className="group flex flex-col items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-2 rounded-lg mb-2 group-hover:animate-pulse">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">Group</span>
              </button>
            </div>
          </div>
        )}
        
       
        {showGroupShare && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in slide-in-from-bottom duration-300">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Share to Group</h3>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-6 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
              >
                <option value="" className="bg-gray-800">Select a group</option>
                {userGroups.map(group => (
                  <option key={group.id} value={group.id} className="bg-gray-800">
                    {group.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowGroupShare(false);
                    setSelectedGroup("");
                  }}
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={shareToGroup}
                  disabled={!selectedGroup}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                    selectedGroup 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25" 
                      : "bg-gray-600/50 cursor-not-allowed"
                  }`}
                >
                  Share Now
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Delete confirmation modal with enhanced styling */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
            <div className="bg-white/5 backdrop-blur-md border border-white/20 p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in slide-in-from-bottom duration-300">
              <div className="text-center mb-6">
                <div className="bg-red-500/20 rounded-full p-3 inline-block mb-4">
                  <Trash2 className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Delete Note</h3>
                <p className="text-white">Are you sure you want to delete this note? This action cannot be undone.</p>
              </div>
             <div className="flex justify-center space-x-4 mt-4">
  <button
    onClick={() => setShowDeleteConfirm(false)}
    className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 font-medium"
  >
    Cancel
  </button>
  <button
    onClick={handleDelete}
    className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/25 font-medium"
  >
    Delete 
  </button>
</div>

              </div>
            </div>

        )}
        
        {/* Enhanced action buttons grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <button
            onClick={() => navigate(`/flashcards/${id}`)}
            className="group bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="bg-gradient-to-r from-indigo-400 to-purple-500 p-2 rounded-lg mb-2 mx-auto w-fit group-hover:animate-pulse">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium block">Flashcards</span>
          </button>
          
          <button
            onClick={() => navigate(`/ai-insights/${id}`)}
            className="group bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="bg-gradient-to-r from-teal-400 to-cyan-500 p-2 rounded-lg mb-2 mx-auto w-fit group-hover:animate-pulse">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium block">AI Analysis</span>
          </button>
          
          <button
            onClick={() => navigate(`/quizzes/${id}`)}
            className="group bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-2 rounded-lg mb-2 mx-auto w-fit group-hover:animate-pulse">
              <FileQuestion className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium block">Quiz</span>
          </button>
          
          <div className="relative group col-span-2 md:col-span-1">
            <button className="w-full group bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="bg-gradient-to-r from-emerald-400 to-green-500 p-2 rounded-lg mb-2 mx-auto w-fit group-hover:animate-pulse">
                <Download className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium block">Download</span>
            </button>
            <div className="absolute left-0 mt-2 w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 overflow-hidden">
              <button
                onClick={downloadAsText}
                className="block w-full text-left px-4 py-3 hover:bg-white/20 transition-all duration-200 font-medium"
              >
                📄 Text File
              </button>
              <button
                onClick={downloadAsPDF}
                className="block w-full text-left px-4 py-3 hover:bg-white/20 transition-all duration-200 font-medium"
              >
                📋 PDF
              </button>
              <button
                onClick={downloadAsMarkdown}
                className="block w-full text-left px-4 py-3 hover:bg-white/20 transition-all duration-200 font-medium rounded-b-xl"
              >
                📝 Markdown
              </button>
            </div>
          </div>
        </div>
        
        {/* Enhanced note content */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-4 border-b border-white/20">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              📚 Note Content
            </h3>
          </div>
          <div id="note-content" className="p-8">
            {isEditing ? (
              <div className="relative">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-96 bg-white/5 backdrop-blur-sm text-white p-6 rounded-xl border border-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 placeholder-gray-400 resize-none"
                  placeholder="Start writing your note content..."
                />
                <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">
                  {editedContent.length} characters
                </div>
              </div>
            ) : (
              <div className="prose prose-invert prose-purple max-w-none">
                <div className="whitespace-pre-wrap break-words text-gray-100 leading-relaxed text-lg">
                  {note.content || (
                    <div className="text-center py-12 text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No content available. Click Edit to add content.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
 
);

};

export default ViewMyNotes;