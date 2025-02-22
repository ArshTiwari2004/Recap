// CommunityContent.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Search, Grid, List, Users } from 'lucide-react';
import NoteCard from './NoteCard';
import CreateNoteModal from './CreateNodeModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from './Sidebar';
import NavBar from './NavBar';
import { Lightbulb } from 'lucide-react';
//import { toast } from "@/components/ui/use-toast";

const CommunityContent = () => {
  const [notes, setNotes] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateCommunityModalOpen, setIsCreateCommunityModalOpen] = useState(false);

  useEffect(() => {
    // Fetch notes from your backend/API
    // For now, we'll use dummy data
    const dummyNotes = [
      { id: 1, title: 'React Hooks', content: 'Understanding useState and useEffect', upvotes: 15, downvotes: 2, comments: [], tags: ['React', 'JavaScript'], createdBy: 'John Doe', subject: 'Web Development', isPrivate: false, isVerified: true },
      { id: 2, title: 'Tailwind CSS', content: 'Utility-first CSS framework', upvotes: 20, downvotes: 1, comments: [], tags: ['CSS', 'Frontend'], createdBy: 'Jane Smith', subject: 'Web Design', isPrivate: false, isVerified: true },
      { id: 3, title: 'Next.js Routing', content: 'File-based routing in Next.js', upvotes: 8, downvotes: 3, comments: [], tags: ['Next.js', 'React'], createdBy: 'Bob Johnson', subject: 'Web Development', isPrivate: true, isVerified: false },
    ];
    setNotes(dummyNotes);
  }, []);

  const handleCreateNote = (newNote) => {
    setNotes([...notes, { ...newNote, id: notes.length + 1, upvotes: 0, downvotes: 0, comments: [], isVerified: false }]);
    setIsCreateModalOpen(false);
  };

  const handleVote = (id, voteType) => {
    setNotes(notes.map(note => {
      if (note.id === id) {
        const updatedNote = { ...note, [voteType]: note[voteType] + 1 };
        if (updatedNote.upvotes >= 10 && !updatedNote.isVerified) {
          updatedNote.isVerified = true;
        //   toast({
        //     title: "Note Verified!",
        //     description: "This note has received 10 upvotes and is now verified.",
        //   });
        }
        return updatedNote;
      }
      return note;
    }));
  };

  const handleAddComment = (id, comment) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, comments: [...note.comments, comment] }
        : note
    ));
  };

  const handleCreateCommunity = () => {
    const userVerifiedNotes = notes.filter(note => note.isVerified).length;
    if (userVerifiedNotes >= 1) {
      setIsCreateCommunityModalOpen(true);
    } else {
    //   toast({
    //     title: "Cannot Create Community",
    //     description: "You need at least one verified note to create a community.",
    //     variant: "destructive",
    //   });
    }
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
        <div className="space-x-2">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Note
          </Button>
          <Button onClick={handleCreateCommunity}>
            <Users className="mr-2 h-4 w-4" /> Create Community
          </Button>
        </div>
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
            onAddComment={handleAddComment}
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

      {/* Add CreateCommunityModal component here when implemented */}
    </div>
    </div>
    </div>

  );
};

export default CommunityContent;