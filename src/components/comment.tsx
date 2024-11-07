'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from "@/hooks/use-toast"

interface Comment {
  id: string
  content: string
  created_at: string
  user_name: string
  parent_id: string | null
  file_url?: string
  replies?: Comment[] // Neue Eigenschaft für Antworten
}

const MAX_DEPTH = 5 // Maximale Tiefe der Verschachtelung

export function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([])
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      toast({
        title: "Error",
        description: "Failed to fetch comments. Please try again.",
        variant: "destructive",
      })
    } else {
      // Kommentare der obersten Ebene (ohne parent_id) filtern
      const topLevelComments = data.filter((comment: Comment) => comment.parent_id === null)

      // Antworten den jeweiligen Kommentaren zuordnen
      const commentsWithReplies = topLevelComments.map((comment: Comment) => {
        const replies = data.filter((reply: Comment) => reply.parent_id === comment.id)
        return { ...comment, replies }
      })

      setComments(commentsWithReplies)
    }
  }, [toast])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  // Antwort senden mit dem Namen des eingeloggten Nutzers
  async function handleReplySubmit(content: string, parentId: string) {
    const userName = localStorage.getItem('userName') || 'Anonymous'

    const { error } = await supabase
      .from('comments')
      .insert({
        content,
        user_name: userName,
        parent_id: parentId
      })
      .select()

    if (error) {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      })
    } else {
      fetchComments() // Kommentare nach dem Hinzufügen einer Antwort neu laden
      toast({
        title: "Success",
        description: "Reply posted successfully!",
      })
    }
  }

  function CommentItem({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyContent, setReplyContent] = useState("")

    return (
      <div className="mb-4">
        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarFallback>{comment.user_name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{comment.user_name}</p>
            <p className="text-sm text-gray-500">{new Date(comment.created_at).toLocaleString()}</p>
            <p className="mt-1">{comment.content}</p>
            {comment.file_url && (
              <a 
                href={comment.file_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 underline mt-2 block"
              >
                Datei herunterladen
              </a>
            )}
            {/* Reply-Schaltfläche nur anzeigen, wenn die maximale Tiefe nicht erreicht ist */}
            {depth < MAX_DEPTH && (
              <Button
                variant="link"
                className="mt-2 text-sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                Reply
              </Button>
            )}
            {showReplyForm && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleReplySubmit(replyContent, comment.id)
                  setReplyContent("") // Nach dem Senden das Antwortfeld leeren
                  setShowReplyForm(false) // Formular nach dem Senden schließen
                }}
                className="mt-4"
              >
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="mb-2"
                />
                <Button type="submit">Post Reply</Button>
              </form>
            )}
            {/* Antworten anzeigen */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 ml-8 space-y-4">
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}
