// comment-tab.tsx
'use client'

import { useState, useEffect } from "react"
import { MessageSquare, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'
import { useToast } from "@/hooks/use-toast"
import { CommentSection } from '@/components/comment'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'


export default function CommentTab() {
  const [comment, setComment] = useState("")
  const [userName, setUserName] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (userName.trim()) {
      localStorage.setItem('userName', userName)
      setIsLoggedIn(true)
      toast({
        title: "Erfolgreich eingeloggt",
        description: `Angemeldet als ${userName}`,
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userName')
    setIsLoggedIn(false)
    setUserName('')
    toast({
      title: "Erfolgreich ausgeloggt",
      description: "Logout erfolgreich",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoggedIn) {
      toast({
        title: "Fehler",
        description: "Sie müssen eingeloggt sein, um einen Kommentar zu posten.",
        variant: "destructive",
      })
      return
    }

    let fileUrl = null
    if (selectedFile) {
      const { data, error: uploadError } = await supabase
        .storage
        .from('comment-attachments')
        .upload(`public/${Date.now()}-${selectedFile.name}`, selectedFile)

      if (uploadError) {
        console.error('Fehler beim Hochladen der Datei:', uploadError)
        toast({
          title: "Fehler",
          description: "Datei-Upload fehlgeschlagen. Bitte versuchen Sie es erneut.",
          variant: "destructive",
        })
        return
      }
      fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/comment-attachments/${data?.path}`
    }

    const { error } = await supabase
    .from('comments')
    .insert({ content: comment, user_name: userName, file_url: fileUrl, parent_id: null })
    .select()

    if (error) {
      console.error('Fehler beim Einfügen des Kommentars:', error)
      toast({
        title: "Fehler",
        description: "Kommentar konnte nicht gepostet werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      })
    } else {
      setComment("")
      setSelectedFile(null)
      toast({
        title: "Erfolg",
        description: "Kommentar erfolgreich gepostet!",
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName')
    if (storedUserName) {
      setUserName(storedUserName)
      setIsLoggedIn(true)
    }
  }, [])

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
            {!isLoggedIn ? (
              <form onSubmit={handleLogin} className="mb-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Bitte geben Sie einen einzigartigen Namen ein:</Label>
                  <Input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Ihr einzigartiger Name"
                    required
                  />
                </div>
                <Button type="submit" className="mt-2">Login</Button>
              </form>
            ) : (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <p>Angemeldet als: {userName}</p>
                  <Button onClick={handleLogout} variant="outline">Logout</Button>
                </div>
                <form onSubmit={handleSubmit}>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Schreiben Sie einen Kommentar..."
                    className="min-h-[100px]"
                  />
                  <div className="space-y-4 mt-4">
                    <Button variant="outline" className="w-full justify-start">
                      + Add Location
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      You can add location you want participants to join in announcement.
                    </p>
                    <Input type="file" className="w-full justify-start" onChange={handleFileChange} />
                    <p className="text-sm text-muted-foreground">
                      You can add files that other users can access in addition to your comment.
                    </p>
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
                      <Button type="submit">Post</Button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="comment-history" className="mt-4">
          <div className="space-y-4">
            <CommentSection /> {/* Anzeige des Kommentarverlaufs */}
          </div>
        </TabsContent>
      </Tabs>
    </ScrollArea>
  )
}
