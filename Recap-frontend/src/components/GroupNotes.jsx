import React, { useState, useEffect } from 'react';
import { fireDB } from '../config/Firebaseconfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useFirebase } from '@/context/FirebaseContext';
import { Edit2, Trash2, Save } from 'lucide-react';

const GroupNotes = ({ groupId }) => {
  const { currentUser, addNote } = useFirebase();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    const notesRef = collection(fireDB, `groups/${groupId}/notes`);
    const q = query(notesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesList = [];
      snapshot.forEach((doc) => {
        notesList.push({ id: doc.id, ...doc.data() });
      });
      setNotes(notesList);
    });

    return () => unsubscribe();
  }, [groupId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    try {
      await addNote(groupId, newNote);
      setNewNote({ title: '', content: '' });
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await fireDB.collection(`groups/${groupId}/notes`).doc(noteId).delete();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-4">
        <input
          type="text"
          placeholder="Note Title"
          className="w-full px-4 py-2 mb-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <textarea
          placeholder="Note Content"
          rows="4"
          className="w-full px-4 py-2 mb-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Add Note
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-gray-800 rounded-xl p-4">
            {editingNote === note.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={note.title}
                  onChange={(e) => {
                    const updatedNotes = notes.map(n =>
                      n.id === note.id ? { ...n, title: e.target.value } : n
                    );
                    setNotes(updatedNotes);
                  }}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <textarea
                  value={note.content}
                  onChange={(e) => {
                    const updatedNotes = notes.map(n =>
                      n.id === note.id ? { ...n, content: e.target.value } : n
                    );
                    setNotes(updatedNotes);
                  }}
                  rows="4"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <button
                  onClick={() => setEditingNote(null)}
                  className="flex items-center space-x-2 text-purple-400 hover:text-purple-300"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-white">{note.title}</h3>
                  {note.userId === currentUser.uid && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingNote(note.id)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-gray-300 whitespace-pre-wrap">{note.content}</p>
                <div className="mt-2 text-sm text-gray-400">
                  Posted by {note.userName}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupNotes;