// src/app/api/analyzeCommentsBatch/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Füge die folgende Zeile hinzu, um den Schlüssel auszugeben:
  console.log('OpenAI API Key:', process.env.OPENAI_API_KEY);

  const { comments } = await req.json()

  const commentTexts = comments.map((comment: { content: string }) => comment.content).join('\n')

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,  // Überprüfen, ob der API-Schlüssel korrekt verwendet wird
      },
      body: JSON.stringify({
        model: 'gpt-4',  // Sicherstellen, dass das Modell korrekt ist
        messages: [
          {
            role: 'system',
            content: 'Provide a thematic analysis by clark & brown of the following comments. Please provide bullet points if needed',
          },
          { role: 'user', content: commentTexts },
        ],
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const analysisText = data.choices[0].message.content

    return NextResponse.json({ thematicAnalysis: analysisText })
  } catch (error) {
    console.error('Error during analysis:', (error as Error).message)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
