import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { classLevel, responses, isDraft, lastSaved } = await req.json()

    if (!classLevel || !responses) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Save draft to localStorage-like storage or temp table
    // For MVP, we'll just return success
    return NextResponse.json(
      { message: 'Draft saved', lastSaved },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save draft' },
      { status: 500 }
    )
  }
}
