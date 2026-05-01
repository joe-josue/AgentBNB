import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getAllInquiries, updateInquiryStatus } from '@/lib/sheets'
import { PROPERTY_CONFIG } from '@/lib/config'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const rowNum = parseInt(id, 10)
  if (isNaN(rowNum) || rowNum < 2) {
    return NextResponse.json({ error: 'Invalid inquiry row number' }, { status: 400 })
  }

  let notes: string | undefined
  let sendEmail = false
  try {
    const body = await req.json()
    notes = body.notes
    sendEmail = body.sendEmail === true
  } catch {
    // all optional
  }

  // Fetch the inquiry
  const inquiries = await getAllInquiries()
  const inquiry = inquiries.find((i) => i.row === rowNum)
  if (!inquiry) {
    return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
  }
  if (inquiry.status === 'Rejected') {
    return NextResponse.json({ error: 'Inquiry already rejected' }, { status: 409 })
  }

  // Update Sheet1 row status
  await updateInquiryStatus(rowNum, 'Rejected', undefined, notes)

  // Optionally send decline email to guest
  if (sendEmail) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')
      const fromAddress = process.env.RESEND_FROM_EMAIL || PROPERTY_CONFIG.email
      const ownerEmail = process.env.RESEND_TO_EMAIL || PROPERTY_CONFIG.email
      const firstName = inquiry.name.split(' ')[0]

      await resend.emails.send({
        from: `Your Property <${fromAddress}>`,
        to: [inquiry.email],
        replyTo: ownerEmail,
        subject: `Re: Your Property Inquiry — ${inquiry.checkIn}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family:Georgia,serif;color:#1a1a1a;max-width:600px;margin:0 auto;padding:0;">
            <div style="background:#1E6B7B;padding:32px 24px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;letter-spacing:0.05em;">Your Property</h1>
            </div>
            <div style="padding:32px 24px;">
              <p style="font-size:18px;margin-top:0;">Hi ${firstName},</p>
              <p style="font-size:15px;line-height:1.7;color:#333;">
                Thank you for your interest in Your Property. Unfortunately, the dates you requested
                (${inquiry.checkIn}${inquiry.checkOut ? ' → ' + inquiry.checkOut : ''}) are not available.
              </p>
              <p style="font-size:15px;line-height:1.7;color:#333;">
                We'd love to host you on another date — feel free to submit a new inquiry at
                <a href="https://yourproperty.com/#inquire" style="color:#1E6B7B;">yourproperty.com</a>.
              </p>
              <p style="font-size:15px;margin-bottom:0;">
                Warm regards,<br>
                <strong>The Your Property Team</strong>
              </p>
            </div>
            <div style="background:#f5f5f0;padding:20px 24px;text-align:center;border-top:1px solid #e8e5de;">
              <p style="margin:0;font-size:12px;color:#999;">
                Your Property · <a href="https://yourproperty.com" style="color:#1E6B7B;text-decoration:none;">yourproperty.com</a>
              </p>
            </div>
          </body>
          </html>
        `,
      })
    } catch (err) {
      console.error('[reject] Email send error:', err)
    }
  }

  return NextResponse.json({ success: true, row: rowNum, status: 'Rejected' })
}
