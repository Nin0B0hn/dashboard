"use client";

import React from 'react';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    MicOff,
    Mic,
    Volume,
    VolumeOff,
    ScreenShare,
    ScreenShareOff
  } from "lucide-react"


interface Participant {
  id: number;
  name: string;
  isMuted: boolean;
  isSpeaker: boolean;
  canShareScreen: boolean;
  role: string;
}

const participants: Participant[] = [
  { id: 1, name: 'John Doe', isMuted: true, isSpeaker: false, canShareScreen: true, role: 'Moderator' },
  { id: 2, name: 'Mairain Day', isMuted: false, isSpeaker: false, canShareScreen: false, role: 'Admin' },
  // Add more sample participants here
];

const User: React.FC = () => {
  const [filter, setFilter] = useState('');

  const filteredParticipants = participants.filter((participant) =>
    participant.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <ScrollArea className="h-[450px]">
    <div className="p-4 rounded-md shadow-md">
      <div className="flex items-center justify-between mb-4">
        <Input
          type="text"
          placeholder="Search by Name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-1/3"
        />
        <Button variant="secondary" className="ml-4">Mute All</Button>
      </div>
      <div>
        <ul className="w-full">
          {filteredParticipants.map((participant) => (
            <li key={participant.id} className="flex items-center justify-between border-b py-2">
              <span>{participant.name}</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="p-2"><MicOff className="h-4 w-8"/></Button>
                <Button variant="ghost" className="p-2"><VolumeOff className="h-4 w-8"/></Button>
                <Button variant="ghost" className="p-2"><ScreenShareOff className="h-4 w-8"/></Button>
                <DropdownMenu >
                  <DropdownMenuTrigger>
                    <Button variant="ghost">{participant.role}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className= 'backdrop-blur-lg '>
                    <DropdownMenuItem>Moderator</DropdownMenuItem>
                    <DropdownMenuItem>Admin</DropdownMenuItem>
                    <DropdownMenuItem>Editor</DropdownMenuItem>
                    <DropdownMenuItem>Guest</DropdownMenuItem>
                    <DropdownMenuItem>User</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu >
                  <DropdownMenuTrigger>
                    <Button variant="ghost">{participant.role}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className= 'backdrop-blur-lg '>
                    <DropdownMenuItem>Kick</DropdownMenuItem>
                    <DropdownMenuItem>Ban</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </ScrollArea>
  );
};

export default User;
