"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Draggable from "react-draggable";
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

export function PollVoting() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const { toast } = useToast();
  const [size] = useState({ width: 320, height: 400 });
  const [isInputFocused] = useState(false); // Für Draggable Popout

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
    <Popover onOpenChange={(open) => open && fetchPolls()}>
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
              <h4 className="font-medium leading-none">Recent polls</h4>
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
        </PopoverContent>
      </Draggable>
    </Popover>
  );
}
