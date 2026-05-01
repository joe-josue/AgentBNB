'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fadeUp, viewportOnce } from '@/lib/animations'
import { CheckCircle2, Loader2 } from 'lucide-react'
import type { InquiryFormData } from '@/lib/types'

interface Props {
  prefillParams?: {
    checkIn?: string
    checkOut?: string
    headcount?: number
    stayType?: 'overnight' | 'daytrip'
  }
}

export function InquireSection({ prefillParams }: Props) {
  const [form, setForm] = useState<InquiryFormData>({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    headcount: 4,
    stayType: 'overnight',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Pre-fill from availability calculator
  useEffect(() => {
    if (prefillParams) {
      setForm((prev) => ({
        ...prev,
        checkIn: prefillParams.checkIn ?? prev.checkIn,
        checkOut: prefillParams.stayType === 'daytrip'
          ? ''
          : (prefillParams.checkOut ?? prev.checkOut),
        headcount: prefillParams.headcount ?? prev.headcount,
        stayType: prefillParams.stayType ?? prev.stayType,
      }))
    }
  }, [prefillParams])

  const set = (key: keyof InquiryFormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleStayTypeChange = (value: string) => {
    const stayType = value as InquiryFormData['stayType']
    setForm((prev) => ({
      ...prev,
      stayType,
      checkOut: stayType === 'daytrip' ? '' : prev.checkOut,
    }))
  }

  const validate = (): string | null => {
    if (!form.name.trim()) return 'Name is required.'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'A valid email is required.'
    if (!form.checkIn) return 'Please select a check-in date.'
    if (form.stayType === 'overnight' && !form.checkOut) return 'Please select a check-out date.'
    if (form.stayType === 'overnight' && form.checkOut && form.checkOut <= form.checkIn) return 'Check-out must be after check-in.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) { setErrorMsg(err); return }
    setErrorMsg('')
    setStatus('submitting')

    try {
      const res = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <section id="inquire" className="section-pad bg-background">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-6">
            <CheckCircle2 size={32} className="text-primary" />
          </div>
          <h2 className="font-serif text-display-md text-ink mb-4">
            Thank you, {form.name.split(' ')[0]}.
          </h2>
          <p className="font-sans text-base text-muted-foreground">
            We received your inquiry and will be in touch within 24 hours. We look forward to hosting you at Your Property.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="inquire" className="section-pad bg-background">
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
              Book Direct
            </p>
            <h2 className="font-serif text-display-lg text-ink mb-6 text-balance">
              Ready to Book?<br />Let&apos;s Talk.
            </h2>
            <p className="font-sans text-base leading-relaxed text-muted-foreground mb-6">
              Send us your preferred dates, group size, and any questions. We typically respond within 24 hours.
            </p>
            <p className="font-sans text-base leading-relaxed text-muted-foreground">
              Whether it&apos;s a quick barkada pool day or a few nights away from the city — this hilltop home is ready for your group.
            </p>
          </motion.div>

          {/* Right — form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Name + email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="font-sans text-sm text-ink">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    className="font-sans"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="font-sans text-sm text-ink">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    className="font-sans"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="font-sans text-sm text-ink">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+63 9XX XXX XXXX"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  className="font-sans"
                />
              </div>

              {/* Stay type */}
              <div className="space-y-1.5">
                <Label className="font-sans text-sm text-ink">Stay Type *</Label>
                <Select
                  value={form.stayType}
                  onValueChange={handleStayTypeChange}
                >
                  <SelectTrigger className="font-sans">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overnight" className="font-sans">Overnight Stay</SelectItem>
                    <SelectItem value="daytrip" className="font-sans">Day Trip (9AM–5PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dates */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="checkIn" className="font-sans text-sm text-ink">Check-in *</Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={form.checkIn}
                    onChange={(e) => set('checkIn', e.target.value)}
                    className="font-sans"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                {form.stayType === 'overnight' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="checkOut" className="font-sans text-sm text-ink">Check-out *</Label>
                    <Input
                      id="checkOut"
                      type="date"
                      value={form.checkOut}
                      onChange={(e) => set('checkOut', e.target.value)}
                      className="font-sans"
                      min={form.checkIn || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}
              </div>

              {/* Headcount */}
              <div className="space-y-1.5">
                <Label className="font-sans text-sm text-ink">Number of Guests *</Label>
                <Select
                  value={String(form.headcount)}
                  onValueChange={(v) => set('headcount', parseInt(v))}
                >
                  <SelectTrigger className="font-sans">
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

              {/* Message */}
              <div className="space-y-1.5">
                <Label htmlFor="message" className="font-sans text-sm text-ink">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Any questions or special requests?"
                  value={form.message}
                  onChange={(e) => set('message', e.target.value)}
                  className="font-sans min-h-[100px]"
                  rows={4}
                />
              </div>

              {/* Error */}
              {(status === 'error' || errorMsg) && (
                <p className="text-sm font-sans text-destructive">{errorMsg}</p>
              )}

              <Button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-primary hover:bg-primary-dark text-white font-sans py-5 text-base"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Sending…
                  </>
                ) : (
                  'Send Inquiry'
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
