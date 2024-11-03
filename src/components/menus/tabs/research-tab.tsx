"use client";

// import { Button } from "@/components/ui/button";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import Draggable from "react-draggable";
import { 
    ChartColumn,
    FilePlus,
    Vote, 
} from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {PollCreation} from '@/components/poll-components/poll-create-card';
import { PollResults } from "@/components/poll-components/poll-results-card";
import { PollVoting } from "@/components/poll-components/poll-voting-card";
import { useState } from 'react';

export default function ResearchTab() {
    const [activeTab, setActiveTab] = useState<string>("poll-current")
  
    return (
      <Tabs defaultValue="poll-create" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="poll-create" className="flex items-center gap-2">
            <FilePlus className="h-4 w-4" />
            Create Poll
          </TabsTrigger>
          <TabsTrigger value="poll-current" className="flex items-center gap-2">
            <Vote className="h-4 w-4" />
            Current Polls
          </TabsTrigger>
          <TabsTrigger value="poll-results" className="flex items-center gap-2">
            <ChartColumn className="h-4 w-4" />
            View Results
          </TabsTrigger>
        </TabsList>
        <TabsContent value="poll-create" className="space-y-4 mt-4">
        <PollCreation />
        </TabsContent>
        <TabsContent value="poll-current" className="mt-4">
        <PollVoting isActive={activeTab === 'poll-current'} />
        </TabsContent>
        <TabsContent value="poll-results" className="mt-4">
        <PollResults />
        </TabsContent>
      </Tabs>
    )
  }