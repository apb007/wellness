import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function sendEmailNotification(
  recipientEmail: string,
  subject: string,
  message: string,
  type: 'risk_alert' | 'achievement' | 'reminder' | 'info' = 'info'
) {
  try {
    // For MVP, using Supabase to store, you can integrate Resend/SendGrid later
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@wellnesscore.com',
        to: recipientEmail,
        subject,
        html: generateEmailTemplate(subject, message, type),
      }),
    })

    if (!response.ok) {
      console.error('Email send failed:', await response.text())
      return false
    }

    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

function generateEmailTemplate(subject: string, message: string, type: string): string {
  const colors = {
    risk_alert: '#EF4444',
    achievement: '#10B981',
    reminder: '#F59E0B',
    info: '#3B82F6',
  }

  const color = colors[type as keyof typeof colors] || colors.info

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
          .container { max-width: 500px; margin: 0 auto; padding: 20px; }
          .header { border-left: 4px solid ${color}; padding-left: 16px; margin-bottom: 20px; }
          .header h2 { margin: 0; color: #1F2937; }
          .content { color: #4B5563; line-height: 1.6; margin-bottom: 20px; }
          .footer { color: #9CA3AF; font-size: 12px; margin-top: 40px; border-top: 1px solid #E5E7EB; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>${subject}</h2>
          </div>
          <div class="content">
            ${message}
          </div>
          <div class="footer">
            <p>Wellness Score Platform</p>
            <p>You're receiving this email because you have an account with us.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export async function storeNotification(
  recipientId: string,
  organizationId: string,
  title: string,
  message: string,
  type: 'risk_alert' | 'achievement' | 'reminder' | 'info' = 'info',
  relatedUserId?: string
) {
  try {
    const { error } = await supabase.from('notifications').insert({
      recipient_id: recipientId,
      organization_id: organizationId,
      title,
      message,
      type,
      related_user_id: relatedUserId,
    })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error storing notification:', error)
    return false
  }
}
