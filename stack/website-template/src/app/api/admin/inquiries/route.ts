import { NextResponse } from 'next/server'
import { getAllInquiries } from '@/lib/sheets'

export async function GET() {
  try {
    const inquiries = await getAllInquiries()
    return NextResponse.json({ inquiries })
  } catch (err) {
    console.error('[admin/inquiries] GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 })
  }
}
