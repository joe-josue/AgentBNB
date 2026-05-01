import { NextResponse } from 'next/server'
import { fetchBlockedDates } from '@/lib/ical'
import { getBlockedDateRanges } from '@/lib/bookings'

// Cache for 15 minutes — refreshes on next request after expiry
export const revalidate = 900

export async function GET() {
  try {
    const [icalBlocked, manualBlocked] = await Promise.all([
      fetchBlockedDates(),
      getBlockedDateRanges(),
    ])

    const blocked = [...icalBlocked, ...manualBlocked]

    const hasConfig =
      process.env.AIRBNB_ICAL_URL || process.env.BOOKING_ICAL_URL

    return NextResponse.json({
      blocked: blocked.map((r) => ({
        start: r.start.toISOString(),
        end: r.end.toISOString(),
        source: r.source,
      })),
      status: hasConfig ? 'ok' : 'unconfigured',
    })
  } catch {
    // Always return 200 — never let a calendar failure break the UI
    return NextResponse.json({ blocked: [], status: 'error' })
  }
}
