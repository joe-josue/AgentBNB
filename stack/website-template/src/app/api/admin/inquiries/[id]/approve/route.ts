import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getAllInquiries, updateInquiryStatus } from '@/lib/sheets'
import { createBooking } from '@/lib/bookings'
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
  try {
    const body = await req.json()
    notes = body.notes
  } catch {
    // notes is optional
  }

  // 1. Fetch the inquiry
  const inquiries = await getAllInquiries()
  const inquiry = inquiries.find((i) => i.row === rowNum)
  if (!inquiry) {
    return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
  }
  if (inquiry.status === 'Approved') {
    return NextResponse.json({ error: 'Inquiry already approved' }, { status: 409 })
  }

  // 2. Create booking in Sheet2
  const booking = await createBooking({
    checkIn: inquiry.checkIn,
    checkOut: inquiry.checkOut,
    guestName: inquiry.name,
    guestEmail: inquiry.email,
    headcount: inquiry.headcount,
    stayType: inquiry.stayType,
    total: inquiry.estimatedTotal,
    source: 'direct',
    inquiryRow: rowNum,
    notes,
  })

  // 3. Update Sheet1 row status
  await updateInquiryStatus(rowNum, 'Approved', booking.id, notes)

  // 4. Send confirmation emails
  try {
    const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')
    const fromAddress = process.env.RESEND_FROM_EMAIL || PROPERTY_CONFIG.email
    const ownerEmail = process.env.RESEND_TO_EMAIL || PROPERTY_CONFIG.email
    const replyToAddress = process.env.RESEND_REPLY_TO_EMAIL || PROPERTY_CONFIG.email

    await resend.batch.send([
      {
        from: `Your Property <${fromAddress}>`,
        to: [inquiry.email],
        replyTo: replyToAddress,
        subject: `Your Property Booking is Confirmed — ${inquiry.checkIn}`,
        html: buildGuestConfirmationEmail(inquiry, booking.id),
      },
      {
        from: `Your Property <${fromAddress}>`,
        to: [ownerEmail],
        subject: `Booking Confirmed — ${inquiry.name} · ${inquiry.checkIn}`,
        html: buildOwnerConfirmationEmail(inquiry, booking.id),
      },
    ])
  } catch (err) {
    console.error('[approve] Email send error:', err)
    // Non-critical — booking is created even if email fails
  }

  return NextResponse.json({ booking })
}

// ─── Email Templates ──────────────────────────────────────────────────────────

function buildGuestConfirmationEmail(
  inquiry: Awaited<ReturnType<typeof getAllInquiries>>[number],
  bookingId: string
): string {
  const firstName = inquiry.name.split(' ')[0]
  const stayLabel = inquiry.stayType === 'daytrip' ? 'Day Trip (9AM–5PM)' : 'Overnight Stay'
  const dateRange =
    inquiry.checkOut && inquiry.checkOut !== inquiry.checkIn
      ? `${inquiry.checkIn} → ${inquiry.checkOut}`
      : inquiry.checkIn

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:Georgia,serif;color:#1a1a1a;max-width:600px;margin:0 auto;padding:0;">

      <!-- Header -->
      <div style="background:#1E6B7B;padding:32px 24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;letter-spacing:0.05em;">Your Property</h1>
        <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;">Your City, Your Region · Private Hilltop Retreat</p>
      </div>

      <!-- Confirmed badge -->
      <div style="background:#e8f4f7;padding:16px 24px;text-align:center;border-bottom:2px solid #1E6B7B;">
        <p style="margin:0;font-size:16px;font-weight:bold;color:#1E6B7B;">✅ Booking Confirmed</p>
      </div>

      <!-- Body -->
      <div style="padding:32px 24px;">
        <p style="font-size:18px;margin-top:0;">Hi ${firstName},</p>

        <p style="font-size:15px;line-height:1.7;color:#333;">
          Great news — your booking at Your Property is <strong>confirmed</strong>!
          We're looking forward to hosting you.
        </p>

        <!-- Booking summary -->
        <div style="background:#f9f8f5;border:1px solid #e8e5de;border-radius:8px;padding:20px 24px;margin:24px 0;">
          <p style="margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;color:#888;">Booking Summary</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr>
              <td style="padding:5px 0;color:#666;width:110px;">Booking ID</td>
              <td style="padding:5px 0;font-weight:600;font-size:12px;color:#888;">${bookingId}</td>
            </tr>
            <tr>
              <td style="padding:5px 0;color:#666;">Dates</td>
              <td style="padding:5px 0;font-weight:600;">${dateRange}</td>
            </tr>
            <tr>
              <td style="padding:5px 0;color:#666;">Stay type</td>
              <td style="padding:5px 0;font-weight:600;">${stayLabel}</td>
            </tr>
            <tr>
              <td style="padding:5px 0;color:#666;">Guests</td>
              <td style="padding:5px 0;font-weight:600;">${inquiry.headcount} pax</td>
            </tr>
            ${inquiry.estimatedTotal ? `
            <tr>
              <td style="padding:5px 0;color:#666;">Total</td>
              <td style="padding:5px 0;font-weight:600;color:#1E6B7B;">${inquiry.estimatedTotal.replace('Estimated total: ', '')}</td>
            </tr>` : ''}
          </table>
        </div>

        <!-- What to bring -->
        <div style="margin:24px 0;">
          <p style="font-size:14px;font-weight:600;margin-bottom:8px;">What to bring:</p>
          <ul style="font-size:14px;line-height:1.8;color:#444;padding-left:20px;margin:0;">
            <li>Swimwear and towels</li>
            <li>Toiletries and personal items</li>
            <li>Food and drinks (full kitchen and outdoor grill available)</li>
            <li>Mobile data (WiFi setup in progress)</li>
          </ul>
        </div>

        <p style="font-size:15px;line-height:1.7;color:#333;">
          If you have any questions before your stay, simply reply to this email and we'll get back to you.
        </p>

        <p style="font-size:15px;line-height:1.7;color:#333;">
          See you soon!
        </p>

        <p style="font-size:15px;margin-bottom:0;">
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
  `
}

function buildOwnerConfirmationEmail(
  inquiry: Awaited<ReturnType<typeof getAllInquiries>>[number],
  bookingId: string
): string {
  const stayLabel = inquiry.stayType === 'daytrip' ? 'Day Trip (9AM–5PM)' : 'Overnight'
  const adminUrl = 'https://yourproperty.com/admin'

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:Georgia,serif;color:#1a1a1a;max-width:600px;margin:0 auto;padding:24px;">
      <h2 style="color:#1E6B7B;margin-bottom:4px;">Booking Confirmed — Your Property</h2>
      <p style="color:#666;margin-top:0;font-size:14px;">Booking ID: ${bookingId}</p>

      <table style="border-collapse:collapse;width:100%;margin:24px 0;font-size:15px;">
        ${[
          ['Name', inquiry.name],
          ['Email', inquiry.email],
          ['Phone', inquiry.phone || '—'],
          ['Check-in', inquiry.checkIn || '—'],
          ['Check-out', inquiry.checkOut || '—'],
          ['Headcount', String(inquiry.headcount)],
          ['Stay Type', stayLabel],
          ['Total', inquiry.estimatedTotal || '—'],
        ].map(([label, value]) => `
          <tr>
            <td style="padding:8px 12px;background:#f5f5f0;font-weight:600;width:140px;vertical-align:top;">${label}</td>
            <td style="padding:8px 12px;">${value}</td>
          </tr>`).join('')}
      </table>

      <p style="margin-top:24px;">
        <a href="${adminUrl}" style="background:#1E6B7B;color:#fff;padding:10px 20px;text-decoration:none;border-radius:4px;font-size:14px;">
          View in Admin Dashboard →
        </a>
      </p>

      <p style="color:#888;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;">
        <em>Your Property · yourproperty.com</em>
      </p>
    </body>
    </html>
  `
}
