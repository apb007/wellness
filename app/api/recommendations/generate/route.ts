import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const recommendationEngine = {
  happiness: (score: number) => {
    if (score < 5) return 'Consider speaking with a school counselor about stress or concerns'
    if (score < 7) return 'Try spending more time with friends and engaging in activities you enjoy'
    return 'Great job maintaining positive relationships and happiness!'
  },
  fitness: (score: number) => {
    if (score < 5) return 'Start with 15 minutes of daily physical activity, such as walking or dancing'
    if (score < 7) return 'Increase physical activity to at least 30 minutes daily for better health'
    return 'Excellent fitness routine! Keep up the consistent exercise habits'
  },
  mental_health: (score: number) => {
    if (score < 5) return 'Practice mindfulness or meditation for 5-10 minutes daily to manage stress'
    if (score < 7) return 'Try journaling or talking to someone you trust about your feelings'
    return 'You\'re managing stress well! Keep using your coping strategies'
  },
}

export async function POST(request: NextRequest) {
  try {
    const { studentId, organizationId, category, score } = await request.json()

    if (!studentId || !organizationId || !category || score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const recommendation =
      recommendationEngine[category as keyof typeof recommendationEngine]?.(score) ||
      'Keep working on your wellness journey!'

    const { data, error } = await supabase
      .from('recommendations')
      .insert({
        student_id: studentId,
        organization_id: organizationId,
        category,
        recommendation,
        priority: score < 5 ? 'high' : score < 7 ? 'medium' : 'low',
      })
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Error generating recommendation:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendation' },
      { status: 500 }
    )
  }
}
