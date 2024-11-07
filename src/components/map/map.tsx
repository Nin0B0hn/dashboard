'use client'
import { useToast } from "@/hooks/use-toast"; // Toast importieren
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'


L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
})

interface Comment {
  id: string
  content: string
  created_at: string
  user_name: string
  lat: number
  lng: number
}

const MapEvents = ({ onContextMenu }: { onContextMenu: (e: L.LeafletMouseEvent) => void }) => {
  useMapEvents({
    contextmenu: (e) => {
      e.originalEvent.preventDefault();
      onContextMenu(e);
    },
  });
  return null;
};

export default function Map() {
  const [comments, setComments] = useState<Comment[]>([])
  const [clickedLatLng, setClickedLatLng] = useState<LatLngExpression | null>(null)
  const [newComment, setNewComment] = useState('')
  // const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [markers, setMarkers] = useState<LatLngExpression[]>([])
  const mapCenter: LatLngExpression = [51.1657, 10.4515]
  const { toast } = useToast()

  useEffect(() => {
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
        setMarkers((data as Comment[] || []).map(comment => [comment.lat, comment.lng]))
      }
    }
    fetchComments()
  }, [toast])

  const handleContextMenu = useCallback((e: L.LeafletMouseEvent) => {
    setClickedLatLng([e.latlng.lat, e.latlng.lng]);
    setContextMenuPosition({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
  }, []);

  const handleAddComment = async () => {
    if (clickedLatLng && newComment) {
      const [lat, lng] = clickedLatLng as [number, number]
      const { data, error } = await supabase.from('comments').insert({
        content: newComment,
        lat,
        lng,
        user_name: 'Anonymous', // Replace with actual user data when available
      })

      if (error) {
        console.error("Error adding comment:", error.message)
        toast({
          title: "Error",
          description: "Failed to add comment. Please try again.",
          variant: "destructive",
        })
      } else {
        setComments([...comments, data[0] as Comment])
        setNewComment('')
        toast({
          title: "Success",
          description: "Comment added successfully!",
        })
      }
    }
  }

  return (
    <div className="relative h-screen w-full">
      <MapContainer center={mapCenter} zoom={6} className="h-full w-full"
            style={{
              zIndex: 1,
            }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents onContextMenu={handleContextMenu} />
        {comments.map((comment) => (
          <Marker key={comment.id} position={[comment.lat, comment.lng]}>
            <Popup>{comment.content}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}