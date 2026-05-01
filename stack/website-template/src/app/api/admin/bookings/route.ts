import { NextRequest, NextResponse } from 'next/server'
import { getAllBookings, createBooking } from '@/lib/bookings'
import type { StayType } from '@/lib/types'

export async function GET() {
  try {
    const bookings = await getAllBookings()
    return NextResponse.json({ bookings })
  } catch (err) {
    console.error('[admin/bookings] GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  let body: {
    checkIn: string
    checkOut: string
    guestName: string
    guestEmail?: string
    headcount: number
    stayType: StayType
    notes?: string
    total?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.checkIn || !body.checkOut || !body.guestName) {
    return NextResponse.json(
      { error: 'checkIn, checkOut, and guestName are required' },
      { status: 400 }
    )
  }

  try {
    const booking = await createBooking({
      ...body,
      source: 'manual',
    })
    return NextResponse.json({ booking }, { status: 201 })
  } catch (err) {
    console.error('[admin/bookings] POST error:', err)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
