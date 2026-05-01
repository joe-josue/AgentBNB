import { NextRequest, NextResponse } from 'next/server'
import { getAllBookings } from '@/lib/bookings'
import { getAllInquiries } from '@/lib/sheets'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month') // YYYY-MM

  try {
    const [bookings, inquiries] = await Promise.all([
      getAllBookings(),
      getAllInquiries(),
    ])

    // Filter by month if provided
    const filteredBookings = month
      ? bookings.filter(
          (b) => b.checkIn.startsWith(month) || b.checkOut.startsWith(month)
        )
      : bookings

    const pendingInquiries = inquiries.filter((i) => i.status === 'Pending')
    const filteredInquiries = month
      ? pendingInquiries.filter(
          (i) => i.checkIn.startsWith(month) || i.checkOut?.startsWith(month)
        )
      : pendingInquiries

    // Build blocked date ranges from bookings
    const blocked = filteredBookings.map((b) => ({
      start: b.checkIn,
      end: b.checkOut,
      bookingId: b.id,
      guestName: b.guestName,
    }))

    return NextResponse.json({
      month: month ?? null,
      blocked,
      bookings: filteredBookings,
      inquiries: filteredInquiries,
    })
  } catch (err) {
    console.error('[admin/calendar] GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch calendar' }, { status: 500 })
  }
}
