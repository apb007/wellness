'use client'

import { AssessmentForm } from '@/components/assessment-form'

export default function InputPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Assessment</h1>
        <p className="mt-2 text-muted-foreground">
          Answer questions about your happiness, physical fitness, and mental health to calculate your overall wellness score. This assessment takes about 10-15 minutes.
        </p>
      </div>

      <AssessmentForm />
    </div>
  )
}
