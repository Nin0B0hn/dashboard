'use client'

import { useState, useEffect, useCallback } from 'react'
// import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from "@/hooks/use-toast"

interface Comment {
  id: string
  content: string
  created_at: string
  user_name: string
  parent_id: string | null
}

export function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [userName, setUserName] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .is('parent_id', null)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      toast({
        title: "Error",
        description: "Failed to fetch comments. Please try again.",
        variant: "destructive",
      })
    } else {
      setComments(data || [])
    }
  }, [toast])

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName')
    if (storedUserName) {
      setUserName(storedUserName)
      setIsLoggedIn(true)
    }
    fetchComments()
  }, [fetchComments])

  async function handleSubmit(e: React.FormEvent, parentId: string | null = null) {
    e.preventDefault()
    if (!isLoggedIn) {
      toast({
        title: "Error",
        description: "You must be logged in to comment.",
        variant: "destructive",
      })
      return
    }
    const { error } = await supabase
      .from('comments')
      .insert({ content: newComment, user_name: userName, parent_id: parentId })
      .select()

    if (error) {
      console.error('Error inserting comment:', error)
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      })
    } else {
      setNewComment('')
      fetchComments()
      toast({
        title: "Success",
        description: "Comment posted successfully!",
      })
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (userName.trim()) {
      localStorage.setItem('userName', userName)
      setIsLoggedIn(true)
      toast({
        title: "Success",
        description: `Logged in as ${userName}`,
      })
    }
  }

  function handleLogout() {
    localStorage.removeItem('userName')
    setIsLoggedIn(false)
    setUserName('')
    toast({
      title: "Success",
      description: "Logged out successfully",
    })
  }

  function CommentItem({ comment }: { comment: Comment }) {
    const [replies, setReplies] = useState<Comment[]>([])
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyContent, setReplyContent] = useState('')

    const fetchReplies = useCallback(async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('parent_id', comment.id)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching replies:', error)
      } else {
        setReplies(data || [])
      }
    }, [comment.id])

    useEffect(() => {
      fetchReplies()
    }, [fetchReplies])

    async function handleReply(e: React.FormEvent) {
      e.preventDefault()
      if (!isLoggedIn) {
        toast({
          title: "Error",
          description: "You must be logged in to reply.",
          variant: "destructive",
        })
        return
      }
      const { error } = await supabase
        .from('comments')
        .insert({ content: replyContent, user_name: userName, parent_id: comment.id })
        .select()

      if (error) {
        console.error('Error inserting reply:', error)
        toast({
          title: "Error",
          description: "Failed to post reply. Please try again.",
          variant: "destructive",
        })
      } else {
        setReplyContent('')
        setShowReplyForm(false)
        fetchReplies()
        toast({
          title: "Success",
          description: "Reply posted successfully!",
        })
      }
    }

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
            {isLoggedIn && (
              <Button
                variant="link"
                className="mt-2 text-sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                Reply
              </Button>
            )}
          </div>
        </div>
        {showReplyForm && (
          <form onSubmit={handleReply} className="mt-4 ml-12">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="mb-2"
            />
            <Button type="submit">Post Reply</Button>
          </form>
        )}
        {replies.map((reply) => (
          <div key={reply.id} className="ml-12 mt-4">
            <CommentItem comment={reply} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {!isLoggedIn ? (
        <form onSubmit={handleLogin} className="mb-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Enter a unique name to start commenting:</Label>
            <Input
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your unique name"
              required
            />
          </div>
          <Button type="submit" className="mt-2">Login</Button>
        </form>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <p>Logged in as: {userName}</p>
            <Button onClick={handleLogout} variant="outline">Logout</Button>
          </div>
          <form onSubmit={handleSubmit} className="mb-8">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="mb-2"
            />
            <Button type="submit">Post Comment</Button>
          </form>
        </>
      )}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}