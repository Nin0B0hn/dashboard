"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/lib/supabaseClient"; // Supabase importieren
import { useToast } from "@/hooks/use-toast"; // Toast importieren
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Option {
  label: string;
  value: number;
}

export function PollCreation() {
  const [pollQuestion, setPollQuestion] = useState("");
  const [options, setOptions] = useState<Option[]>([{ label: "", value: 1 }]);
  const [size] = useState({ width: 566, height: 550 });

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
      <Card className="backdrop-blur-lg shadow-lg rounded-md p-4 w-full h-auto">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-800">
            Create a Poll
          </CardTitle>
        </CardHeader>
        <ScrollArea className="rounded-md border">
          <CardContent 
          className="space-y-4"
          style={{ width: size.width, height: size.height, overflow: "auto" }}>
        
          <div className="grid gap-4">
            <div className="space-y-2">
              {/* <h4 className="font-medium leading-none">Create a Poll</h4> */}
              <p className="text-sm text-muted-foreground">
                Add a question and options for your poll.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid grid-cols-2 items-center gap-2">
                {/* <Label htmlFor="pollQuestion">Question</Label> */}
                <Input
                  id="pollQuestion"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="col-span-2 h-8 border p-2 rounded"
                  placeholder="Enter question"
                  required
                />
              </div>

              {options.map((option, idx) => (
                <div key={idx} className="grid grid-cols-3 items-center gap-4">
                  {/* <Label htmlFor={`option-label-${idx + 1}`}>Option {idx + 1}</Label> */}
                  <Input
                    id={`option-label-${idx + 1}`}
                    value={option.label}
                    onChange={(e) => handleOptionChange(idx, "label", e.target.value)}
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
        </CardContent>
        </ScrollArea>
      </Card>
  );
}
