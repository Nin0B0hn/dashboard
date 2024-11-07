"use client";

import { FC } from 'react';
import { cn } from '@/lib/utils'; // assuming you have a `cn` utility for conditional class names
import {
  PersonStanding,
  Smile,
  VolumeX,
  Volume2,
  Star,
} from "lucide-react"

const Icons = {
  run: PersonStanding,
  laugh: Smile,
  mute: VolumeX,
  sound: Volume2,
  star: Star,
};

type FloatingActionBarProps = {
  onRun?: () => void;
  onLaugh?: () => void;
  onMute?: () => void;
  onSound?: () => void;
  onStar?: () => void;
};

const FloatingActionBar: FC<FloatingActionBarProps> = ({ onRun, onLaugh, onMute, onSound, onStar }) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 p-2 bg-gray-800 rounded-full shadow-lg">
      <button 
        onClick={onRun} 
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
        aria-label="Run"
      >
        <Icons.run className="w-6 h-6" />
      </button>

      <button 
        onClick={onLaugh} 
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
        aria-label="Laugh"
      >
        <Icons.laugh className="w-6 h-6" />
      </button>

      <button 
        onClick={onMute} 
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
        aria-label="Mute"
      >
        <Icons.mute className="w-6 h-6" />
      </button>

      <button 
        onClick={onSound} 
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
        aria-label="Sound"
      >
        <Icons.sound className="w-6 h-6" />
      </button>

      <button 
        onClick={onStar} 
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
        aria-label="Star"
      >
        <Icons.star className="w-6 h-6" />
      </button>
    </div>
  );
};

export default FloatingActionBar;