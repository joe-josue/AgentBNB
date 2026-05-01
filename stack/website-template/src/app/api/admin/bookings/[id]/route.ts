import { NextRequest, NextResponse } from 'next/server'
import { deleteBooking, getAllBookings, updateBookingNotes } from '@/lib/bookings'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const bookings = await getAllBookings()
    const booking = bookings.find((b) => b.id === id)
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    return NextResponse.json({ booking })
  } catch (err) {
    console.error('[admin/bookings/[id]] GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  let body: { notes?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (typeof body.notes !== 'string') {
    return NextResponse.json({ error: 'notes is required' }, { status: 400 })
  }

  try {
    const booking = await updateBookingNotes(id, body.notes)
    return NextResponse.json({ booking })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update booking'
    console.error('[admin/bookings/[id]] PATCH error:', err)
    return NextResponse.json({ error: msg }, { status: 404 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    await deleteBooking(id)
    return NextResponse.json({ success: true, deleted: id })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to delete booking'
    console.error('[admin/bookings/[id]] DELETE error:', err)
    return NextResponse.json({ error: msg }, { status: 404 })
  }
}
