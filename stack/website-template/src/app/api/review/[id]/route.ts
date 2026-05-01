import { NextRequest, NextResponse } from 'next/server'
import { updateBookingReview, getAllBookings } from '@/lib/bookings'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { rating, review } = await req.json()

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    const booking = await updateBookingReview(id, rating, review || '')
    return NextResponse.json({ success: true, booking })
  } catch (err) {
    console.error('[review] error:', err)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const bookings = await getAllBookings()
    const booking = bookings.find(b => b.id === id)
    
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Return limited info for the guest
    return NextResponse.json({
      guestName: booking.guestName,
      checkIn: booking.checkIn,
      alreadyReviewed: !!booking.rating
    })
  } catch (error) {
    console.error('[review GET] error:', error)
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
  }
}
