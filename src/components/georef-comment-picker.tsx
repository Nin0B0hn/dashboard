'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, Popup  } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox' 
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { supabase } from "@/lib/supabaseClient";


interface Comment {
  id: string
  content: string
  created_at: string
  user_name: string
  lat: number
  lng: number
}

const GeorefPicker = ({ onPositionChange }: { onPositionChange: (lat: number, lng: number) => void }) => {
    useMapEvents({
      click(e) {
        onPositionChange(e.latlng.lat, e.latlng.lng)
      },
    })
    return null
  }
  
  export default function GeorefCommentPicker() {
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [selectedPosition, setSelectedPosition] = useState<LatLngExpression | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [useLocation, setUseLocation] = useState(true)
    const mapCenter: LatLngExpression = [51.1657, 10.4515] // Center of Germany
    const { toast } = useToast()
  
    useEffect(() => {
      fetchComments()
    }, [])
  
    const fetchComments = async () => {
      const { data, error } = await supabase.from('comments').select('*')
      if (error) {
        console.error("Error loading comments:", error.message)
        toast({
          title: "Error",
          description: "Failed to load comments. Please try again later.",
          variant: "destructive",
        })
      } else {
        setComments(data as Comment[] || [])
      }
    }
  
    const handleAddComment = async () => {
      if (!newComment) {
        toast({
          title: "Error",
          description: "Please enter a comment before submitting.",
          variant: "destructive",
        })
        return
      }
  
      let newCommentData: Omit<Comment, 'id' | 'created_at'> = {
        content: newComment,
        user_name: 'Anonymous', // Replace with actual user data when available
      }
  
      if (useLocation && selectedPosition) {
        const [lat, lng] = selectedPosition as [number, number]
        if (typeof lat === 'number' && typeof lng === 'number') {
          newCommentData = { ...newCommentData, lat, lng }
        } else {
          toast({
            title: "Error",
            description: "Invalid coordinates selected. Please try again.",
            variant: "destructive",
          })
          return
        }
      }
  
      const { data, error } = await supabase.from('comments').insert(newCommentData)
  
      if (error) {
        console.error("Error adding comment:", error.message)
        toast({
          title: "Error",
          description: "Failed to add comment. Please try again.",
          variant: "destructive",
        })
      } else {
        const newComment: Comment = {
          ...newCommentData,
          id: Date.now().toString(), // Temporary ID
          created_at: new Date().toISOString(),
        }
        setComments(prevComments => [...prevComments, newComment])
        setNewComment('')
        setSelectedPosition(null)
        setIsDialogOpen(false)
        toast({
          title: "Success",
          description: "Comment added successfully!",
        })
  
        fetchComments()
      }
    }
  
    return (
      <div className="p-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Comment</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add a New Comment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-location"
                  checked={useLocation}
                  onCheckedChange={(checked) => setUseLocation(checked as boolean)}
                />
                <Label htmlFor="use-location">Add location to comment</Label>
              </div>
              {useLocation && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lat" className="text-right">
                      Latitude
                    </Label>
                    <Input
                      id="lat"
                      value={selectedPosition ? (selectedPosition as [number, number])[0]?.toFixed(6) ?? '' : ''}
                      className="col-span-3"
                      readOnly
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lng" className="text-right">
                      Longitude
                    </Label>
                    <Input
                      id="lng"
                      value={selectedPosition ? (selectedPosition as [number, number])[1]?.toFixed(6) ?? '' : ''}
                      className="col-span-3"
                      readOnly
                    />
                  </div>
                </>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="comment" className="text-right">
                  Comment
                </Label>
                <Textarea
                  id="comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            {useLocation && (
              <div className="h-[200px] w-full mb-4">
                <MapContainer center={mapCenter} zoom={4} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <GeorefPicker onPositionChange={(lat, lng) => setSelectedPosition([lat, lng])} />
                  {selectedPosition && <Marker position={selectedPosition} />}
                  {comments.map((comment, index) => (
                    comment.lat && comment.lng ? (
                      <Marker key={index} position={[comment.lat, comment.lng]}>
                        <Popup>{comment.content}</Popup>
                      </Marker>
                    ) : null
                  ))}
                </MapContainer>
              </div>
            )}
            <Button onClick={handleAddComment} disabled={useLocation && !selectedPosition}>
              Add Comment
            </Button>
          </DialogContent>
        </Dialog>
  
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Existing Comments</h2>
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-100 p-2 mb-2 rounded">
              <p>{comment.content}</p>
              {comment.lat && comment.lng ? (
                <p className="text-sm text-gray-500">
                  Lat: {comment.lat.toFixed(6)}, Lng: {comment.lng.toFixed(6)}
                </p>
              ) : (
                <p className="text-sm text-gray-500">No location data</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }