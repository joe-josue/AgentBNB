'use client'

import { useState } from 'react'
import { type DateRange } from 'react-day-picker'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar'
import { calculateStay, formatPHP } from '@/lib/pricing'
import { SOFT_OPENING, KNOWN_ISSUES } from '@/lib/config'
import type { StayType, PriceBreakdown } from '@/lib/types'
import { Tag, CalendarDays, Users } from 'lucide-react'

interface Props {
  onInquire?: (params: { checkIn?: string; checkOut?: string; headcount: number; stayType: StayType }) => void
}

function formatDateForInput(date: Date | undefined): string | undefined {
  if (!date) return undefined

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function PricingCalculator({ onInquire }: Props) {
  const [stayType, setStayType] = useState<StayType>('overnight')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [headcount, setHeadcount] = useState(4)
  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null)

  const handleDateChange = (range: DateRange | undefined) => {
    if (stayType === 'daytrip') {
      // For daytrip, always use the most recently clicked date (single selection)
      const date = range?.to || range?.from
      if (date) {
        const singleRange = { from: date, to: undefined }
        setDateRange(singleRange)
        setBreakdown(calculateStay(date, date, headcount, 'daytrip', SOFT_OPENING))
      } else {
        setDateRange(undefined)
        setBreakdown(null)
      }
    } else if (range?.from && range?.to) {
      setDateRange(range)
      setBreakdown(calculateStay(range.from, range.to, headcount, 'overnight', SOFT_OPENING))
    } else {
      setDateRange(range)
      setBreakdown(null)
    }
  }

  const handleHeadcountChange = (val: string) => {
    const n = parseInt(val)
    setHeadcount(n)
    if (stayType === 'overnight' && dateRange?.from && dateRange?.to) {
      setBreakdown(calculateStay(dateRange.from, dateRange.to, n, 'overnight', SOFT_OPENING))
    } else if (stayType === 'daytrip' && dateRange?.from) {
      setBreakdown(calculateStay(dateRange.from, dateRange.from, n, 'daytrip', SOFT_OPENING))
    }
  }

  const handleStayTypeChange = (val: string) => {
    const type = val as StayType
    setStayType(type)
    setDateRange(undefined)
    setBreakdown(null)
  }

  const handleInquire = () => {
    if (onInquire) {
      const checkIn = formatDateForInput(dateRange?.from)
      onInquire({
        checkIn,
        checkOut: stayType === 'daytrip' ? '' : formatDateForInput(dateRange?.to),
        headcount,
        stayType,
      })
    }
    const el = document.getElementById('inquire')
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' })
  }

  const disclosureItems: string[] = []
  if (KNOWN_ISSUES.poolHeaterUnderRepair) disclosureItems.push('Pool heater under repair')
  if (KNOWN_ISSUES.jacuzziJetsUnderRepair) disclosureItems.push('Jacuzzi jets under repair')
  if (KNOWN_ISSUES.noWifi) disclosureItems.push('WiFi not yet available')

  return (
    <div className="space-y-6">
      {/* Stay type toggle */}
      <Tabs value={stayType} onValueChange={handleStayTypeChange}>
        <TabsList className="w-full">
          <TabsTrigger value="overnight" className="flex-1 font-sans">
            <CalendarDays size={14} className="mr-1.5" />
            Overnight
          </TabsTrigger>
          <TabsTrigger value="daytrip" className="flex-1 font-sans">
            <Tag size={14} className="mr-1.5" />
            Day Trip (9AM–5PM)
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Calendar */}
      <AvailabilityCalendar
        selected={dateRange}
        onSelect={handleDateChange}
        mode={stayType === 'daytrip' ? 'single' : 'range'}
      />

      {/* Headcount */}
      <div className="flex items-center gap-3">
        <Users size={16} className="text-muted-foreground shrink-0" />
        <label className="font-sans text-sm text-ink flex-1">Guests</label>
        <Select value={String(headcount)} onValueChange={handleHeadcountChange}>
          <SelectTrigger className="w-28 font-sans">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
              <SelectItem key={n} value={String(n)} className="font-sans">
                {n} {n === 1 ? 'guest' : 'guests'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price breakdown */}
      {breakdown && breakdown.finalTotal > 0 && (
        <div className="bg-background border border-border rounded-xl p-5 space-y-3">
          {/* Per-night breakdown */}
          {breakdown.breakdown.map((item, i) => (
            <div key={i} className="flex justify-between text-sm font-sans">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="text-ink">{formatPHP(item.baseRate)}</span>
            </div>
          ))}

          {/* LOS discount */}
          {breakdown.losDiscount > 0 && (
            <div className="flex justify-between text-sm font-sans text-primary border-t border-border pt-3">
              <span>{Math.round(breakdown.losDiscountPct * 100)}% length-of-stay discount</span>
              <span>−{formatPHP(breakdown.losDiscount)}</span>
            </div>
          )}

          {/* Excess pax */}
          {breakdown.excessPaxFee > 0 && (
            <div className="flex justify-between text-sm font-sans text-muted-foreground">
              <span>Excess pax fee ({headcount - 10} guests × ₱500)</span>
              <span>+{formatPHP(breakdown.excessPaxFee)}</span>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between font-sans font-medium text-base border-t border-border pt-3">
            <span className="text-ink">
              {breakdown.stayType === 'daytrip' ? 'Day trip total' : `Total for ${breakdown.nights} night${breakdown.nights > 1 ? 's' : ''}`}
            </span>
            <span className="text-primary text-lg font-serif">{formatPHP(breakdown.finalTotal)}</span>
          </div>

          {/* Soft opening badge */}
          {breakdown.isSoftOpeningPrice && (
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="outline" className="text-xs font-sans text-accent border-accent">
                Introductory discounted rate (best direct-book rate)
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Inquire CTA */}
      <Button
        onClick={handleInquire}
        className="w-full bg-primary text-white hover:bg-primary-dark font-sans py-5 text-base"
      >
        {dateRange?.from ? 'Inquire About These Dates' : 'Inquire Now'}
      </Button>

      {/* Disclosure */}
      {disclosureItems.length > 0 && (
        <p className="text-xs font-sans text-muted-foreground text-center">
          {disclosureItems.join(' · ')}
        </p>
      )}
    </div>
  )
}
