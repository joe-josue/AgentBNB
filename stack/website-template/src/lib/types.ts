export type StayType = 'overnight' | 'daytrip'

export type DayType =
  | 'weekday'
  | 'friday-sunday'
  | 'saturday'
  | 'holiday'
  | 'peak'

export interface NightBreakdown {
  date: Date
  dayType: DayType
  baseRate: number
  label: string
}

export interface PriceBreakdown {
  stayType: StayType
  nights: number
  baseTotal: number
  losDiscount: number
  losDiscountPct: number
  excessPaxFee: number
  finalTotal: number
  perNightAverage: number
  breakdown: NightBreakdown[]
  isSoftOpeningPrice: boolean
}

export interface InquiryFormData {
  name: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  headcount: number
  stayType: StayType
  message: string
}

export interface BlockedDateRange {
  start: Date
  end: Date
  source: 'airbnb' | 'booking' | 'unknown' | 'manual'
}

// ─── Booking Management ───────────────────────────────────────────────────────

export type BookingSource = 'direct' | 'airbnb' | 'booking' | 'manual'
export type InquiryStatus = 'Pending' | 'Approved' | 'Rejected'

export interface Booking {
  id: string
  checkIn: string        // YYYY-MM-DD
  checkOut: string       // YYYY-MM-DD
  guestName: string
  guestEmail: string
  headcount: number
  stayType: StayType
  total: string
  source: BookingSource
  inquiryRow?: number
  notes?: string
  thankYouSentAt?: string
  rating?: number
  review?: string
  createdAt: string      // PH timestamp string
}

export interface NewBooking {
  checkIn: string
  checkOut: string
  guestName: string
  guestEmail?: string
  headcount: number
  stayType: StayType
  total?: string
  source?: BookingSource
  inquiryRow?: number
  notes?: string
}

export interface Inquiry {
  row: number
  timestamp: string
  name: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  headcount: number
  stayType: StayType
  message: string
  estimatedTotal: string
  status: InquiryStatus
  bookingId?: string
  notes?: string
}
