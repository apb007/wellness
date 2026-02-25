/**
 * Wellness Score Utilities
 * Handles calculations and formatting for wellness metrics
 */

export interface WellnessScores {
  happiness: number
  fitness: number
  mentalHealth: number
}

export interface WellnessAssessment extends WellnessScores {
  overall: number
  status: 'excellent' | 'good' | 'fair' | 'poor'
  createdAt?: Date
}

/**
 * Calculate overall wellness score as average of three metrics
 * @param scores Object containing happiness, fitness, and mentalHealth scores (0-10)
 * @returns Overall wellness score (0-10)
 */
export function calculateOverallScore(scores: WellnessScores): number {
  const { happiness, fitness, mentalHealth } = scores
  const sum = happiness + fitness + mentalHealth
  const overall = sum / 3
  return Math.round(overall * 10) / 10 // Round to 1 decimal place
}

/**
 * Determine wellness status based on overall score
 * @param score Overall wellness score (0-10)
 * @returns Status category
 */
export function getWellnessStatus(score: number): WellnessAssessment['status'] {
  // RFP Categories: Red (0-49), Yellow (50-74), Green (75-100)
  // Converting 0-10 scale to RFP percentages (0-100)
  const percentage = (score / 10) * 100
  
  if (percentage >= 75) return 'excellent' // Green
  if (percentage >= 50) return 'good' // Yellow
  if (percentage >= 0) return 'poor' // Red
  return 'poor'
}

/**
 * Get color class for wellness status
 * @param status Wellness status
 * @returns Tailwind color class
 */
export function getStatusColor(status: WellnessAssessment['status']): string {
  const colorMap: Record<WellnessAssessment['status'], string> = {
    excellent: 'text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800', // Green (75-100)
    good: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800', // Yellow (50-74)
    fair: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800', // Red (0-49)
    poor: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800', // Red fallback
  }
  return colorMap[status]
}

/**
 * Get status description
 * @param status Wellness status
 * @returns Description text
 */
export function getStatusDescription(status: WellnessAssessment['status']): string {
  const descriptions: Record<WellnessAssessment['status'], string> = {
    excellent: 'Excellent wellness (75-100)! Keep maintaining these great habits.',
    good: 'Good wellness (50-74). You\'re on the right track.',
    fair: 'Needs improvement (0-49). Focus on improving your health habits.',
    poor: 'Needs improvement (0-49). Focus on improving your health habits.',
  }
  return descriptions[status]
}

/**
 * Format score for display
 * @param score Number score
 * @returns Formatted string with one decimal place
 */
export function formatScore(score: number): string {
  return score.toFixed(1)
}

/**
 * Create a complete wellness assessment
 * @param scores Object with happiness, fitness, and mentalHealth scores
 * @returns Complete WellnessAssessment object
 */
export function createAssessment(scores: WellnessScores): WellnessAssessment {
  const overall = calculateOverallScore(scores)
  const status = getWellnessStatus(overall)
  return {
    ...scores,
    overall,
    status,
    createdAt: new Date(),
  }
}
