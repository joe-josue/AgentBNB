import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getAllBookings, updateBookingNotes } from '@/lib/bookings'

function extractEmailAddress(value: string | undefined): string {
  if (!value) return ''
  const match = value.match(/<([^>]+)>/)
  return (match?.[1] || value).trim().toLowerCase()
}

function normalizeText(value: string | null | undefined): string {
  return (value || '').replace(/\r\n/g, '\n').trim()
}

function buildUpdatedNotes(existingNotes: string | undefined, email: {
  from: string
  subject: string
  text: string
  createdAt?: string
}): string {
  const parts = []

  if (existingNotes?.trim()) {
    parts.push(existingNotes.trim())
  }

  const headerBits = [
    'Guest email update',
    email.createdAt ? `(${email.createdAt})` : '',
  ].filter(Boolean)

  const lines = [
    `\n---\n${headerBits.join(' ')}`,
    `From: ${email.from}`,
    `Subject: ${email.subject || '(no subject)'}`,
    email.text ? `\n${email.text}` : '\n(No text body captured)',
  ]

  parts.push(lines.join('\n'))
  return parts.join('\n')
}

function findBookingIdInText(...values: string[]): string | undefined {
  for (const value of values) {
    const match = value.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i)
    if (match) return match[0]
  }
  return undefined
}

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')
  const secret = process.env.RESEND_WEBHOOK_SECRET

  if (!secret) {
    console.error('[admin/inbound-email] Missing RESEND_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const payload = await req.text()

  let event: { type?: string; data?: { email_id?: string; id?: string } }
  try {
    const id = req.headers.get('svix-id') || ''
    const timestamp = req.headers.get('svix-timestamp') || ''
    const signature = req.headers.get('svix-signature') || ''

    event = resend.webhooks.verify({
      payload,
      headers: {
        id,
        timestamp,
        signature,
      },
      webhookSecret: secret,
    })
  } catch (err) {
    console.error('[admin/inbound-email] Invalid webhook signature:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  if (event.type !== 'email.received') {
    return NextResponse.json({ success: true, ignored: event.type || 'unknown' })
  }

  try {
    const emailId = event.data?.email_id || event.data?.id
    if (!emailId) {
      return NextResponse.json({ error: 'Missing email id' }, { status: 400 })
    }

    const { data: email, error } = await resend.emails.receiving.get(emailId)
    if (error || !email) {
      console.error('[admin/inbound-email] Failed to retrieve email:', error)
      return NextResponse.json({ error: 'Failed to retrieve email' }, { status: 500 })
    }

    const from = extractEmailAddress(email.from)
    const subject = normalizeText(email.subject)
    const text = normalizeText(email.text)
    const bookingId = findBookingIdInText(subject, text)

    const bookings = await getAllBookings()

    let matched = bookingId
      ? bookings.find((booking) => booking.id.toLowerCase() === bookingId.toLowerCase())
      : undefined

    if (!matched && from) {
      const candidates = bookings.filter(
        (booking) => booking.guestEmail?.trim().toLowerCase() === from
      )
      matched = candidates.sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
    }

    if (!matched) {
      console.warn('[admin/inbound-email] No booking match found', {
        from,
        subject,
        emailId,
      })
      return NextResponse.json({ success: true, matched: false, reason: 'no-booking-match' })
    }

    const notes = buildUpdatedNotes(matched.notes, {
      from,
      subject,
      text,
      createdAt: email.created_at,
    })

    const booking = await updateBookingNotes(matched.id, notes)

    return NextResponse.json({
      success: true,
      matched: true,
      bookingId: booking.id,
    })
  } catch (err) {
    console.error('[admin/inbound-email] Unexpected error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
