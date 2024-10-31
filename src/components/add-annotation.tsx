
"use client";

import { useState } from "react";
import { Button} from "@/components/ui/button" ;
import { Input } from "@/components/ui/input" ;
import { supabase } from "@/lib/supabaseClient";

interface AddAnnotationProps {
  onAnnotationCreated: (annotationId: string) => void;
}

const AddAnnotation: React.FC<AddAnnotationProps> = ({ onAnnotationCreated }) => {
  const [initialComment, setInitialComment] = useState<string>("");

  const handleCreateAnnotation = async () => {
    const { data, error } = await supabase
      .from("annotations")
      .insert([{ comment: initialComment }])
      .select("id")
      .single();

    if (error) {
      console.error("Error creating annotation:", error);
      return;
    }

    onAnnotationCreated(data.id); // Pass the annotation ID back to the parent
    setInitialComment("");
  };

  return (
    <div>
      <Input
        value={initialComment}
        onChange={(e) => setInitialComment(e.target.value)}
        placeholder="Enter your comment"
      />
      <Button onClick={handleCreateAnnotation}>Save and Place Thumbtack</Button>
    </div>
  );
};

export default AddAnnotation;
