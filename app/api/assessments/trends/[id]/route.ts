import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data, error } = await supabase
      .from('wellness_assessments')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error

    // Transform data to match frontend expectations
    const trends = data.map(assessment => ({
      date: new Date(assessment.created_at).toLocaleDateString(),
      happiness: assessment.happiness_score,
      fitness: assessment.fitness_score,
      mentalHealth: assessment.mental_health_score,
      overall: (assessment.happiness_score + assessment.fitness_score + assessment.mental_health_score) / 3
    }))

    return NextResponse.json(trends)
  } catch (error) {
    console.error('Error fetching trends:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trends' },
      { status: 500 }
    )
  }
}
