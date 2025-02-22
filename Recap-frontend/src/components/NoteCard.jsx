// NoteCard.jsx
import React from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NoteCard = ({ note, onVote, viewMode }) => {
  return (
    <Card className={`bg-gray-800 text-white ${viewMode === 'list' ? 'flex' : ''}`}>
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300">{note.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onVote(note.id, 'upvotes')}>
            <ThumbsUp className="mr-2 h-4 w-4" /> {note.upvotes}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onVote(note.id, 'downvotes')}>
            <ThumbsDown className="mr-2 h-4 w-4" /> {note.downvotes}
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          <MessageSquare className="mr-2 h-4 w-4" /> Comment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;