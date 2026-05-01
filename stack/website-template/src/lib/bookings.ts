import { google } from 'googleapis'
import { v4 as uuidv4 } from 'uuid'
import type { Booking, NewBooking, BlockedDateRange } from './types'

// Re-use the same auth helper pattern as sheets.ts
function getAuth() {
  const b64 = process.env.GOOGLE_CREDENTIALS_BASE64
  if (!b64) throw new Error('Missing GOOGLE_CREDENTIALS_BASE64')
  const creds = JSON.parse(Buffer.from(b64, 'base64').toString('utf-8'))
  return new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

function getSheetId(): string {
  const id = process.env.GOOGLE_SHEETS_ID
  if (!id) throw new Error('Missing GOOGLE_SHEETS_ID')
  return id
}

const BOOKING_HEADERS = [
  'Booking ID',
  'Check-in',
  'Check-out',
  'Guest Name',
  'Guest Email',
  'Headcount',
  'Stay Type',
  'Total',
  'Source',
  'Inquiry Row',
  'Notes',
  'Thank You Sent',
  'Rating',
  'Review',
  'Created At',
]

function phTimestamp(): string {
  return new Date().toLocaleString('en-PH', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function ensureBookingsTab(
  sheets: ReturnType<typeof google.sheets>,
  sheetId: string
) {
  // Check if Sheet2 (Bookings) exists; create if not
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId })
  const exists = meta.data.sheets?.some(
    (s) => s.properties?.title === 'Bookings'
  )

  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: 'Bookings' } } }],
      },
    })
    // Write header row
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'Bookings!A1',
      valueInputOption: 'RAW',
      requestBody: { values: [BOOKING_HEADERS] },
    })
    return
  }

  // Ensure header exists
  const header = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Bookings!A1:L1',
  })
  if (!header.data.values?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'Bookings!A1',
      valueInputOption: 'RAW',
      requestBody: { values: [BOOKING_HEADERS] },
    })
  }
}

function rowToBooking(row: string[]): Booking | null {
  if (!row[0]) return null
  return {
    id: row[0] ?? '',
    checkIn: row[1] ?? '',
    checkOut: row[2] ?? '',
    guestName: row[3] ?? '',
    guestEmail: row[4] ?? '',
    headcount: parseInt(row[5] ?? '0', 10) || 0,
    stayType: (row[6] === 'Day Trip' ? 'daytrip' : 'overnight') as Booking['stayType'],
    total: row[7] ?? '',
    source: (row[8] as Booking['source']) ?? 'manual',
    inquiryRow: row[9] ? parseInt(row[9], 10) : undefined,
    notes: row[10] || undefined,
    thankYouSentAt: row[11] || undefined,
    rating: row[12] ? parseInt(row[12], 10) : undefined,
    review: row[13] || undefined,
    createdAt: row[14] ?? '',
  }
}

export async function getAllBookings(): Promise<Booking[]> {
  const sheetId = getSheetId()
  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  await ensureBookingsTab(sheets, sheetId)

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Bookings!A:O',
  })

  const rows = res.data.values ?? []
  if (rows.length <= 1) return [] // only header or empty

  return rows
    .slice(1) // skip header
    .map((row) => rowToBooking(row as string[]))
    .filter((b): b is Booking => b !== null)
}

export async function createBooking(data: NewBooking): Promise<Booking> {
  const sheetId = getSheetId()
  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  await ensureBookingsTab(sheets, sheetId)

  const id = uuidv4()
  const createdAt = phTimestamp()

  const row = [
    id,
    data.checkIn,
    data.checkOut,
    data.guestName,
    data.guestEmail ?? '',
    String(data.headcount),
    data.stayType === 'daytrip' ? 'Day Trip' : 'Overnight',
    data.total ?? '',
    data.source ?? 'direct',
    data.inquiryRow ? String(data.inquiryRow) : '',
    data.notes ?? '',
    '', // thankYouSentAt
    '', // rating
    '', // review
    createdAt,
  ]

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Bookings!A:O',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  })

  return {
    id,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    guestName: data.guestName,
    guestEmail: data.guestEmail ?? '',
    headcount: data.headcount,
    stayType: data.stayType,
    total: data.total ?? '',
    source: data.source ?? 'direct',
    inquiryRow: data.inquiryRow,
    notes: data.notes,
    createdAt,
  }
}

export async function updateBookingNotes(
  bookingId: string,
  notes: string
): Promise<Booking> {
  const sheetId = getSheetId()
  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  await ensureBookingsTab(sheets, sheetId)

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Bookings!A:L',
  })

  const rows = res.data.values ?? []
  const rowIndex = rows.findIndex((r) => r[0] === bookingId)
  if (rowIndex <= 0) throw new Error(`Booking ${bookingId} not found`)

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `Bookings!K${rowIndex + 1}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[notes]],
    },
  })

  const updatedRow = [...(rows[rowIndex] as string[])]
  updatedRow[10] = notes
  const booking = rowToBooking(updatedRow)
  if (!booking) throw new Error(`Booking ${bookingId} not found after update`)
  return booking
}

export async function updateBookingThankYouSent(
  bookingId: string
): Promise<Booking> {
  const sheetId = getSheetId()
  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Bookings!A:O',
  })

  const rows = res.data.values ?? []
  const rowIndex = rows.findIndex((r) => r[0] === bookingId)
  if (rowIndex <= 0) throw new Error(`Booking ${bookingId} not found`)

  const timestamp = phTimestamp()
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `Bookings!L${rowIndex + 1}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[timestamp]],
    },
  })

  const updatedRow = [...(rows[rowIndex] as string[])]
  updatedRow[11] = timestamp
  const booking = rowToBooking(updatedRow)
  if (!booking) throw new Error(`Booking ${bookingId} not found after update`)
  return booking
}

export async function updateBookingReview(
  bookingId: string,
  rating: number,
  review: string
): Promise<Booking> {
  const sheetId = getSheetId()
  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Bookings!A:O',
  })

  const rows = res.data.values ?? []
  const rowIndex = rows.findIndex((r) => r[0] === bookingId)
  if (rowIndex <= 0) throw new Error(`Booking ${bookingId} not found`)

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `Bookings!M${rowIndex + 1}:N${rowIndex + 1}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[rating, review]],
    },
  })

  const updatedRow = [...(rows[rowIndex] as string[])]
  updatedRow[12] = String(rating)
  updatedRow[13] = review
  const booking = rowToBooking(updatedRow)
  if (!booking) throw new Error(`Booking ${bookingId} not found after update`)
  return booking
}

export async function deleteBooking(bookingId: string): Promise<void> {
  const sheetId = getSheetId()
  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Bookings!A:O',
  })

  const rows = res.data.values ?? []
  const rowIndex = rows.findIndex((r) => r[0] === bookingId)
  if (rowIndex === -1) throw new Error(`Booking ${bookingId} not found`)

  // Get the sheet ID for batchUpdate
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId })
  const sheet = meta.data.sheets?.find(
    (s) => s.properties?.title === 'Bookings'
  )
  const sheetGid = sheet?.properties?.sheetId ?? 0

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: sheetGid,
              dimension: 'ROWS',
              startIndex: rowIndex,
              endIndex: rowIndex + 1,
            },
          },
        },
      ],
    },
  })
}

export async function getBlockedDateRanges(): Promise<BlockedDateRange[]> {
  try {
    const bookings = await getAllBookings()
    return bookings.map((b) => ({
      start: new Date(b.checkIn),
      end: new Date(b.checkOut || b.checkIn),
      source: 'manual' as const,
    }))
  } catch {
    return []
  }
}
