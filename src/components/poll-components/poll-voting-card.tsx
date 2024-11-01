"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

// Schema für die Form-Validierung mit zod
const FormSchema = z.object({
  poll: z.string().nonempty("You need to select a poll."),
  option: z.string().nonempty("You need to select an option."),
});

// Typen für Poll-Daten
interface PollOption {
  label: string;
  value: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
}

// Typ für Vote-Daten
interface Vote {
  poll_id: string;
  option_selected: number;
}

type PollVotingProps = {
  isActive: boolean;
};

export function PollVoting({ isActive }: PollVotingProps) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const { toast } = useToast();
  const [size] = useState({ width: "auto", height: 550 });

  // Zustand für den Suchbegriff
  const [searchTerm, setSearchTerm] = useState("");

  // react-hook-form Setup mit zod Resolver
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // Verwende den watch-Hook, um den Wert von "poll" zu beobachten
  const {
    watch,
    control,
    handleSubmit,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors },
    setValue,
  } = form;

  const selectedPollId = watch("poll"); // Beobachte das "poll"-Feld

  // Polls abrufen
  const fetchPolls = useCallback(async () => {
    const { data, error } = await supabase
      .from("polls")
      .select("id, question, options");

    if (error) {
      console.error("Error fetching polls:", error);
      toast({
        title: "Error",
        description: "There was an error loading the polls.",
        variant: "destructive",
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsedData = data?.map((poll: any) => ({
        id: poll.id,
        question: poll.question,
        options:
          typeof poll.options === "string"
            ? JSON.parse(poll.options)
            : poll.options,
      }));
      setPolls(parsedData || []);
    }
  }, [toast]);

  // useEffect verwenden, um fetchPolls aufzurufen, wenn isActive true wird
  useEffect(() => {
    if (isActive) {
      fetchPolls();
    }
  }, [isActive, fetchPolls]);

  // Abstimmungslogik
  const handleVoteSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const { poll, option } = data;
      const optionValue = parseInt(option, 10);

      const { error } = await supabase
        .from("votes")
        .insert([{ poll_id: poll, option_selected: optionValue } as Vote]);

      if (error) {
        console.error("Error submitting vote:", error);
        toast({
          title: "Error",
          description: "There was an error submitting your vote.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Your vote has been submitted successfully!",
        });
        // Formular zurücksetzen
        form.reset();
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // Umfragen basierend auf dem Suchbegriff filtern
  const filteredPolls = polls.filter((poll) =>
    poll.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Finde die aktuell ausgewählte Umfrage
  const selectedPoll = filteredPolls.find((poll) => poll.id === selectedPollId);

  return (
    <Card className="backdrop-blur-lg shadow-lg rounded-md p-4 w-full h-auto ">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-800">
          Current Polls
        </CardTitle>
      </CardHeader>
      <ScrollArea className="rounded-md border">
        <CardContent
          className="space-y-4"
          style={{ width: size.width, height: size.height, overflow: "auto" }}
        >
          <div className="grid gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Choose a poll and an option to vote
              </p>

              {/* Suchfeld */}
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="search polls..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Form starten */}
            <Form {...form}>
              <form
                onSubmit={handleSubmit(handleVoteSubmit)}
                className="space-y-6"
              >
                {/* Poll auswählen */}
                <FormField
                  control={control}
                  name="poll"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Choose a poll</FormLabel>
                      <FormControl>
                        {filteredPolls.length > 0 ? (
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              setValue("option", ""); // Option zurücksetzen
                            }}
                            value={field.value}
                            className="flex flex-col space-y-1"
                          >
                            {filteredPolls.map((poll) => (
                              <FormItem
                                key={poll.id}
                                className="flex items-center space-x-3"
                              >
                                <FormControl>
                                  <RadioGroupItem value={poll.id} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {poll.question}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No poll found.
                          </p>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Option auswählen */}
                {selectedPoll && (
                  <FormField
                    control={control}
                    name="option"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Choose an option</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-1"
                          >
                            {/* Optionen der aktuell ausgewählten Umfrage anzeigen */}
                            {selectedPoll.options.map(
                              (option: PollOption, idx: number) => (
                                <FormItem
                                  key={idx}
                                  className="flex items-center space-x-3"
                                >
                                  <FormControl>
                                    <RadioGroupItem
                                      value={option.value.toString()}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            )}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Submit Button */}
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
