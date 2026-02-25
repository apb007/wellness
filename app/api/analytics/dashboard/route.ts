import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const organizationId = request.nextUrl.searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Missing organizationId' },
        { status: 400 }
      )
    }

    const { data: assessments, error: assessError } = await supabase
      .from('wellness_assessments')
      .select('*')
      .eq('organization_id', organizationId)

    if (assessError) throw assessError

    // Calculate aggregated analytics
    const avgHappiness =
      assessments.reduce((sum, a) => sum + a.happiness_score, 0) / assessments.length || 0
    const avgFitness =
      assessments.reduce((sum, a) => sum + a.fitness_score, 0) / assessments.length || 0
    const avgMental =
      assessments.reduce((sum, a) => sum + a.mental_health_score, 0) / assessments.length || 0
    const avgOverall =
      assessments.reduce((sum, a) => sum + a.overall_score, 0) / assessments.length || 0

    // Get trends (last 7 assessments)
    const { data: trendsData } = await supabase
      .from('wellness_assessments')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: true })
      .limit(7)

    return NextResponse.json({
      totalAssessments: assessments.length,
      averageScores: {
        happiness: avgHappiness.toFixed(1),
        fitness: avgFitness.toFixed(1),
        mentalHealth: avgMental.toFixed(1),
        overall: avgOverall.toFixed(1),
      },
      trends: trendsData,
    })
  } catch (error) {
    console.error('Error generating analytics:', error)
    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    )
  }
}
