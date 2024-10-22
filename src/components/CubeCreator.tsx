"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Draggable from "react-draggable";

// Interface für UnityInstance
interface UnityInstance {
  SendMessage: (gameObjectName: string, methodName: string, value?: string) => void;
  // Weitere Methoden und Eigenschaften können hier hinzugefügt werden
}

declare global {
  interface Window {
    UnityInstance: UnityInstance | undefined;
  }
}

export function CubeCreator() {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [size, setSize] = useState(1);  // Größe des Würfels
  const [popoverSize] = useState({ width: 320, height: 400 });
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleCreateCube = () => {
    // Sende eine Nachricht an Unity, um den Würfel zu erstellen
    if (window.UnityInstance) {
      const positionString = `${position.x},${position.y},${position.z}`;
      const cubeData = `${positionString},${size}`; // Position und Größe
      window.UnityInstance.SendMessage("CubeManager", "CreateCube", cubeData);
    } else {
      console.error("UnityInstance is not defined");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Create Cube</Button>
      </PopoverTrigger>

      {/* Draggable wird nur aktiviert, wenn kein Input-Feld fokussiert ist */}
      <Draggable disabled={isInputFocused}>
        <PopoverContent
          className="poppy backdrop-blur-xl bg-opacity-50 text-black p-4 rounded-md"
          style={{ width: popoverSize.width, height: popoverSize.height, overflow: "auto" }}
        >
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Create a Cube</h4>
              <p className="text-sm text-muted-foreground">
                Set the cube position and size, then click to create it in Unity.
              </p>
            </div>

            {/* Eingabeformular für die Position */}
            <div>
              <label>X:</label>
              <input
                type="number"
                value={position.x}
                onChange={(e) => setPosition({ ...position, x: parseFloat(e.target.value) })}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />
            </div>
            <div>
              <label>Y:</label>
              <input
                type="number"
                value={position.y}
                onChange={(e) => setPosition({ ...position, y: parseFloat(e.target.value) })}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />
            </div>
            <div>
              <label>Z:</label>
              <input
                type="number"
                value={position.z}
                onChange={(e) => setPosition({ ...position, z: parseFloat(e.target.value) })}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />
            </div>

            {/* Eingabeformular für die Größe */}
            <div>
              <label>Size:</label>
              <input
                type="number"
                value={size}
                onChange={(e) => setSize(parseFloat(e.target.value))}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />
            </div>

            {/* Button zum Erstellen des Würfels */}
            <Button onClick={handleCreateCube} className="w-full">
              Create Cube
            </Button>
          </div>
        </PopoverContent>
      </Draggable>
    </Popover>
  );
}
