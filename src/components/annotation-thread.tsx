"use client"

import { useState, useEffect } from "react";
import { Button} from "@/components/ui/button" ;
import { Input } from "@/components/ui/input" ;
import { supabase } from "@/lib/supabaseClient";

interface AnnotationThreadProps {
  annotationId: string;
}

interface Comment {
  id: string;
  text: string;
}

const AnnotationThread: React.FC<AnnotationThreadProps> = ({ annotationId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("annotation_id", annotationId);

      if (error) {
        console.error("Error fetching comments:", error);
      } else {
        setComments(data);
      }
    };

    fetchComments();
  }, [annotationId]);

  const handleAddComment = async () => {
    const { data, error } = await supabase
      .from("comments")
      .insert([{ annotation_id: annotationId, text: newComment }]);

    if (error) {
      console.error("Error adding comment:", error);
    } else {
      setComments([...comments, data[0]]);
      setNewComment("");
    }
  };

  return (
    <div>
      <div>
        {comments.map((comment) => (
          <p key={comment.id}>{comment.text}</p>
        ))}
      </div>
      <Input
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment"
      />
      <Button onClick={handleAddComment}>Submit</Button>
    </div>
  );
};

export default AnnotationThread;
