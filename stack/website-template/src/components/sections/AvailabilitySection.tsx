'use client'

import { motion } from 'framer-motion'
import { fadeUp, viewportOnce } from '@/lib/animations'
import { PricingCalculator } from '@/components/PricingCalculator'
import type { StayType } from '@/lib/types'
import { SOFT_OPENING } from '@/lib/config'
import { formatPHP } from '@/lib/pricing'
import PRICING_CONFIG from '@/lib/pricing.config.json'

interface InquireParams {
  checkIn?: string
  checkOut?: string
  headcount: number
  stayType: StayType
}

interface Props {
  onInquireParams?: (params: InquireParams) => void
}

export function AvailabilitySection({ onInquireParams }: Props) {
  const overnightRates = SOFT_OPENING
    ? PRICING_CONFIG.overnight.soft
    : PRICING_CONFIG.overnight.full

  return (
    <section id="availability" className="section-pad bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — copy */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-primary mb-4">
              Availability & Rates
            </p>
            <h2 className="font-serif text-display-lg text-ink mb-6 text-balance">
              Check Dates &amp; Get a Price.
            </h2>
            <p className="font-sans text-base leading-relaxed text-muted-foreground mb-8">
              Select your dates and group size to see an instant price estimate. Then send us an inquiry — we typically respond within 24 hours.
            </p>

            {/* Rate card preview */}
            <div className="bg-muted rounded-xl p-6 border border-border">
              <p className="font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4">
                Introductory Rates
              </p>
              <div className="space-y-2">
                <p className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground/70 mb-1">Overnight</p>
                {[
                  { label: 'Weekday (Mon–Thu)', rate: formatPHP(overnightRates.weekday) },
                  { label: 'Friday / Sunday', rate: formatPHP(overnightRates['friday-sunday']) },
                  { label: 'Saturday', rate: formatPHP(overnightRates.saturday) },
                ].map(({ label, rate }) => (
                  <div key={label} className="flex justify-between font-sans text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-ink font-medium">{rate}</span>
                  </div>
                ))}
                <p className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground/70 mt-3 mb-1">Day Trip (9 AM – 5 PM)</p>
                {[
                  { label: 'Weekday (Mon–Thu)', rate: formatPHP(PRICING_CONFIG.daytrip.weekday) },
                  { label: 'Friday', rate: formatPHP(PRICING_CONFIG.daytrip.friday) },
                  { label: 'Saturday', rate: formatPHP(PRICING_CONFIG.daytrip.saturday) },
                  { label: 'Sunday', rate: formatPHP(PRICING_CONFIG.daytrip['friday-sunday']) },
                ].map(({ label, rate }) => (
                  <div key={`dt-${label}`} className="flex justify-between font-sans text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-ink font-medium">{rate}</span>
                  </div>
                ))}
              </div>
              <p className="font-sans text-xs text-muted-foreground mt-4 border-t border-border pt-3">
                Soft launch discounted pricing (best direct-book rate). Base rate includes up to 10 guests.
                Holidays and peak season rates vary.
              </p>
            </div>
          </motion.div>

          {/* Right — calculator */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8"
          >
            <PricingCalculator onInquire={onInquireParams} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
