"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Draggable from "react-draggable";
import { supabase } from "@/lib/supabaseClient"; // Supabase importieren
import { useToast } from "@/hooks/use-toast"; // Toast importieren

export function PollCreation() {
  const [pollQuestion, setPollQuestion] = useState("");
  const [options, setOptions] = useState<string[]>([""]);
  const [size] = useState({ width: 320, height: 400 });
  const [isInputFocused, setIsInputFocused] = useState(false);

  const { toast } = useToast(); // Verwende useToast

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Poll-Daten in Supabase speichern
      const { data, error } = await supabase
        .from("polls")  // Tabelle in Supabase
        .insert([
          {
            question: pollQuestion,
            options: JSON.stringify(options), // Optionen als JSON speichern
          },
        ]);

      if (error) {
        console.error("Error inserting poll:", error);
        toast({
          title: "Error",
          description: "There was an error creating the poll. Please try again.",
          variant: "destructive", // Fehlermeldung
        });
      } else {
        console.log("Poll inserted successfully:", data);
        toast({
          title: "Success",
          description: "Poll created successfully!",
        });
        setPollQuestion(""); // Reset der Felder
        setOptions([""]);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive", // Fehlermeldung
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
                  onFocus={() => setIsInputFocused(true)}  // Draggable deaktivieren
                  onBlur={() => setIsInputFocused(false)}   // Draggable aktivieren
                  className="col-span-2 h-8"
                  placeholder="Enter poll question"
                  required
                />
              </div>

              {options.map((option, idx) => (
                <div key={idx} className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor={`option-${idx + 1}`}>Option {idx + 1}</Label>
                  <Input
                    id={`option-${idx + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    onFocus={() => setIsInputFocused(true)}  // Draggable deaktivieren
                    onBlur={() => setIsInputFocused(false)}   // Draggable aktivieren
                    className="col-span-2 h-8"
                    placeholder={`Enter option ${idx + 1}`}
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
