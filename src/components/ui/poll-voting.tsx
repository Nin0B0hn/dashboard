"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Draggable from "react-draggable";
import { useToast } from "@/hooks/use-toast"; // Korrigierter Toast-Import
import { supabase } from "@/lib/supabaseClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Schema für die Form-Validierung mit zod
const FormSchema = z.object({
  poll: z.string().nonempty("You need to select a poll."),
  option: z.string().nonempty("You need to select an option."),
});

// Typ für Poll-Daten
interface Poll {
  id: string;
  question: string;
  options: string[]; // Optionen als Array
}

// Typ für Vote-Daten
interface Vote {
  poll_id: string;
  option_selected: string;
}

export function PollVoting() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const { toast } = useToast(); // Korrigierter Toast-Aufruf
  const [size] = useState({ width: 320, height: 400 });
  const [isInputFocused] = useState(false); // Für Draggable Popout

  // react-hook-form Setup mit zod Resolver
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // Polls beim Laden der Komponente abrufen
  const fetchPolls = useCallback(async () => {
    const { data, error } = await supabase.from("polls").select("id, question, options");

    if (error) {
      console.error("Error fetching polls:", error);
      toast({
        title: "Error",
        description: "There was an error loading the polls.",
        variant: "destructive",
      });
    } else {
      setPolls(data || []);
    }
  }, [toast]); // 'toast' als Abhängigkeit hinzugefügt

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]); // 'fetchPolls' als Abhängigkeit hinzugefügt

  // Abstimmungslogik
  const handleVoteSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const { poll, option } = data;
      const { error } = await supabase
        .from("votes")
        .insert([{ poll_id: poll, option_selected: option } as Vote]);

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
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Vote in Polls</Button>
      </PopoverTrigger>

      <Draggable disabled={isInputFocused}>
        <PopoverContent
          className="poppy backdrop-blur-xl bg-opacity-50 text-black p-4 rounded-md"
          style={{ width: size.width, height: size.height, overflow: "auto" }}
        >
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Current Polls</h4>
              <p className="text-sm text-muted-foreground">
                Select a poll and an option to vote
              </p>
            </div>

            {/* Form starten */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleVoteSubmit)} className="space-y-6">
                {/* Poll auswählen */}
                <FormField
                  control={form.control}
                  name="poll"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Choose a poll</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {/* Polls Liste anzeigen */}
                          {polls.map((poll) => (
                            <FormItem key={poll.id} className="space-y-3">
                              <FormControl>
                                <RadioGroupItem value={poll.id} />
                              </FormControl>
                              <FormLabel className="font-normal">{poll.question}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Option auswählen */}
                <FormField
                  control={form.control}
                  name="option"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Select an option</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {/* Optionen der aktuellen Poll anzeigen */}
                          {polls
                            .filter((poll) => poll.id === form.getValues("poll"))
                            .map((poll) =>
                              JSON.parse(poll.options).map((option: string, idx: number) => (
                                <FormItem key={idx} className="space-y-3">
                                  <FormControl>
                                    <RadioGroupItem value={option} />
                                  </FormControl>
                                  <FormLabel className="font-normal">{option}</FormLabel>
                                </FormItem>
                              ))
                            )}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button type="submit" className="w-full">
                  Submit Vote
                </Button>
              </form>
            </Form>
          </div>
        </PopoverContent>
      </Draggable>
    </Popover>
  );
}
