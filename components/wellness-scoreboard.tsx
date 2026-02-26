'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatScore, getStatusColor, getStatusDescription } from '@/lib/wellness'
import { Activity, Brain, Heart, Zap } from 'lucide-react'

interface ScoreCardProps {
  title: string
  score: number
  icon: React.ReactNode
  color: string
  description?: string
}

function ScoreCard({ title, score, icon, color }: ScoreCardProps) {
  const percentage = (score / 10) * 100

  return (
    <Card className={`border-2 ${color}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="text-2xl">{icon}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="text-3xl font-bold">{formatScore(score)}</div>
          <p className="text-xs text-muted-foreground">out of 10</p>
        </div>
        <div className="space-y-1">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${
                score >= 8 ? 'bg-green-600' :
                score >= 6 ? 'bg-blue-600' :
                score >= 4 ? 'bg-amber-600' :
                'bg-red-600'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface WellnessScoreboardProps {
  happiness: number
  fitness: number
  mentalHealth: number
  overall: number
  status: 'excellent' | 'good' | 'fair' | 'poor'
}

export function WellnessScoreboard({
  happiness,
  fitness,
  mentalHealth,
  overall,
  status
}: WellnessScoreboardProps) {
  const statusColor = getStatusColor(status)
  const statusDescription = getStatusDescription(status)

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className={`border-2 ${statusColor}`}>
        <CardHeader>
          <CardTitle className="text-xl">Overall Wellness Score</CardTitle>
          <CardDescription>{statusDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-5xl font-bold">{formatScore(overall)}</div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span className="text-muted-foreground">{formatScore(overall)}/10</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    overall >= 8 ? 'bg-green-600' :
                    overall >= 6 ? 'bg-blue-600' :
                    overall >= 4 ? 'bg-amber-600' :
                    'bg-red-600'
                  }`}
                  style={{ width: `${(overall / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ScoreCard
          title="Happiness"
          score={happiness}
          icon={<Heart className="w-5 h-5 text-green-600" />}
          color="border-green-200 dark:border-green-800"
        />
        <ScoreCard
          title="Physical Fitness"
          score={fitness}
          icon={<Activity className="w-5 h-5 text-blue-600" />}
          color="border-blue-200 dark:border-blue-800"
        />
        <ScoreCard
          title="Mental Health"
          score={mentalHealth}
          icon={<Brain className="w-5 h-5 text-amber-600" />}
          color="border-amber-200 dark:border-amber-800"
        />
      </div>
    </div>
  )
}
