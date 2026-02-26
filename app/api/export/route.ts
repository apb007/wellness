import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jsPDF from 'jspdf'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const assessmentId = request.nextUrl.searchParams.get('assessmentId')

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      )
    }

    const { data: assessment, error } = await supabase
      .from('wellness_assessments')
      .select('*')
      .eq('id', assessmentId)
      .single()

    if (error) throw error

    // Create PDF
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 15
    const contentWidth = pageWidth - 2 * margin
    let yPosition = margin

    // Title
    doc.setFontSize(24)
    doc.text('Wellness Assessment Report', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    // Date
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(
      `Generated: ${new Date(assessment.created_at).toLocaleDateString()}`,
      pageWidth / 2,
      yPosition,
      { align: 'center' }
    )
    yPosition += 15

    // Reset text color
    doc.setTextColor(0)

    // Overall Score
    doc.setFontSize(16)
    doc.text('Overall Wellness Score', margin, yPosition)
    yPosition += 8

    const overall = (assessment.happiness_score + assessment.fitness_score + assessment.mental_health_score) / 3
    doc.setFontSize(32)
    doc.setTextColor(76, 175, 80) // Green
    doc.text(overall.toFixed(1), margin, yPosition)
    doc.setTextColor(0)
    yPosition += 15

    // Individual Scores
    doc.setFontSize(14)
    doc.text('Individual Scores', margin, yPosition)
    yPosition += 8

    const scores = [
      { label: 'Happiness', value: assessment.happiness_score },
      { label: 'Physical Fitness', value: assessment.fitness_score },
      { label: 'Mental Health', value: assessment.mental_health_score }
    ]

    doc.setFontSize(11)
    scores.forEach(score => {
      doc.text(`${score.label}: ${score.value.toFixed(1)}/10`, margin, yPosition)
      yPosition += 8
    })

    // Convert to PDF and return
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="wellness-report-${assessmentId}.pdf"`
      }
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
