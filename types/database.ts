/**
 * Supabase Database Types
 * Generated from the wellness app schema
 */

export type Organization = {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export type User = {
  id: string
  organization_id: string
  email: string
  name: string
  role: 'student' | 'teacher' | 'admin'
  created_at: string
  updated_at: string
}

export type WellnessAssessmentDB = {
  id: string
  user_id: string
  organization_id: string
  happiness_score: number
  fitness_score: number
  mental_health_score: number
  overall_score: number
  created_at: string
  updated_at: string
}

export type AssessmentQuestion = {
  id: string
  organization_id: string
  category: 'happiness' | 'fitness' | 'mental_health'
  question: string
  order_number: number
  created_at: string
}
