import {
  getDay,
  getMonth,
  getDate,
  getYear,
  eachDayOfInterval,
  differenceInCalendarDays,
} from 'date-fns'
import type { DayType, NightBreakdown, PriceBreakdown, StayType } from './types'

import PRICING_CONFIG from './pricing.config.json'

// ─── Rate Tables ─────────────────────────────────────────────────────────────

const FULL_RATES: Record<DayType, number> = PRICING_CONFIG.overnight.full as Record<DayType, number>
const SOFT_RATES: Record<DayType, number> = PRICING_CONFIG.overnight.soft as Record<DayType, number>

// Daytrip rates are not discounted during soft launch
const DAYTRIP_RATES: Record<DayType, number> = PRICING_CONFIG.daytrip as unknown as Record<DayType, number>

// Friday gets its own daytrip rate
const DAYTRIP_FRIDAY_RATE = PRICING_CONFIG.daytrip.friday

// ─── Holiday / Peak Detection ─────────────────────────────────────────────────

// Returns true for Philippine national holidays and peak periods
function isPeakSeason(date: Date): boolean {
  const month = getMonth(date) // 0-indexed
  const day = getDate(date)

  // Dec 15 – Jan 5
  if (month === 11 && day >= 15) return true
  if (month === 0 && day <= 5) return true

  return false
}

function isHoliday(date: Date): boolean {
  if (isPeakSeason(date)) return false // peak takes precedence
  const month = getMonth(date)
  const day = getDate(date)

  // Fixed national holidays (PH)
  const fixed: [number, number][] = [
    [0, 1],   // New Year's Day
    [1, 25],  // EDSA Revolution (Feb 25)
    [4, 1],   // Labor Day
    [5, 12],  // Independence Day
    [7, 21],  // Ninoy Aquino Day (Aug 21) – moved to nearest Monday sometimes, keep fixed
    [10, 30], // Bonifacio Day
    [11, 24], // Christmas Eve
    [11, 25], // Christmas Day
    [11, 30], // Rizal Day
    [11, 31], // New Year's Eve
  ]

  if (fixed.some(([m, d]) => m === month && d === day)) return true

  // National Heroes Day: last Monday of August
  if (month === 7) {
    const dow = getDay(date)
    if (dow === 1) {
      // Check if it's the last Monday: next Monday would be in September
      const nextMonday = new Date(date)
      nextMonday.setDate(day + 7)
      if (getMonth(nextMonday) !== 7) return true
    }
  }

  return false
}

// Holy Week approximation: Palm Sunday to Easter Sunday
// Easter algorithm (Anonymous Gregorian)
function getEaster(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1 // 0-indexed
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month, day)
}

function isHolyWeek(date: Date): boolean {
  const year = getYear(date)
  const easter = getEaster(year)
  const palmSunday = new Date(easter)
  palmSunday.setDate(easter.getDate() - 7)
  return date >= palmSunday && date <= easter
}

// ─── Day Type Classification ──────────────────────────────────────────────────

function getDayType(date: Date): DayType {
  if (isPeakSeason(date) || isHolyWeek(date)) return 'peak'
  if (isHoliday(date)) return 'holiday'
  const dow = getDay(date) // 0 = Sun, 6 = Sat
  if (dow === 6) return 'saturday'
  if (dow === 5 || dow === 0) return 'friday-sunday'
  return 'weekday'
}

function getDayLabel(date: Date): string {
  return date.toLocaleDateString('en-PH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

// ─── Length-of-Stay Discount ──────────────────────────────────────────────────

function getLosDiscountPct(nights: number): number {
  if (nights >= 4) return 0.12
  if (nights >= 3) return 0.08
  return 0
}

// ─── Main Calculation ─────────────────────────────────────────────────────────

export function calculateStay(
  checkIn: Date,
  checkOut: Date,
  headcount: number,
  stayType: StayType,
  softOpening: boolean
): PriceBreakdown {
  const rates = softOpening ? SOFT_RATES : FULL_RATES

  if (stayType === 'daytrip') {
    const dayType = getDayType(checkIn)
    const dow = getDay(checkIn)
    const baseRate =
      dow === 5
        ? DAYTRIP_FRIDAY_RATE
        : DAYTRIP_RATES[dayType]

    const excessPaxFee = Math.max(0, headcount - 10) * 500

    const breakdownItem: NightBreakdown = {
      date: checkIn,
      dayType,
      baseRate,
      label: getDayLabel(checkIn),
    }

    return {
      stayType: 'daytrip',
      nights: 0,
      baseTotal: baseRate,
      losDiscount: 0,
      losDiscountPct: 0,
      excessPaxFee,
      finalTotal: baseRate + excessPaxFee,
      perNightAverage: baseRate,
      breakdown: [breakdownItem],
      isSoftOpeningPrice: false, // daytrip not discounted
    }
  }

  // Overnight: each night = the check-in date of that night
  const nights = differenceInCalendarDays(checkOut, checkIn)
  if (nights <= 0) {
    return {
      stayType: 'overnight',
      nights: 0,
      baseTotal: 0,
      losDiscount: 0,
      losDiscountPct: 0,
      excessPaxFee: 0,
      finalTotal: 0,
      perNightAverage: 0,
      breakdown: [],
      isSoftOpeningPrice: softOpening,
    }
  }

  const nightDates = eachDayOfInterval({ start: checkIn, end: checkOut }).slice(
    0,
    nights
  )

  const breakdown: NightBreakdown[] = nightDates.map((date) => {
    const dayType = getDayType(date)
    return {
      date,
      dayType,
      baseRate: rates[dayType],
      label: getDayLabel(date),
    }
  })

  const baseTotal = breakdown.reduce((sum, n) => sum + n.baseRate, 0)
  const losDiscountPct = getLosDiscountPct(nights)
  const losDiscount = Math.round(baseTotal * losDiscountPct)
  const excessPaxFee = Math.max(0, headcount - 10) * 500
  const finalTotal = baseTotal - losDiscount + excessPaxFee

  return {
    stayType: 'overnight',
    nights,
    baseTotal,
    losDiscount,
    losDiscountPct,
    excessPaxFee,
    finalTotal,
    perNightAverage: Math.round(finalTotal / nights),
    breakdown,
    isSoftOpeningPrice: softOpening,
  }
}

// ─── Currency Formatter ───────────────────────────────────────────────────────

export function formatPHP(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(amount)
}
