import { NextRequest, NextResponse } from 'next/server'
import { getAllBookings } from '@/lib/bookings'

// Runs daily at 12:00 UTC = 8:00 PM Manila time (Asia/Manila, UTC+8)
// Scheduled via vercel.json: { "crons": [{ "path": "/api/cron/checkout-reminder", "schedule": "0 12 * * *" }] }

export async function GET(req: NextRequest) {
  // Vercel cron requests include Authorization: Bearer <CRON_SECRET>
  // You can also call manually: /api/cron/checkout-reminder?secret=<CRON_SECRET>
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = req.headers.get('authorization')
    const querySecret = new URL(req.url).searchParams.get('secret')
    if (authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const discordToken = process.env.DISCORD_BOT_TOKEN
  const discordChannel = process.env.DISCORD_CHANNEL_ID
  if (!discordToken || !discordChannel) {
    console.warn('[checkout-reminder] Discord env vars not set — skipping')
    return NextResponse.json({ skipped: true, reason: 'Discord not configured' })
  }

  // Today in Manila time (UTC+8)
  const nowManila = new Date(Date.now() + 8 * 60 * 60 * 1000)
  const todayStr = nowManila.toISOString().slice(0, 10)

  const bookings = await getAllBookings()
  const checkingOutToday = bookings.filter((b) => {
    const lastDay = b.checkOut || b.checkIn
    return lastDay === todayStr
  })

  if (checkingOutToday.length === 0) {
    console.log(`[checkout-reminder] No checkouts today (${todayStr})`)
    return NextResponse.json({ sent: 0, date: todayStr })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourproperty.com'
  const googleReviewUrl = 'https://g.page/r/CRJbdr4La0EwEBM/review'

  for (const booking of checkingOutToday) {
    const stayLabel = booking.stayType === 'daytrip' ? 'Day Trip' : 'Overnight'
    const alreadyThanked = !!booking.thankYouSentAt
    const privateFeedbackUrl = `${siteUrl}/review/${booking.id}`
    const dateRange = booking.checkOut
      ? `${booking.checkIn} → ${booking.checkOut}`
      : booking.checkIn

    const content = alreadyThanked
      ? `📬 **Reminder:** Thank-you email already sent to **${booking.guestName}**. Check if they've left a Google Review!`
      : `🏖️ **${booking.guestName}** checks out today — send the thank-you email so they can leave a Google Review!\n\n**Admin:** ${siteUrl}/admin`

    await fetch(`https://discord.com/api/v10/channels/${discordChannel}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${discordToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        embeds: [{
          title: `🔔 Checkout Day — ${booking.guestName}`,
          color: alreadyThanked ? 0x16a34a : 0x1E6B7B,
          fields: [
            { name: 'Dates', value: dateRange, inline: true },
            { name: 'Stay', value: stayLabel, inline: true },
            { name: 'Pax', value: String(booking.headcount), inline: true },
            { name: 'Thank-you sent?', value: alreadyThanked ? `✅ Yes (${booking.thankYouSentAt})` : '❌ Not yet', inline: false },
            { name: '⭐ Google Review', value: googleReviewUrl, inline: false },
            { name: '🔒 Private feedback form', value: privateFeedbackUrl, inline: false },
          ],
          footer: { text: `Booking ID: ${booking.id}` },
          timestamp: new Date().toISOString(),
        }],
      }),
    }).catch((err) => console.error('[checkout-reminder] Discord error:', err))
  }

  console.log(`[checkout-reminder] Sent ${checkingOutToday.length} reminder(s) for ${todayStr}`)
  return NextResponse.json({ sent: checkingOutToday.length, date: todayStr })
}
