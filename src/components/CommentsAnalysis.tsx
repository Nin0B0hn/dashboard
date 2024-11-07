// components/CommentsAnalysis.tsx
import React, { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area' // Importiere die ScrollArea-Komponente

const CommentsAnalysis = () => {
  const [thematicAnalysis, setThematicAnalysis] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchAndAnalyzeComments = async () => {
      setLoading(true)
      try {
        // Kommentare abrufen und zur Analyse senden
        const commentsResponse = await fetch('/api/getComments')
        const commentsData = await commentsResponse.json()
        const analysisResponse = await fetch('/api/analyzeCommentsBatch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ comments: commentsData.comments }),
        })

        const analysisData = await analysisResponse.json()
        setThematicAnalysis(analysisData.thematicAnalysis)
      } catch (error) {
        console.error('Error fetching and analyzing comments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAndAnalyzeComments()
  }, [])

  if (loading) {
    return <p>Thematic Analyis</p>
  }

  return (
    <div className="p-4">
      {/* <h2 className="text-2xl font-bold mb-4">Content Analysis</h2> */}
      <ScrollArea className="h-96 p-4 border">
        <h3 className="text-xl font-semibold mb-2">Thematic Analysis</h3>
        <p>{thematicAnalysis}</p>
      </ScrollArea>
    </div>
  )
}

export default CommentsAnalysis
