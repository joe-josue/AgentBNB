import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getAllBookings, updateBookingThankYouSent } from '@/lib/bookings'
import { PROPERTY_CONFIG } from '@/lib/config'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // 1. Fetch the booking
    const bookings = await getAllBookings()
    const booking = bookings.find((b) => b.id === id)
    
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (!booking.guestEmail) {
      return NextResponse.json({ error: 'Guest email is missing' }, { status: 400 })
    }

    // 2. Send the email via Resend
    const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')
    const fromAddress = process.env.RESEND_FROM_EMAIL || PROPERTY_CONFIG.email
    const replyToAddress = process.env.RESEND_REPLY_TO_EMAIL || PROPERTY_CONFIG.email

    await resend.emails.send({
      from: `Your Property <${fromAddress}>`,
      to: [booking.guestEmail],
      replyTo: replyToAddress,
      subject: `How was your stay at Your Property?`,
      html: buildThankYouEmail(booking),
    })

    // 3. Update the spreadsheet
    await updateBookingThankYouSent(id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[thank-you] error:', err)
    return NextResponse.json({ error: 'Failed to send thank you email' }, { status: 500 })
  }
}

function buildThankYouEmail(booking: { guestName: string; id: string }): string {
  const firstName = booking.guestName.split(' ')[0]
  const googleReviewUrl = 'https://g.page/r/CRJbdr4La0EwEBM/review'
  const privateFormUrl = `https://yourproperty.com/review/${booking.id}`

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:Georgia,serif;color:#1a1a1a;max-width:600px;margin:0 auto;padding:0;">

      <!-- Header -->
      <div style="background:#1E6B7B;padding:32px 24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;letter-spacing:0.05em;">Your Property</h1>
        <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;">Your City, Your Region &middot; Private Hilltop Retreat</p>
      </div>

      <!-- Body -->
      <div style="padding:48px 32px;text-align:center;">
        <p style="font-size:20px;margin-top:0;">Hi ${firstName},</p>

        <p style="font-size:16px;line-height:1.7;color:#333;margin:24px 0;">
          Thank you for choosing to stay with us at Your Property. We hope you had a restful and rejuvenating time at our hilltop sanctuary.
        </p>

        <p style="font-size:16px;line-height:1.7;color:#333;margin:24px 0;">
          If you enjoyed your stay, it would mean the world to us if you left a quick Google Review &mdash; it helps other families discover Your Property and keeps us going as a small family property.
        </p>

        <!-- Primary CTA: Google Review -->
        <div style="margin:40px 0 16px;">
          <a href="${googleReviewUrl}" style="background:#1E6B7B;color:#ffffff;padding:16px 36px;text-decoration:none;border-radius:6px;font-weight:bold;display:inline-block;font-size:15px;letter-spacing:0.02em;">
            &#11088; Leave a Google Review
          </a>
        </div>

        <!-- Secondary: Private feedback -->
        <p style="font-size:13px;color:#999;margin:0;">
          Have private feedback or a concern? <a href="${privateFormUrl}" style="color:#1E6B7B;text-decoration:underline;">Let us know here instead.</a>
        </p>

        <p style="font-size:16px;margin-bottom:0;border-top:1px solid #eee;padding-top:40px;margin-top:48px;">
          Warm regards,<br>
          <strong>The Your Property Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f5f5f0;padding:24px;text-align:center;border-top:1px solid #e8e5de;">
        <p style="margin:0;font-size:12px;color:#999;">
          Your Property &middot; Your City, Your Region, Philippines<br>
          <a href="https://yourproperty.com" style="color:#1E6B7B;text-decoration:none;">yourproperty.com</a>
        </p>
      </div>

    </body>
    </html>
  `
}
