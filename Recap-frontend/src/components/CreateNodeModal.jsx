// CreateNoteModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CreateNoteModal = ({ isOpen, onClose, onCreateNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateNote({ title, content });
    setTitle('');
    setContent('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Note Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={5}
          />
          <Button type="submit">Create Note</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteModal;