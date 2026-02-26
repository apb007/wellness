'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Eye } from 'lucide-react'
import Link from 'next/link'

interface Assessment {
  id: string
  happiness_score: number
  fitness_score: number
  mental_health_score: number
  created_at: string
}

export default function HistoryPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        // In a real app, this would fetch the user's assessment history
        // For now, we'll show a placeholder
        setAssessments([])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assessment History</h1>
        <p className="mt-2 text-muted-foreground">
          View your past wellness assessments and track your progress over time.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="py-6 text-red-600 dark:text-red-400">
            {error}
          </CardContent>
        </Card>
      ) : assessments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No assessments yet. Start your first wellness assessment to see your history here.
            </p>
            <Link href="/input">
              <Button>Take Assessment</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assessments.map(assessment => {
            const overall = (assessment.happiness_score + assessment.fitness_score + assessment.mental_health_score) / 3
            const date = new Date(assessment.created_at).toLocaleDateString()

            return (
              <Card key={assessment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Assessment from {date}</CardTitle>
                      <CardDescription>
                        Overall Score: {overall.toFixed(1)}/10
                      </CardDescription>
                    </div>
                    <Link href={`/dashboard?assessmentId=${assessment.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Happiness</p>
                      <p className="font-semibold">{assessment.happiness_score.toFixed(1)}/10</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Physical Fitness</p>
                      <p className="font-semibold">{assessment.fitness_score.toFixed(1)}/10</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Mental Health</p>
                      <p className="font-semibold">{assessment.mental_health_score.toFixed(1)}/10</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

