"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { interpretOPI } from '@/utils/interpretOPI';

// Interfaces
interface SupabasePoll {
  id: string;
  question: string;
  options: string | PollOption[]; // Angepasst für die neuen Optionen
  votes_count: string | { [key: string]: number }; // Kann String oder Objekt sein
}

interface PollOption {
  label: string;
  value: number;
}

interface Poll {
  id: string;
  question: string;
  options: { name: string; votes: number }[]; // Für das Diagramm
  opi: number;
}

export function PollResults() {
  const [pollResults, setPollResults] = useState<Poll[]>([]);
  const [size] = useState({ width: "auto", height: 550 });

  const [searchTerm, setSearchTerm] = useState("");
  const [minOpi, setMinOpi] = useState(0);
  const [maxOpi, setMaxOpi] = useState(100);

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
        // Parsen von options
        let optionsArray: PollOption[] = [];
        if (typeof poll.options === "string") {
          optionsArray = JSON.parse(poll.options);
        } else if (Array.isArray(poll.options)) {
          optionsArray = poll.options;
        }

        // Parsen von votes_count
        let votesCountObj: { [key: string]: number } = {};
        if (typeof poll.votes_count === "string") {
          votesCountObj = JSON.parse(poll.votes_count);
        } else if (poll.votes_count && typeof poll.votes_count === "object") {
          votesCountObj = poll.votes_count;
        }

        // Definiere die extremen Werte dynamisch basierend auf den Optionen
        const extremeValues =
        optionsArray.length >= 2
          ? [optionsArray[0].value, optionsArray[optionsArray.length - 1].value]
          : optionsArray.length === 1
          ? [optionsArray[0].value]
          : [];


        // Berechnung der Gesamtzahl der Stimmen
        const totalVotes = Object.values(votesCountObj).reduce(
          (acc, count) => acc + count,
          0
        );

        // Berechnung der Anzahl der extremen Stimmen
        const extremeVotes = optionsArray.reduce((acc, option) => {
          if (extremeValues.includes(option.value)) {
            return acc + (votesCountObj[option.value] || 0);
          }
          return acc;
        }, 0);

        // Berechnung des OPI
        const opi = totalVotes > 0 ? extremeVotes / totalVotes : 0;

        return {
          id: poll.id,
          question: poll.question,
          options: optionsArray.map((option: PollOption) => ({
            name: option.label,
            votes: votesCountObj[option.value] || 0,
          })),
          opi,
        } as Poll;
      });
      setPollResults(parsedData);
    }
  };

  const filteredPollResults = pollResults.filter((poll) => {
    const opiPercentage = poll.opi * 100;
    const matchesSearch = poll.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesOpi = opiPercentage >= minOpi && opiPercentage <= maxOpi;
    return matchesSearch && matchesOpi;
  });

  return (
// className="backdrop-blur-lg bg-white/70 shadow-lg rounded-md max-w-lg w-full p-4"
    <Card onChange={(open) => open && fetchPollResults()}
    className="backdrop-blur-lg shadow-lg rounded-md p-4 w-full h-auto">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-800">
          View Poll Results
        </CardTitle>
      </CardHeader>
      <ScrollArea className="rounded-md border">
          <CardContent
            className="space-y-4"
            style={{ width: size.width, height: size.height, overflow: "auto" }}
          >
            <div className="grid gap-4">
              <div className="space-y-2">
                {/* <h4 className="font-medium leading-none">Poll Results</h4> */}

                {/* Filter-Eingabefelder */}
                <div className="flex space-x-4 mb-4">
                  <input
                    type="text"
                    placeholder="Search Polls"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Min OPI"
                    value={minOpi}
                    onChange={(e) => setMinOpi(Number(e.target.value))}
                    className="border p-2 rounded"
                    min={0}
                    max={100}
                    step={0.01}
                  />
                  <input
                    type="number"
                    placeholder="Max OPI"
                    value={maxOpi}
                    onChange={(e) => setMaxOpi(Number(e.target.value))}
                    className="border p-2 rounded"
                    min={0}
                    max={100}
                    step={0.01}
                  />
                </div>

                {filteredPollResults.length === 0 ? (
                  <p>No results available yet.</p>
                ) : (
                  filteredPollResults.map((poll) => (
                    <div key={poll.id} className="space-y-4">
                      <h5 className="font-medium">{poll.question}</h5>

                      {/* Anzeige des OPI */}
                      <div className="text-sm text-muted-foreground">
                        Opinion Polarization Index (OPI):{" "}
                        {(poll.opi * 100).toFixed(2)}% - {interpretOPI(poll.opi)}
                      </div>

                      {/* Fortschrittsanzeige mit shadcn Progress */}
                      <Progress value={poll.opi * 100} className="w-full" />

                      {/* Chart Container */}
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={poll.options}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="votes" fill="#40ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
      </ScrollArea>
    </Card>
  );
}
