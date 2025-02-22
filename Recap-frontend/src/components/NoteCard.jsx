// NoteCard.jsx
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, User, Tag } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DetailedNoteModal from './DetailNoteModal';

const NoteCard = ({ note, onVote, viewMode, onAddComment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card 
        className={`bg-gray-800 text-white border-purple-700 hover:border-purple-500 transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'flex' : ''}`}
        onClick={() => setIsModalOpen(true)}
      >
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{note.title}</span>
            {note.isVerified && (
              <Badge variant="secondary" className="bg-purple-600 text-white">Verified</Badge>
            )}
          </CardTitle>
          <div className="flex items-center text-sm text-gray-400">
            <User className="mr-2 h-4 w-4" />
            <span>{note.createdBy}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 line-clamp-3">{note.content}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {note.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-purple-400 border-purple-400">
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button 
                  className=" text-green-400 hover:text-green-500"
            variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onVote(note.id, 'upvotes'); }}>
              <ThumbsUp className="mr-2 h-4 w-4 text-green-400" /> {note.upvotes}
            </Button>
            <Button 
              className="text-red-400 hover:text-red-500"
            variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onVote(note.id, 'downvotes'); }}>
              <ThumbsDown className="mr-2 h-4 w-4 text-red-400" /> {note.downvotes}
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <MessageSquare className="mr-2 h-4 w-4" /> {note.comments.length}
          </Button>
        </CardFooter>
      </Card>
      {isModalOpen && (
        <DetailedNoteModal 
          note={note} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onVote={onVote}
          onAddComment={onAddComment}
        />
      )}
    </>
  );
};

export default NoteCard;