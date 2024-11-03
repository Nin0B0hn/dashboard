'use client'

import { useState } from "react"
import { MessageSquare, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea} from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { CommentSection } from '@/components/comment'

export default function CommentTab() {
  const [comment, setComment] = useState("")

  return (
    <ScrollArea className="h-[500px]">
    <Tabs defaultValue="new-comment">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="new-comment" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Comment
        </TabsTrigger>
        <TabsTrigger value="comment-history" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Comment History
        </TabsTrigger>
      </TabsList>
      <TabsContent value="new-comment" className="space-y-4 mt-4">
        <div className="grid gap-4">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">
                        Post a comment to all the participants for the selected location.
                      </h3>
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Place" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="place1">Place 1</SelectItem>
                          <SelectItem value="place2">Place 2</SelectItem>
                          <SelectItem value="place3">Place 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea
                      placeholder="Type your comment here"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        + Add Location
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        You can add location you want participant to join in announcement.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Input type="file" className="w-full justify-start">

                      </Input>
                      <p className="text-sm text-muted-foreground">
                        You can add files that other users can access in addition to your comment
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Select defaultValue="scenario-a">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Join to" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scenario-a">Szenario A</SelectItem>
                        <SelectItem value="scenario-b">Szenario B</SelectItem>
                        <SelectItem value="scenario-c">Szenario C</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="space-x-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Post</Button>
                    </div>
                  </div>
        </div>
      </TabsContent>
      <TabsContent value="comment-history" className="mt-4">
        <div className="space-y-4">
        <CommentSection />
                  {/* <h3 className="text-sm font-medium">Previous Comments</h3>
                  <div className="space-y-2">
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm">Hier wurden Fledermäuse gesichtet</p>
                      <p className="text-xs text-muted-foreground mt-1">Posted on: 2023-06-15</p>
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm">Another example comment</p>
                      <p className="text-xs text-muted-foreground mt-1">Posted on: 2023-06-14</p>
                    </div>
                  </div> */}
        </div>
      </TabsContent>
    </Tabs>
    </ScrollArea>
  )
}

