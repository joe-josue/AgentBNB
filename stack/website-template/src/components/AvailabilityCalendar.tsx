'use client'

import { useEffect, useState } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { Info } from 'lucide-react'

interface AvailabilityData {
  blocked: { start: string; end: string }[]
  status: 'ok' | 'unconfigured' | 'error'
}

interface Props {
  selected: DateRange | undefined
  onSelect: (range: DateRange | undefined) => void
  mode?: 'range' | 'single'
}

export function AvailabilityCalendar({ selected, onSelect, mode = 'range' }: Props) {
  const [blockedDates, setBlockedDates] = useState<Date[]>([])
  const [calendarStatus, setCalendarStatus] = useState<'loading' | 'ok' | 'unconfigured' | 'error'>('loading')

  useEffect(() => {
    fetch('/api/availability')
      .then((r) => r.json())
      .then((data: AvailabilityData) => {
        const dates: Date[] = []
        for (const range of data.blocked) {
          const start = new Date(range.start)
          const end = new Date(range.end)
          const cur = new Date(start)
          while (cur < end) {
            dates.push(new Date(cur))
            cur.setDate(cur.getDate() + 1)
          }
        }
        setBlockedDates(dates)
        setCalendarStatus(data.status)
      })
      .catch(() => setCalendarStatus('error'))
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div>
      {calendarStatus === 'unconfigured' && (
        <div className="flex items-start gap-2 mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20 text-sm font-sans text-muted-foreground">
          <Info size={15} className="text-primary mt-0.5 shrink-0" />
          <span>
            Live calendar syncing soon — select your preferred dates to include in your inquiry.
          </span>
        </div>
      )}

      <DayPicker
        mode={mode as 'range'}
        selected={selected}
        onSelect={onSelect as (range: DateRange | undefined) => void}
        disabled={[
          { before: today },
          ...blockedDates,
        ]}
        numberOfMonths={1}
        showOutsideDays={false}
        className="!font-sans"
        classNames={{
          months: 'flex flex-col',
          month: 'space-y-4',
          caption: 'flex justify-center pt-1 relative items-center',
          caption_label: 'font-serif text-base text-ink',
          nav: 'space-x-1 flex items-center',
          nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-border rounded-md inline-flex items-center justify-center',
          nav_button_previous: 'absolute left-1',
          nav_button_next: 'absolute right-1',
          table: 'w-full border-collapse space-y-1',
          head_row: 'flex',
          head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-xs flex-1 text-center',
          row: 'flex w-full mt-2',
          cell: 'flex-1 text-center text-sm p-0 relative',
          day: 'h-9 w-9 mx-auto p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-primary/10 hover:text-primary transition-colors',
          day_selected: '!bg-primary !text-white hover:!bg-primary-dark',
          day_today: 'bg-muted font-medium',
          day_outside: 'opacity-30',
          day_disabled: 'opacity-30 cursor-not-allowed line-through',
          day_range_middle: '!bg-primary/10 !text-primary rounded-none',
          day_range_start: '!bg-primary !text-white !rounded-l-md',
          day_range_end: '!bg-primary !text-white !rounded-r-md',
          day_hidden: 'invisible',
        }}
      />
    </div>
  )
}
