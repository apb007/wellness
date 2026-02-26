'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Student {
  id: string
  name: string
  happiness_score?: number
  fitness_score?: number
  mental_health_score?: number
  created_at: string
}

export default function TeacherDashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch students in teacher's class
    setStudents([]) // Placeholder
    setLoading(false)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          View your students' wellness assessments and track their progress.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : students.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No students have completed assessments yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {students.map(student => {
            const overall = student.happiness_score && student.fitness_score && student.mental_health_score
              ? (student.happiness_score + student.fitness_score + student.mental_health_score) / 3
              : 0

            return (
              <Card key={student.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{student.name}</CardTitle>
                      <CardDescription>Overall Score: {overall.toFixed(1)}/10</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
