import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { PROPERTY_CONFIG } from '@/lib/config'

export async function POST(req: NextRequest) {
  let body: {
    to: string
    guestName: string
    subject: string
    message: string
    inquiryRow?: number
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.to || !body.guestName || !body.subject || !body.message) {
    return NextResponse.json(
      { error: 'to, guestName, subject, and message are required' },
      { status: 400 }
    )
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.to)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')
  const fromAddress = process.env.RESEND_FROM_EMAIL || PROPERTY_CONFIG.email
  const replyToAddress = process.env.RESEND_REPLY_TO_EMAIL || PROPERTY_CONFIG.email

  // Convert plain-text message to simple HTML paragraphs
  const messageHtml = body.message
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => `<p style="font-size:15px;line-height:1.7;color:#333;margin:0 0 12px;">${line}</p>`)
    .join('')

  try {
    const { data, error } = await resend.emails.send({
      from: `Your Property <${fromAddress}>`,
      to: [body.to],
      replyTo: replyToAddress,
      subject: body.subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family:Georgia,serif;color:#1a1a1a;max-width:600px;margin:0 auto;padding:0;">

          <!-- Header -->
          <div style="background:#1E6B7B;padding:32px 24px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:24px;letter-spacing:0.05em;">Your Property</h1>
            <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;">Your City, Your Region · Private Hilltop Retreat</p>
          </div>

          <!-- Body -->
          <div style="padding:32px 24px;">
            <p style="font-size:18px;margin-top:0;">Hi ${body.guestName.split(' ')[0]},</p>
            ${messageHtml}
            <p style="font-size:15px;margin-top:24px;margin-bottom:0;">
              Warm regards,<br>
              <strong>The Your Property Team</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#f5f5f0;padding:20px 24px;text-align:center;border-top:1px solid #e8e5de;">
            <p style="margin:0;font-size:12px;color:#999;">
              Your Property · Your City, Your Region, Philippines<br>
              <a href="https://yourproperty.com" style="color:#1E6B7B;text-decoration:none;">yourproperty.com</a>
            </p>
          </div>

        </body>
        </html>
      `,
    })

    if (error) {
      console.error('[guest/message] Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    console.log(
      `[guest/message] Sent to ${body.to} (row ${body.inquiryRow ?? 'n/a'}) — id: ${data?.id}`
    )

    return NextResponse.json({ success: true, messageId: data?.id })
  } catch (err) {
    console.error('[guest/message] Unexpected error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
