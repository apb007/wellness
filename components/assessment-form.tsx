'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

interface Question {
  id: string
  question: string
  category: 'happiness' | 'fitness' | 'mental_health'
  classLevel: string
  orderNumber: number
}

interface AssessmentResponse {
  [questionId: string]: number
}

export function AssessmentForm() {
  const [classLevel, setClassLevel] = useState<string>('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<AssessmentResponse>({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-save responses every 2 minutes
  useEffect(() => {
    if (responses && Object.keys(responses).length > 0) {
      const autoSaveInterval = setInterval(async () => {
        try {
          await fetch('/api/assessments/draft', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              classLevel,
              responses,
              isDraft: true,
              lastSaved: new Date()
            })
          })
        } catch (err) {
          console.log('[v0] Auto-save failed:', err)
        }
      }, 2 * 60 * 1000) // 2 minutes

      return () => clearInterval(autoSaveInterval)
    }
  }, [responses, classLevel])

  if (!classLevel) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Your Class Level</CardTitle>
          <CardDescription>Choose your class to begin the assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={classLevel} onValueChange={setClassLevel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select class level..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6-8">Classes 6-8</SelectItem>
              <SelectItem value="9-10">Classes 9-10</SelectItem>
              <SelectItem value="11-12">Classes 11-12</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="py-6 text-red-600 dark:text-red-400">
          Error: {error}
        </CardContent>
      </Card>
    )
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-muted-foreground">
          No questions available for this class level.
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = questions[currentIndex]
  const isAnswered = responses[currentQuestion.id] !== undefined
  const totalAnswered = Object.keys(responses).length
  const progress = (totalAnswered / questions.length) * 100

  const handleResponse = (value: number) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSubmit = async () => {
    if (totalAnswered !== questions.length) {
      setError('Please answer all questions before submitting.')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classLevel,
          responses,
          questions
        })
      })

      if (!response.ok) throw new Error('Failed to submit assessment')
      
      const data = await response.json()
      window.location.href = `/dashboard?assessmentId=${data.id}`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit assessment')
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Progress</span>
          <span className="text-muted-foreground">{totalAnswered} of {questions.length}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-600 to-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg">
                Question {currentIndex + 1} of {questions.length}
              </CardTitle>
              <CardDescription className="capitalize">
                {currentQuestion.category.replace('_', ' ')}
              </CardDescription>
            </div>
            <div className="text-xs bg-muted px-2 py-1 rounded">
              {classLevel}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question Text */}
          <p className="text-base font-medium leading-relaxed">
            {currentQuestion.question}
          </p>

          {/* Likert Scale (1-5) */}
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map(value => (
                <button
                  key={value}
                  onClick={() => handleResponse(value)}
                  className={`py-3 px-2 rounded-lg border-2 transition-all text-sm font-medium ${
                    responses[currentQuestion.id] === value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted hover:border-primary hover:bg-muted'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-2 text-xs text-muted-foreground">
              <span className="text-center">Strongly<br/>Disagree</span>
              <span className="text-center">Disagree</span>
              <span className="text-center">Neutral</span>
              <span className="text-center">Agree</span>
              <span className="text-center">Strongly<br/>Agree</span>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 p-3 rounded">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          {currentIndex + 1} / {questions.length}
        </div>

        {currentIndex === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={totalAnswered !== questions.length || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Assessment'
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!isAnswered}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  )
}
