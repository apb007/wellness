import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const teacherId = request.nextUrl.searchParams.get('teacherId')

    if (!teacherId) {
      return NextResponse.json(
        { error: 'Missing teacherId' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('classes')
      .select('*, class_members(student_id, added_at)')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}
