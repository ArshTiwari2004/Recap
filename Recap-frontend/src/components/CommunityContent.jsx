// CommunityContent.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Search, Grid, List , Lightbulb} from 'lucide-react';
import NoteCard from './NoteCard';
import CreateNoteModal from './CreateNodeModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from './Sidebar';
import NavBar from './NavBar';

const CommunityContent = () => {
  const [notes, setNotes] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    // Fetch notes from your backend/API
    // For now, we'll use dummy data
    const dummyNotes = [
      { id: 1, title: 'React Hooks', content: 'Understanding useState and useEffect', upvotes: 15, downvotes: 2 },
      { id: 2, title: 'Tailwind CSS', content: 'Utility-first CSS framework', upvotes: 20, downvotes: 1 },
      { id: 3, title: 'Next.js Routing', content: 'File-based routing in Next.js', upvotes: 12, downvotes: 3 },
    ];
    setNotes(dummyNotes);
  }, []);

  const handleCreateNote = (newNote) => {
    setNotes([...notes, { ...newNote, id: notes.length + 1, upvotes: 0, downvotes: 0 }]);
    setIsCreateModalOpen(false);
  };

  const handleVote = (id, voteType) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, [voteType]: note[voteType] + 1 }
        : note
    ));
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (

    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <NavBar
          icon={<Lightbulb className="w-6 h-6 text-purple-400" />}
          header={"Community"}
          button1={"Feedback"}
          button2={"Help"}
          button3={"Docs"}
        />


    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Community Notes</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Note
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Tabs value={viewMode} onValueChange={setViewMode}>
          <TabsList>
            <TabsTrigger value="grid"><Grid className="mr-2 h-4 w-4" /> Grid</TabsTrigger>
            <TabsTrigger value="list"><List className="mr-2 h-4 w-4" /> List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {filteredNotes.map(note => (
          <NoteCard 
            key={note.id} 
            note={note} 
            onVote={handleVote}
            viewMode={viewMode}
          />
        ))}
      </div>

      {isCreateModalOpen && (
        <CreateNoteModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)}
          onCreateNote={handleCreateNote}
        />
      )}
    </div>
    </div>
    </div>
  );
};

export default CommunityContent;