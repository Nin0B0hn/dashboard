"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Draggable from "react-draggable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {PollCreation} from '@/components/poll-components/poll-create-card';
import { PollResults } from "@/components/poll-components/poll-results-card";
import { PollVoting } from "@/components/poll-components/poll-voting-card";
import { useState } from 'react';

export function Research() {
  const [activeTab, setActiveTab] = useState<string>('Current Polls');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">Research</Button>
      </PopoverTrigger>

      <Draggable>
        <PopoverContent
          className="p-6 poppy backdrop-blur-xl rounded-lg shadow-lg"
          style={{ width: 650, height: 800 }}
        >
          <div>
            {/* Existing Control Settings content goes here */}
            <h2 className="text-lg font-semibold text-gray-800">Control Settings</h2>

            <div className="flex space-x-4 mt-4">
            <Tabs defaultValue="Create Poll" onValueChange={setActiveTab} className="w-auto">
            <TabsList>
                <TabsTrigger value="Create Poll">Create Poll</TabsTrigger>
                <TabsTrigger value="Current Polls">Current Polls</TabsTrigger>
                <TabsTrigger value="Poll Results">Poll Results</TabsTrigger>
            </TabsList>
            <TabsContent value="Create Poll"><PollCreation /></TabsContent>
            <TabsContent value="Current Polls"><PollVoting isActive={activeTab === 'Current Polls'} /></TabsContent>
            <TabsContent value="Poll Results"><PollResults /></TabsContent>
            </Tabs>
            </div>
          </div>
        </PopoverContent>
      </Draggable>
    </Popover>
  );
}
