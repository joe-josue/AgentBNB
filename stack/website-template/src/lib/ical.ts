// ──────────────────────────────────────────────────────────────────────────────
// iCal Integration — STUB (Phase 1)
//
// Full iCal parsing via node-ical will be wired in a future phase once
// Airbnb and Booking.com listings are live and iCal URLs are available.
//
// The function signatures below are final. When iCal is activated:
//   1. npm install node-ical && npm install -D @types/node-ical
//   2. Replace the stub bodies below with real parsing logic
//   3. Add AIRBNB_ICAL_URL + BOOKING_ICAL_URL to Vercel env vars
//
// No changes needed in the API route or calendar components.
// ──────────────────────────────────────────────────────────────────────────────

import type { BlockedDateRange } from './types'

export async function fetchBlockedDates(): Promise<BlockedDateRange[]> {
  // STUB: returns empty — all dates appear available until iCal is wired
  return []
}

export function isDateBlocked(
  date: Date,
  ranges: BlockedDateRange[]
): boolean {
  return ranges.some((range) => date >= range.start && date < range.end)
}
