import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import type { InquiryFormData } from '@/lib/types'
import { calculateStay, formatPHP } from '@/lib/pricing'
import { SOFT_OPENING, PROPERTY_CONFIG } from '@/lib/config'
import { appendInquiryToSheet } from '@/lib/sheets'

export async function POST(req: NextRequest) {
  // Initialized here (not at module level) so build doesn't require RESEND_API_KEY
  const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')
  let body: InquiryFormData

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Basic server-side validation
  if (!body.name?.trim() || !body.email?.trim() || !body.checkIn) {
    return NextResponse.json(
      { error: 'Name, email, and check-in date are required.' },
      { status: 400 }
    )
  }

  // Compute price estimate if dates are valid
  let priceEstimate = ''
  let priceEstimateText = ''
  try {
    const checkIn = new Date(body.checkIn)
    const checkOut = body.checkOut ? new Date(body.checkOut) : checkIn
    if (!isNaN(checkIn.getTime())) {
      const breakdown = calculateStay(
        checkIn,
        checkOut,
        body.headcount || 1,
        body.stayType || 'overnight',
        SOFT_OPENING
      )
      if (breakdown.finalTotal > 0) {
        priceEstimate = `Estimated total: ${formatPHP(breakdown.finalTotal)} (${breakdown.nights > 0 ? breakdown.nights + ' night(s)' : 'Day trip'})`
        if (breakdown.isSoftOpeningPrice) priceEstimate += ' — soft launch introductory discounted rate (best direct-book rate)'
        priceEstimateText = priceEstimate
      }
    }
  } catch {
    // Non-critical — don't fail the request over a pricing calc error
  }

  const fromAddress = process.env.RESEND_FROM_EMAIL || PROPERTY_CONFIG.email
  const toAddress = process.env.RESEND_TO_EMAIL || PROPERTY_CONFIG.email
  const replyToAddress = process.env.RESEND_REPLY_TO_EMAIL || PROPERTY_CONFIG.email

  const ownerHtml = buildOwnerEmailHtml(body, priceEstimate)
  const guestHtml = buildGuestEmailHtml(body, priceEstimateText)

  try {
    const { error } = await resend.batch.send([
      // Notification to owner
      {
        from: `Your Property <${fromAddress}>`,
        to: [toAddress],
        replyTo: body.email,
        subject: `New Inquiry — ${body.name} · ${body.checkIn}`,
        html: ownerHtml,
      },
      // Auto-reply to guest
      {
        from: `Your Property <${fromAddress}>`,
        to: [body.email],
        replyTo: replyToAddress,
        subject: `We received your inquiry — Your Property`,
        html: guestHtml,
      },
    ])

    if (error) {
      console.error('[inquire] Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
    }

    // Log to Google Sheets — awaited so it completes before function shuts down,
    // but wrapped so Sheets failure never breaks the form submit
    let sheetRow: number | undefined
    try {
      sheetRow = await appendInquiryToSheet(body, priceEstimateText)
    } catch (err) {
      console.error('[inquire] Sheets error:', err)
    }

    // Notify PropertyOps Agent via Discord — non-blocking fire-and-forget
    const discordToken = process.env.DISCORD_BOT_TOKEN
    const discordChannel = process.env.DISCORD_CHANNEL_ID
    if (discordToken && discordChannel) {
      const stayLabel = body.stayType === 'daytrip' ? 'Day Trip (9AM–5PM)' : 'Overnight'
      const dateRange = body.checkOut && body.checkOut !== body.checkIn
        ? `${body.checkIn} → ${body.checkOut}`
        : body.checkIn

      fetch(`https://discord.com/api/v10/channels/${discordChannel}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bot ${discordToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embeds: [{
            title: '📋 New Inquiry — Your Property',
            color: 0x1E6B7B,
            fields: [
              { name: 'Guest', value: body.name, inline: true },
              { name: 'Email', value: body.email, inline: true },
              { name: 'Phone', value: body.phone || '—', inline: true },
              { name: 'Dates', value: dateRange, inline: true },
              { name: 'Stay', value: stayLabel, inline: true },
              { name: 'Guests', value: `${body.headcount || 1} pax`, inline: true },
              ...(priceEstimateText ? [{ name: 'Estimate', value: priceEstimateText.replace('Estimated total: ', ''), inline: false }] : []),
              ...(body.message ? [{ name: 'Message', value: body.message, inline: false }] : []),
              { name: 'Sheet Row', value: sheetRow ? `Row ${sheetRow}` : 'unknown', inline: true },
            ],
            footer: { text: 'yourproperty.com/api/admin · Use row number for API calls' },
            timestamp: new Date().toISOString(),
          }],
          content: `**New inquiry from ${body.name}** — please check calendar and submit your recommendation.\n\n**API base:** \`https://www.yourproperty.com/api/admin\`\n**Auth:** \`Bearer ${process.env.ADMIN_API_KEY || ''}\`\n**Row ID:** \`${sheetRow ?? 'check sheet'}\``,
        }),
      }).catch((err) => console.error('[inquire] Discord notify error:', err))
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[inquire] Unexpected error:', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}

// ─── Owner notification ───────────────────────────────────────────────────────

function buildOwnerEmailHtml(data: InquiryFormData, priceEstimate: string): string {
  const rows = [
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone || '—'],
    ['Check-in', data.checkIn || '—'],
    ['Check-out', data.checkOut || '—'],
    ['Headcount', String(data.headcount || '—')],
    ['Stay Type', data.stayType === 'daytrip' ? 'Day Trip (9AM–5PM)' : 'Overnight'],
    ['Message', data.message || '—'],
  ]

  const tableRows = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 12px;background:#f5f5f0;font-weight:600;width:140px;vertical-align:top;">${label}</td>
        <td style="padding:8px 12px;">${value}</td>
      </tr>`
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:Georgia,serif;color:#1a1a1a;max-width:600px;margin:0 auto;padding:24px;">
      <h2 style="color:#1E6B7B;margin-bottom:4px;">New Inquiry — Your Property</h2>
      <p style="color:#666;margin-top:0;font-size:14px;">Received via yourproperty.com</p>

      <table style="border-collapse:collapse;width:100%;margin:24px 0;font-size:15px;">
        ${tableRows}
      </table>

      ${
        priceEstimate
          ? `<p style="background:#e8f4f7;padding:12px 16px;border-left:4px solid #1E6B7B;margin:16px 0;font-size:15px;">
              <strong>💰 ${priceEstimate}</strong>
            </p>`
          : ''
      }

      <p style="color:#888;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;">
        Reply directly to this email to respond to the guest.<br>
        <em>Your Property · yourproperty.com</em>
      </p>
    </body>
    </html>
  `
}

// ─── Guest auto-reply ─────────────────────────────────────────────────────────

function buildGuestEmailHtml(data: InquiryFormData, priceEstimate: string): string {
  const firstName = data.name.split(' ')[0]
  const stayLabel = data.stayType === 'daytrip' ? 'Day Trip (9AM–5PM)' : 'Overnight Stay'
  const dateRange = data.checkOut && data.checkOut !== data.checkIn
    ? `${data.checkIn} → ${data.checkOut}`
    : data.checkIn

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

      <!-- Body -->
      <div style="padding:32px 24px;">
        <p style="font-size:18px;margin-top:0;">Hi ${firstName},</p>

        <p style="font-size:15px;line-height:1.7;color:#333;">
          Thank you for reaching out! We've received your inquiry and will get back to you
          within <strong>24 hours</strong> to confirm availability and details.
        </p>

        <!-- Inquiry summary -->
        <div style="background:#f9f8f5;border:1px solid #e8e5de;border-radius:8px;padding:20px 24px;margin:24px 0;">
          <p style="margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;color:#888;">Your Inquiry Summary</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr>
              <td style="padding:5px 0;color:#666;width:110px;">Dates</td>
              <td style="padding:5px 0;font-weight:600;">${dateRange}</td>
            </tr>
            <tr>
              <td style="padding:5px 0;color:#666;">Stay type</td>
              <td style="padding:5px 0;font-weight:600;">${stayLabel}</td>
            </tr>
            <tr>
              <td style="padding:5px 0;color:#666;">Guests</td>
              <td style="padding:5px 0;font-weight:600;">${data.headcount || 1} pax</td>
            </tr>
            ${priceEstimate ? `
            <tr>
              <td style="padding:5px 0;color:#666;">Estimate</td>
              <td style="padding:5px 0;font-weight:600;color:#1E6B7B;">${priceEstimate.replace('Estimated total: ', '')}</td>
            </tr>` : ''}
          </table>
        </div>

        <p style="font-size:15px;line-height:1.7;color:#333;">
          In the meantime, feel free to browse the full gallery and amenities at
          <a href="https://yourproperty.com" style="color:#1E6B7B;">yourproperty.com</a>.
        </p>

        <p style="font-size:15px;line-height:1.7;color:#333;">
          Looking forward to hosting you!
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
        <p style="margin:8px 0 0;font-size:11px;color:#bbb;">
          You received this because you submitted an inquiry on our website.
        </p>
      </div>

    </body>
    </html>
  `
}
