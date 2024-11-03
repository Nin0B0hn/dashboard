'use client'

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Draggable from "react-draggable";
import CommentTab from "./tabs/comment-tab"
import ResearchTab from "./tabs/research-tab"
import { 
  MessagesSquare, 
  Microscope,
  MonitorCog,
  Megaphone,
  Tv, 
} from "lucide-react"

export function ControlSettings() {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="p-2"><Microscope className="h-4 w-8"/>Control Settings</Button>
      </PopoverTrigger>
      <Draggable>
        <PopoverContent className="p-6 backdrop-blur-xl rounded-lg shadow-lg offset"
          style={{ width: 650, height: 725 }}
          align="center"
          side="right"
          sideOffset={100}>
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Control Settings</CardTitle>
        <Button variant="ghost" size="icon">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="user"><MonitorCog className="h-4 w-8" />User</TabsTrigger>
            <TabsTrigger value="moderator"><Megaphone className="h-4 w-8" />Moderator</TabsTrigger>
            <TabsTrigger value="stage"><Tv className="h-4 w-8" />Stage</TabsTrigger>
            <TabsTrigger value="research"><Microscope className="h-4 w-8" />Research</TabsTrigger>
            <TabsTrigger value="comment"><MessagesSquare className="h-4 w-8" />Comment</TabsTrigger>
          </TabsList>
          <TabsContent value="user">
            {/* <UserTab /> */}
          </TabsContent>
          <TabsContent value="research">
            <ResearchTab />
          </TabsContent>
          <TabsContent value="stage">
            {/* <StageTab /> */}
          </TabsContent>
          <TabsContent value="production">
            {/* <ProductionTab /> */}
          </TabsContent>
          <TabsContent value="comment">
            <CommentTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    </PopoverContent>
      </Draggable>
    </Popover>
  )
}

