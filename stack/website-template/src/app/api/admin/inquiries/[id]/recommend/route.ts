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

  let action: 'approve' | 'reject' | 'escalate' = 'escalate'
  let reasoning = ''
  let notes = ''
  try {
    const body = await req.json()
    action = body.action ?? 'escalate'
    reasoning = body.reasoning ?? ''
    notes = body.notes ?? ''
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!['approve', 'reject', 'escalate'].includes(action)) {
    return NextResponse.json(
      { error: 'action must be "approve", "reject", or "escalate"' },
      { status: 400 }
    )
  }

  // Fetch the inquiry
  const inquiries = await getAllInquiries()
  const inquiry = inquiries.find((i) => i.row === rowNum)
  if (!inquiry) {
    return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
  }

  // Save recommendation to Sheet1 col M (Notes)
  const noteText = [
    `[PropertyOps Agent: ${action.toUpperCase()}]`,
    reasoning,
    notes,
  ]
    .filter(Boolean)
    .join(' — ')

  try {
    await updateInquiryStatus(rowNum, inquiry.status, inquiry.bookingId, noteText)
  } catch (err) {
    console.error('[recommend] Sheet update error:', err)
    // Non-critical — continue to send email
  }

  // Email owner with PropertyOps Agent's recommendation
  try {
    const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')
    const fromAddress = process.env.RESEND_FROM_EMAIL || PROPERTY_CONFIG.email
    const ownerEmail = process.env.RESEND_TO_EMAIL || PROPERTY_CONFIG.email

    const badgeColor =
      action === 'approve' ? '#16a34a' : action === 'reject' ? '#dc2626' : '#d97706'
    const badgeLabel =
      action === 'approve'
        ? '✅ Recommends APPROVE'
        : action === 'reject'
        ? '❌ Recommends REJECT'
        : '⚠️ Needs Your Review'
    const stayLabel =
      inquiry.stayType === 'daytrip' ? 'Day Trip (9AM–5PM)' : 'Overnight'
    const dateRange =
      inquiry.checkOut && inquiry.checkOut !== inquiry.checkIn
        ? `${inquiry.checkIn} → ${inquiry.checkOut}`
        : inquiry.checkIn

    await resend.emails.send({
      from: `Your Property <${fromAddress}>`,
      to: [ownerEmail],
      subject: `PropertyOps Agent: ${badgeLabel.replace(/^[^\w]+/, '')} — ${inquiry.name} · ${inquiry.checkIn}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family:Georgia,serif;color:#1a1a1a;max-width:600px;margin:0 auto;padding:0;">

          <!-- Header -->
          <div style="background:#1E6B7B;padding:24px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:0.05em;">Your Property</h1>
            <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;">PropertyOps Agent · Hospitality Agent</p>
          </div>

          <!-- Recommendation badge -->
          <div style="background:${badgeColor}10;border-bottom:3px solid ${badgeColor};padding:16px 24px;text-align:center;">
            <p style="margin:0;font-size:18px;font-weight:bold;color:${badgeColor};">${badgeLabel}</p>
          </div>

          <!-- Body -->
          <div style="padding:24px;">

            <!-- Inquiry summary -->
            <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
              ${[
                ['Guest', inquiry.name],
                ['Email', `<a href="mailto:${inquiry.email}" style="color:#1E6B7B;">${inquiry.email}</a>`],
                ['Phone', inquiry.phone || '—'],
                ['Dates', dateRange],
                ['Stay', stayLabel],
                ['Guests', `${inquiry.headcount} pax`],
                ['Estimate', inquiry.estimatedTotal ? inquiry.estimatedTotal.replace('Estimated total: ', '') : '—'],
                ['Message', inquiry.message || '—'],
              ]
                .map(
                  ([label, value]) => `
                <tr>
                  <td style="padding:7px 12px;background:#f5f5f0;font-weight:600;width:100px;vertical-align:top;font-size:13px;">${label}</td>
                  <td style="padding:7px 12px;">${value}</td>
                </tr>`
                )
                .join('')}
            </table>

            <!-- PropertyOps Agent's reasoning -->
            ${
              reasoning
                ? `<div style="background:#f9f8f5;border-left:4px solid #1E6B7B;padding:14px 18px;border-radius:0 6px 6px 0;margin-bottom:20px;">
                    <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#888;">PropertyOps Agent's Analysis</p>
                    <p style="margin:0;font-size:14px;line-height:1.7;color:#333;">${reasoning}</p>
                  </div>`
                : ''
            }

            <!-- CTA -->
            <div style="text-align:center;margin:28px 0 12px;">
              <a
                href="https://yourproperty.com/admin"
                style="display:inline-block;background:#1E6B7B;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:600;letter-spacing:0.02em;"
              >
                Open Admin Dashboard →
              </a>
            </div>
            <p style="text-align:center;font-size:12px;color:#aaa;margin:0;">
              Log in to approve or reject this inquiry.
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#f5f5f0;padding:16px 24px;text-align:center;border-top:1px solid #e8e5de;">
            <p style="margin:0;font-size:11px;color:#bbb;">
              Sent by PropertyOps Agent · Your Property hospitality agent · <a href="https://yourproperty.com" style="color:#1E6B7B;text-decoration:none;">yourproperty.com</a>
            </p>
          </div>
        </body>
        </html>
      `,
    })
  } catch (err) {
    console.error('[recommend] Email error:', err)
    // Non-critical
  }

  return NextResponse.json({
    success: true,
    row: rowNum,
    action,
    reasoning,
  })
}
