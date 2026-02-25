import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { calculateOverallScore } from '@/lib/wellness'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Question {
  id: string
  category: string
}

interface AssessmentBody {
  classLevel: string
  responses: Record<string, number>
  questions: Question[]
}

export async function POST(request: NextRequest) {
  try {
    const body: AssessmentBody = await request.json()
    const { classLevel, responses, questions } = body

    // Calculate scores by category
    const scores = {
      happiness: 0,
      fitness: 0,
      mentalHealth: 0
    }
    const categoryCounts = {
      happiness: 0,
      fitness: 0,
      mental_health: 0
    }

    // Sum responses by category
    questions.forEach(q => {
      const categoryKey = q.category as keyof typeof categoryCounts
      const responseScore = responses[q.id] || 0

      if (categoryKey === 'happiness') {
        scores.happiness += responseScore
        categoryCounts.happiness++
      } else if (categoryKey === 'fitness') {
        scores.fitness += responseScore
        categoryCounts.fitness++
      } else if (categoryKey === 'mental_health') {
        scores.mentalHealth += responseScore
        categoryCounts.mental_health++
      }
    })

    // Average scores (scale from 1-5 to 0-10)
    scores.happiness = (scores.happiness / categoryCounts.happiness) * 2
    scores.fitness = (scores.fitness / categoryCounts.fitness) * 2
    scores.mentalHealth = (scores.mentalHealth / categoryCounts.mental_health) * 2

    // Round to 1 decimal place
    scores.happiness = Math.round(scores.happiness * 10) / 10
    scores.fitness = Math.round(scores.fitness * 10) / 10
    scores.mentalHealth = Math.round(scores.mentalHealth * 10) / 10

    // Calculate overall score
    const overall = calculateOverallScore(scores)

    // Save to database (using null organization_id for global platform)
    const { data, error } = await supabase
      .from('wellness_assessments')
      .insert({
        user_id: null, // Would be set with authentication
        organization_id: (await supabase
          .from('organizations')
          .select('id')
          .eq('slug', 'global-wellness')
          .single()).data?.id,
        happiness_score: scores.happiness,
        fitness_score: scores.fitness,
        mental_health_score: scores.mentalHealth
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      id: data.id,
      scores,
      overall,
      createdAt: data.created_at
    })
  } catch (error) {
    console.error('Error saving assessment:', error)
    return NextResponse.json(
      { error: 'Failed to save assessment' },
      { status: 500 }
    )
  }
}
