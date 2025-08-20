// DashboardViewNotes.jsx
import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { fireDB } from "../../config/Firebaseconfig";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";

const DashboardViewNotes = ({ uid }) => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!uid) return;

    const q = query(collection(fireDB, "notes"), where("uid", "==", uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData = [];
      querySnapshot.forEach((doc) => {
        notesData.push({ id: doc.id, ...doc.data() });
      });
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, [uid]);

return (
<div className="mt-8">
  <div className="flex items-center justify-between mb-4">
  <h2 className="text-xl font-semibold text-white mb-2 inline-flex items-center">
  View all your notes
  <ArrowRight className="w-5 h-5 ml-2" />
</h2>
 
    <p
      onClick={() => navigate("/my-notes")}
      className="text-purple-400 cursor-pointer flex items-center gap-1 hover:underline"
    >
      See All <ChevronRight className="w-4 h-4" />
    </p>
  </div>

  <div className="relative">
    {/* Scrollable container */}
    <div className="flex space-x-4 overflow-x-auto overflow-y-visible pb-2 scrollbar-hide">
      {notes.length > 0 ? (
        notes.map((note) => (
          <div
            key={note.id}
            className="min-w-[250px] bg-gray-800 border border-gray-700 rounded-xl p-4 cursor-pointer hover:scale-95 hover:border-purple-400 transform-gpu origin-center transition-transform"
            onClick={() => navigate(`/my-notes/${note.id}`)}
          >
            <p className="text-sm text-gray-400 mb-1">Subject: {note.subject}</p>
            <p className="text-xs text-gray-500 mb-2">Topic: {note.topic}</p>
            <p className="text-white text-sm line-clamp-4">
              {note.content.length > 200
                ? note.content.substring(0, 200) + "..."
                : note.content}
            </p>
            <p className="text-gray-500 text-xs mt-2">
              {note.createdAt?.toDate
                ? new Date(note.createdAt.toDate()).toLocaleDateString()
                : new Date(note.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No notes found.</p>
      )}
    </div>

    {/* Fade overlay at the end */}
    <div className="absolute top-0 right-0 h-full w-12 pointer-events-none bg-gradient-to-l from-gray-900 to-transparent"></div>
  </div>
</div>
);

};

export default DashboardViewNotes;
