'use client'

import React from 'react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare } from "lucide-react"
import User from "@/components/poll-components/user";


export default function UserTab() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [comment, setComment] = useState("")
  
    return (  
      <Tabs defaultValue="user">
        {/* <TabsList className="grid w-full grid-cols-2">
          {/* <TabsTrigger value="new-comment" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            User
          </TabsTrigger> */}
        {/* </TabsList>  */}
        <TabsContent value="user" className="space-y-4 mt-4">
        <User />
        </TabsContent>
      </Tabs>
    )
  }

  