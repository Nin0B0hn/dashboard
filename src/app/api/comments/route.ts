import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { content, parentId, userName } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

  const { data, error } = await supabase
    .from('comments')
    .insert({ content, user_name: userName, parent_id: parentId || null })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const parentId = searchParams.get('parentId')
  const supabase = createRouteHandlerClient({ cookies })

  const query = supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: true })

  if (parentId) {
    query.eq('parent_id', parentId)
  } else {
    query.is('parent_id', null)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}