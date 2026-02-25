'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb } from 'lucide-react'

interface Recommendation {
  id: string
  category: string
  recommendation: string
  priority: 'low' | 'medium' | 'high'
}

export function RecommendationsWidget({ studentId }: { studentId: string }) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // This would be a real API call
        setLoading(false)
      } catch (error) {
        console.error('Error fetching recommendations:', error)
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [studentId])

  const priorityColors = {
    high: 'border-red-200 bg-red-50',
    medium: 'border-yellow-200 bg-yellow-50',
    low: 'border-green-200 bg-green-50',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Personalized Recommendations
        </CardTitle>
        <CardDescription>AI-powered suggestions for improvement</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : recommendations.length === 0 ? (
          <p className="text-sm text-muted-foreground">Complete an assessment to get recommendations</p>
        ) : (
          <div className="space-y-3">
            {recommendations.map(rec => (
              <div key={rec.id} className={`p-3 rounded-lg border ${priorityColors[rec.priority]}`}>
                <p className="text-sm font-medium capitalize">{rec.category}</p>
                <p className="text-xs mt-1">{rec.recommendation}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
