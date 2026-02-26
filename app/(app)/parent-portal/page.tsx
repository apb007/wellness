'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface StudentData {
  id: string
  name: string
  assessments: any[]
}

export default function ParentPortalPage() {
  const [students, setStudents] = useState<StudentData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Fetch students linked to this parent
        setStudents([])
      } catch (error) {
        console.error('Error fetching students:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Parent Portal</h1>
        <p className="mt-2 text-muted-foreground">
          Monitor your child's wellness progress and see their detailed scores.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : students.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No students linked to your account yet. Contact your school to set up access.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {students.map(student => (
            <Card key={student.id}>
              <CardHeader>
                <CardTitle>{student.name}</CardTitle>
                <CardDescription>
                  {student.assessments.length} assessments completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Latest Score: {student.assessments[0]?.overall_score || 'N/A'}/10</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
