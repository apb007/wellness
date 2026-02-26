'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WellnessScoreboard } from '@/components/wellness-scoreboard'
import { TrendVisualization } from '@/components/trend-visualization'
import { ExportButton } from '@/components/export-button'
import { getWellnessStatus } from '@/lib/wellness'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Assessment {
  id: string
  happiness_score: number
  fitness_score: number
  mental_health_score: number
  created_at: string
}

interface TrendData {
  date: string
  happiness: number
  fitness: number
  mentalHealth: number
  overall: number
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const assessmentId = searchParams.get('assessmentId')
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        if (assessmentId) {
          // Fetch single assessment
          const response = await fetch(`/api/assessments/${assessmentId}`)
          if (!response.ok) throw new Error('Failed to fetch assessment')
          const data: Assessment = await response.json()
          setAssessment(data)

          // Fetch trends
          const trendsResponse = await fetch(`/api/assessments/trends/${assessmentId}`)
          if (trendsResponse.ok) {
            const trends: TrendData[] = await trendsResponse.json()
            setTrendData(trends)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [assessmentId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !assessment) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="py-6 text-red-600 dark:text-red-400">
          {error || 'Assessment not found'}
        </CardContent>
      </Card>
    )
  }

  const overall = (assessment.happiness_score + assessment.fitness_score + assessment.mental_health_score) / 3
  const status = getWellnessStatus(overall)
  const date = new Date(assessment.created_at).toLocaleDateString()

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Wellness Assessment</h1>
          <p className="mt-2 text-muted-foreground">Completed on {date}</p>
        </div>
        <Link href="/input">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            New Assessment
          </Button>
        </Link>
      </div>

      {/* Wellness Scoreboard */}
      <WellnessScoreboard
        happiness={assessment.happiness_score}
        fitness={assessment.fitness_score}
        mentalHealth={assessment.mental_health_score}
        overall={overall}
        status={status}
      />

      {/* Trend Visualization */}
      <TrendVisualization data={trendData} />

      {/* Export Card */}
      <Card>
        <CardHeader>
          <CardTitle>Export Your Results</CardTitle>
          <CardDescription>Download your wellness assessment as a PDF report</CardDescription>
        </CardHeader>
        <CardContent>
          <ExportButton
            assessmentId={assessment.id}
            scores={{
              happiness: assessment.happiness_score,
              fitness: assessment.fitness_score,
              mentalHealth: assessment.mental_health_score,
              overall
            }}
            date={new Date(assessment.created_at).toISOString().split('T')[0]}
          />
        </CardContent>
      </Card>

      {/* Recommendations Card */}
      <Card>
        <CardHeader>
          <CardTitle>Wellness Recommendations</CardTitle>
          <CardDescription>Based on your assessment results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {assessment.happiness_score < 6 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                💡 Happiness Improvement: Focus on building stronger social connections and engaging in activities you enjoy.
              </p>
            </div>
          )}
          {assessment.fitness_score < 6 && (
            <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm font-medium text-green-900 dark:text-green-200">
                💡 Physical Fitness: Try to incorporate at least 30 minutes of physical activity daily. Start small and build up gradually.
              </p>
            </div>
          )}
          {assessment.mental_health_score < 6 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                💡 Mental Health: Practice stress management techniques like meditation, journaling, or talking to someone you trust.
              </p>
            </div>
          )}
          {overall >= 8 && (
            <div className="p-3 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg">
              <p className="text-sm font-medium text-purple-900 dark:text-purple-200">
                🎉 Great Work! You're maintaining excellent wellness. Keep up these healthy habits!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
