'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Assessment {
  id: string
  happiness_score: number
  fitness_score: number
  mental_health_score: number
  created_at: string
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const assessmentId = searchParams.get('assessmentId')
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        if (assessmentId) {
          const response = await fetch(`/api/assessments/${assessmentId}`)
          if (!response.ok) throw new Error('Failed to fetch assessment')
          const data: Assessment = await response.json()
          setAssessment(data)
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
  const date = new Date(assessment.created_at).toLocaleDateString()

  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Your Wellness Scores</CardTitle>
          <CardDescription>Detailed breakdown of your assessment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm text-muted-foreground">Happiness</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{assessment.happiness_score}/10</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-sm text-muted-foreground">Fitness</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{assessment.fitness_score}/10</p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <p className="text-sm text-muted-foreground">Mental Health</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{assessment.mental_health_score}/10</p>
            </div>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <p className="text-sm text-muted-foreground">Overall Wellness</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{overall.toFixed(1)}/10</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Personalized suggestions for improvement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {assessment.happiness_score < 6 && (
            <p className="text-sm p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
              💡 Focus on building stronger social connections and engaging in activities you enjoy.
            </p>
          )}
          {assessment.fitness_score < 6 && (
            <p className="text-sm p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
              💡 Try to incorporate at least 30 minutes of physical activity daily.
            </p>
          )}
          {assessment.mental_health_score < 6 && (
            <p className="text-sm p-3 bg-amber-50 dark:bg-amber-950 rounded border border-amber-200 dark:border-amber-800">
              💡 Practice stress management techniques like meditation or journaling.
            </p>
          )}
          {overall >= 8 && (
            <p className="text-sm p-3 bg-purple-50 dark:bg-purple-950 rounded border border-purple-200 dark:border-purple-800">
              🎉 Great Work! You're maintaining excellent wellness. Keep up these healthy habits!
            </p>
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
