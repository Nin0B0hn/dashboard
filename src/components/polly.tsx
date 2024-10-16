"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Draggable from "react-draggable";

export function PollCreation() {
  const [pollQuestion, setPollQuestion] = useState("");
  const [options, setOptions] = useState<string[]>([""]);
  const [size] = useState({ width: 320, height: 400 });

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hier kannst du die Poll-Erstellungslogik mit supabase hinzufügen
    console.log({ pollQuestion, options });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Create Poll</Button>
      </PopoverTrigger>
      <Draggable cancel="input,button,textarea">
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
