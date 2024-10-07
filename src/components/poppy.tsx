"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import ColorPicker from "@/components/ColorPicker";
import Draggable from "react-draggable";

export function Poppy() {
    const [size] = useState({ width: 320, height: 400 });

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <Draggable>
                    <PopoverContent 
                        className="poppy backdrop-blur-xl bg-opacity-50 text-black p-4 rounded-md"
                        style={{ width: size.width, height: size.height, overflow: 'auto' }}
                    >
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Dimensions</h4>
                                <p className="text-sm text-muted-foreground">
                                    Set the dimensions for the object.
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="width">Width</Label>
                                    <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="maxWidth">Max. width</Label>
                                    <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="height">Height</Label>
                                    <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="maxHeight">Max. height</Label>
                                    <Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
                                </div>
                                <ColorPicker />
                            </div>
                        </div>
                    </PopoverContent>
            </Draggable>
        </Popover>
    );
}