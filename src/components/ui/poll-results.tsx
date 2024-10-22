"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Draggable from "react-draggable";
import { ScrollArea } from "@/components/ui/scroll-area"

// Interfaces
interface SupabasePoll {
  id: string;
  question: string;
  options: string | string[]; // Kann String oder Array sein
  votes_count: string | { [key: string]: number }; // Kann String oder Objekt sein
}

interface Poll {
  id: string;
  question: string;
  options: { name: string; votes: number }[]; // Für das Diagramm
}

export function PollResults() {
  const [pollResults, setPollResults] = useState<Poll[]>([]);
  const [size] = useState({ width: 500, height: 500 });

  // Abrufen der Poll-Ergebnisse von Supabase
  useEffect(() => {
    fetchPollResults();
  }, []);

  const fetchPollResults = async () => {
    const { data, error } = await supabase
      .from("polls")
      .select("id, question, options, votes_count");

    if (error) {
      console.error("Error fetching poll results:", error);
    } else if (data) {
      const parsedData = data.map((poll: SupabasePoll) => {
        // Überprüfe den Typ von poll.options
        console.log("poll.options:", poll.options);
        console.log("Type of poll.options:", typeof poll.options);

        // Parsen von options, falls notwendig
        let optionsArray: string[] = [];
        if (typeof poll.options === "string") {
          optionsArray = JSON.parse(poll.options);
        } else if (Array.isArray(poll.options)) {
          optionsArray = poll.options;
        }

        // Parsen von votes_count, falls notwendig
        let votesCountObj: { [key: string]: number } = {};
        if (typeof poll.votes_count === "string") {
          votesCountObj = JSON.parse(poll.votes_count);
        } else if (poll.votes_count && typeof poll.votes_count === "object") {
          votesCountObj = poll.votes_count;
        }

        return {
          id: poll.id,
          question: poll.question,
          options: optionsArray.map((option: string) => ({
            name: option,
            votes: votesCountObj[option] || 0,
          })),
        } as Poll;
      });
      setPollResults(parsedData);
    }
  };

  return (
    <Popover onOpenChange={(open) => open && fetchPollResults()}>
      <PopoverTrigger asChild>
        <Button variant="outline">View Poll Results</Button>
      </PopoverTrigger>
      <ScrollArea>
        <Draggable>
          <PopoverContent
            className="poppy backdrop-blur-xl bg-opacity-50 text-black p-4 rounded-md"
            style={{ width: size.width, height: size.height, overflow: "auto" }}
          >
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Poll Results</h4>
                {pollResults.length === 0 ? (
                  <p>No results available yet.</p>
                ) : (
                  pollResults.map((poll) => (
                    <div key={poll.id} className="space-y-2">
                      <h5 className="font-medium">{poll.question}</h5>

                      {/* Chart Container */}
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={poll.options}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="votes" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>

                    </div>
                  ))
                )}
              </div>
            </div>
          </PopoverContent>
        </Draggable>
      </ScrollArea>
    </Popover>
  );
}
