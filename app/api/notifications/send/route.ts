import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmailNotification, storeNotification } from '@/lib/email'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { recipientId, organizationId, title, message, type, recipientEmail, relatedUserId } = await request.json()

    if (!recipientId || !organizationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Store notification in database
    await storeNotification(
      recipientId,
      organizationId,
      title,
      message,
      type || 'info',
      relatedUserId
    )

    // Send email if address provided
    if (recipientEmail) {
      await sendEmailNotification(recipientEmail, title, message, type)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
