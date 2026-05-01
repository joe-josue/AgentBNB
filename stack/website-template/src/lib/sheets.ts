import { google } from 'googleapis'
import type { InquiryFormData, Inquiry, InquiryStatus } from './types'

const SHEET_HEADERS = [
  'Timestamp',
  'Name',
  'Email',
  'Phone',
  'Check-in',
  'Check-out',
  'Headcount',
  'Stay Type',
  'Message',
  'Estimated Total',
  'Status',
  'Booking ID',
  'Notes',
]

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

export async function appendInquiryToSheet(
  data: InquiryFormData,
  estimatedTotal: string
): Promise<number | undefined> {
  const sheetId = process.env.GOOGLE_SHEETS_ID
  if (!sheetId) throw new Error('Missing GOOGLE_SHEETS_ID')

  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  const timestamp = new Date().toLocaleString('en-PH', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  const row = [
    timestamp,
    data.name,
    data.email,
    data.phone || '',
    data.checkIn || '',
    data.checkOut || '',
    String(data.headcount || ''),
    data.stayType === 'daytrip' ? 'Day Trip' : 'Overnight',
    data.message || '',
    estimatedTotal,
    'Pending',  // K: Status
    '',         // L: Booking ID
    '',         // M: Notes
  ]

  // Ensure header row exists on first ever write
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A1:M1',
  })

  if (!existing.data.values?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: { values: [SHEET_HEADERS] },
    })
  }

  const appendRes = await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Sheet1!A:M',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  })

  // Extract the row number from the updated range (e.g. "Sheet1!A5:M5" → 5)
  const updatedRange = appendRes.data.updates?.updatedRange
  if (updatedRange) {
    const match = updatedRange.match(/(\d+):\w+(\d+)$/)
    if (match) return parseInt(match[2], 10)
  }
  return undefined
}

export async function getAllInquiries(): Promise<Inquiry[]> {
  const sheetId = process.env.GOOGLE_SHEETS_ID
  if (!sheetId) throw new Error('Missing GOOGLE_SHEETS_ID')

  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A:M',
  })

  const rows = res.data.values ?? []
  if (rows.length <= 1) return []

  return rows.slice(1).map((row, i): Inquiry => {
    const r = row as string[]
    return {
      row: i + 2, // 1-indexed, +1 for header row
      timestamp: r[0] ?? '',
      name: r[1] ?? '',
      email: r[2] ?? '',
      phone: r[3] ?? '',
      checkIn: r[4] ?? '',
      checkOut: r[5] ?? '',
      headcount: parseInt(r[6] ?? '1', 10) || 1,
      stayType: (r[7] === 'Day Trip' ? 'daytrip' : 'overnight') as Inquiry['stayType'],
      message: r[8] ?? '',
      estimatedTotal: r[9] ?? '',
      status: ((r[10] as InquiryStatus) || 'Pending'),
      bookingId: r[11] || undefined,
      notes: r[12] || undefined,
    }
  })
}

export async function updateInquiryStatus(
  row: number,
  status: InquiryStatus,
  bookingId?: string,
  notes?: string
): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEETS_ID
  if (!sheetId) throw new Error('Missing GOOGLE_SHEETS_ID')

  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  // Update columns K, L, M for the given row
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `Sheet1!K${row}:M${row}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[status, bookingId ?? '', notes ?? '']],
    },
  })
}
