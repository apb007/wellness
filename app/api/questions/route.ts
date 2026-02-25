import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const classLevel = request.nextUrl.searchParams.get('classLevel')

    if (!classLevel) {
      return NextResponse.json(
        { error: 'Class level is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('assessment_questions')
      .select('id, question, category, class_level, order_number')
      .eq('class_level', classLevel)
      .order('category', { ascending: true })
      .order('order_number', { ascending: true })

    if (error) throw error

    // Transform the response to match frontend expectations
    const questions = data.map(q => ({
      id: q.id,
      question: q.question,
      category: q.category,
      classLevel: q.class_level,
      orderNumber: q.order_number
    }))

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}
