'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface AnalyticsData {
  totalAssessments: number
  averageScores: {
    happiness: number
    fitness: number
    mentalHealth: number
    overall: number
  }
  trends: any[]
}

export function AnalyticsCharts({ organizationId }: { organizationId: string }) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [organizationId])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/dashboard?organizationId=${organizationId}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Loading analytics...</p>

  if (!analytics) return <p>No data available</p>

  const scoreData = [
    { name: 'Happiness', value: parseFloat(analytics.averageScores.happiness) },
    { name: 'Physical Fitness', value: parseFloat(analytics.averageScores.fitness) },
    { name: 'Mental Health', value: parseFloat(analytics.averageScores.mentalHealth) },
  ]

  return (
    <div className="space-y-6">
      {/* Average Scores Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Overall Average</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics.averageScores.overall}/10</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Happiness</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics.averageScores.happiness}/10</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Physical Fitness</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics.averageScores.fitness}/10</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Mental Health</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics.averageScores.mentalHealth}/10</p>
          </CardContent>
        </Card>
      </div>

      {/* Average Scores Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Average Scores by Category</CardTitle>
          <CardDescription>Organization-wide wellness metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Trends Chart */}
      {analytics.trends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Wellness Trends</CardTitle>
            <CardDescription>Last 7 assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="created_at" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="happiness_score" stroke="#10B981" name="Happiness" />
                <Line type="monotone" dataKey="fitness_score" stroke="#3B82F6" name="Fitness" />
                <Line type="monotone" dataKey="mental_health_score" stroke="#F59E0B" name="Mental Health" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
