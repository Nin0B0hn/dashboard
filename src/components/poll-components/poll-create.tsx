"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Draggable from "react-draggable";
import { supabase } from "@/lib/supabaseClient"; // Supabase importieren
import { useToast } from "@/hooks/use-toast"; // Toast importieren

interface Option {
  label: string;
  value: number;
}

export function PollCreation() {
  const [pollQuestion, setPollQuestion] = useState("");
  const [options, setOptions] = useState<Option[]>([{ label: "", value: 1 }]);
  const [size] = useState({ width: 320, height: 400 });
  const [isInputFocused] = useState(false);

  const { toast } = useToast(); // Verwende useToast

  const handleAddOption = () => {
    setOptions([
      ...options,
      { label: "", value: options.length + 1 },
    ]);
  };

  const handleOptionChange = (index: number, field: "label", value: string) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Poll-Daten in Supabase speichern
      const { data, error } = await supabase
        .from("polls") // Tabelle in Supabase
        .insert([
          {
            question: pollQuestion,
            options: options, // Optionen als Array von Objekten speichern
          },
        ]);

      if (error) {
        console.error("Error inserting poll:", error);
        toast({
          title: "Error",
          description: "There was an error creating the poll. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log("Poll inserted successfully:", data);
        toast({
          title: "Success",
          description: "Poll created successfully!",
        });
        setPollQuestion("");
        setOptions([{ label: "", value: 1 }]);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Create Poll</Button>
      </PopoverTrigger>
      
      <Draggable disabled={isInputFocused}>
        <PopoverContent
          className="poppy backdrop-blur-xl bg-opacity-50 text-black p-4 rounded-md"
          style={{ width: size.width, height: size.height, overflow: "auto" }}
        >
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Create a Poll</h4>
              <p className="text-sm text-muted-foreground">
                Add a question and options for your poll.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="pollQuestion">Question</Label>
                <Input
                  id="pollQuestion"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="col-span-2 h-8 border p-2 rounded"
                  placeholder="Enter poll question"
                  required
                />
              </div>

              {options.map((option, idx) => (
                <div key={idx} className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor={`option-label-${idx + 1}`}>Option {idx + 1}</Label>
                  <Input
                    id={`option-label-${idx + 1}`}
                    value={option.label}
                    onChange={(e) => handleOptionChange(idx, "label", e.target.value)}
                    className="col-span-2 h-8"
                    placeholder={`Enter option ${idx + 1} label`}
                    required
                  />
                </div>
              ))}

              <Button type="button" onClick={handleAddOption} className="w-full">
                Add Option
              </Button>

              <Button type="submit" className="w-full">
                Submit Poll
              </Button>
            </form>
          </div>
        </PopoverContent>
      </Draggable>
    </Popover>
  );
}
