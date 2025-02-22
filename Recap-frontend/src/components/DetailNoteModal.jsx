// DetailedNoteModal.jsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, MessageSquare, User, Tag, Lock, Globe } from 'lucide-react';

const DetailedNoteModal = ({ note, isOpen, onClose, onVote, onAddComment }) => {
  const [comment, setComment] = useState('');

  const handleAddComment = () => {
    onAddComment(note.id, comment);
    setComment('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span className="text-2xl font-bold">{note.title}</span>
            {note.isVerified && (
              <Badge variant="secondary" className="bg-purple-600 text-white">Verified</Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>{note.createdBy}</span>
            </div>
            <div className="flex items-center">
              {note.isPrivate ? <Lock className="mr-2 h-4 w-4" /> : <Globe className="mr-2 h-4 w-4" />}
              <span>{note.isPrivate ? 'Private' : 'Public'}</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Subject</h3>
            <p className="text-gray-300">{note.subject}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-300">{note.content}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-purple-400 border-purple-400">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button 
              className=" text-green-400 hover:text-green-500"
              variant="outline" size="sm" onClick={() => onVote(note.id, 'upvotes')}>
                <ThumbsUp className="mr-2 h-4 w-4 text-green-400" /> {note.upvotes}
              </Button>
              <Button 
              className="text-red-400 hover:text-red-500"
              variant="outline" size="sm" onClick={() => onVote(note.id, 'downvotes')}>
                <ThumbsDown className="mr-2 h-4 w-4 text-red-400" /> {note.downvotes}
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Comments</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {note.comments.map((comment, index) => (
                <div key={index} className="bg-gray-700 p-2 rounded">
                  <p className="text-sm">{comment}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-gray-700 text-white"
            />
            <Button onClick={handleAddComment} className="mt-2">Add Comment</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedNoteModal;