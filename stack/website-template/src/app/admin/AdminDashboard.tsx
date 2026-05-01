'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Inquiry, Booking } from '@/lib/types'

type Tab = 'inquiries' | 'bookings' | 'calendar'

export default function AdminDashboard({
  initialInquiries,
  initialBookings,
}: {
  initialInquiries: Inquiry[]
  initialBookings: Booking[]
}) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('inquiries')
  const [inquiries] = useState<Inquiry[]>(initialInquiries)
  const [bookings] = useState<Booking[]>(initialBookings)
  const [refreshing, setRefreshing] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Refresh by doing a full server re-render (no API calls needed)
  const refresh = useCallback(async () => {
    setRefreshing(true)
    router.refresh()
    // Give the server component a moment to re-render
    setTimeout(() => setRefreshing(false), 1500)
  }, [router])

  async function approve(row: number, name: string) {
    if (!confirm(`Approve booking for ${name}?`)) return
    setActionLoading(`approve-${row}`)
    try {
      const res = await fetch(`/api/admin/inquiries/${row}/approve`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showToast(`✅ Booking confirmed for ${name}`)
      await refresh()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to approve', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  async function reject(row: number, name: string) {
    const sendEmail = confirm(`Send a decline email to ${name}?`)
    setActionLoading(`reject-${row}`)
    try {
      const res = await fetch(`/api/admin/inquiries/${row}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sendEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showToast(`Inquiry from ${name} rejected`)
      await refresh()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to reject', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  async function cancelBooking(id: string, guestName: string) {
    if (!confirm(`Cancel booking for ${guestName}? This will unblock those dates.`)) return
    setActionLoading(`delete-${id}`)
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showToast(`Booking for ${guestName} cancelled`)
      await refresh()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to cancel', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  async function sendThankYou(id: string, guestName: string) {
    if (!confirm(`Send thank you email & review request to ${guestName}?`)) return
    setActionLoading(`thankyou-${id}`)
    try {
      const res = await fetch(`/api/admin/bookings/${id}/thank-you`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showToast(`✨ Thank you email sent to ${guestName}`)
      await refresh()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to send', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  function handleLogout() {
    document.cookie = 'admin_token=; Max-Age=0; path=/'
    router.push('/admin/login')
  }

  const pending = inquiries.filter((i) => i.status === 'Pending')
  const approved = inquiries.filter((i) => i.status === 'Approved')
  const rejected = inquiries.filter((i) => i.status === 'Rejected')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-gray-900">Your Property</h1>
          <p className="text-xs text-gray-500 mt-0.5">Admin Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            disabled={refreshing}
            className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-40"
          >
            {refreshing ? 'Refreshing…' : '↻ Refresh'}
          </button>
          <a href="/" target="_blank" className="text-sm text-primary hover:underline">
            View site →
          </a>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded px-3 py-1.5"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex gap-6 text-sm">
        <span className="text-gray-600">
          <span className="font-semibold text-amber-600">{pending.length}</span> pending
        </span>
        <span className="text-gray-600">
          <span className="font-semibold text-green-600">{approved.length}</span> approved
        </span>
        <span className="text-gray-600">
          <span className="font-semibold text-gray-800">{bookings.length}</span> bookings
        </span>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white px-6">
        <nav className="flex gap-0">
          {(['inquiries', 'bookings', 'calendar'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                tab === t
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t}
              {t === 'inquiries' && pending.length > 0 && (
                <span className="ml-1.5 bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full">
                  {pending.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* ─── INQUIRIES TAB ─── */}
        {tab === 'inquiries' && (
          <div>
            <h2 className="font-serif text-xl text-gray-900 mb-4">
              Pending Inquiries
              {pending.length === 0 && (
                <span className="ml-2 text-sm font-sans text-gray-400">— all clear</span>
              )}
            </h2>
            {pending.length > 0 && (
              <div className="space-y-4 mb-10">
                {pending.map((inq) => (
                  <InquiryCard
                    key={inq.row}
                    inquiry={inq}
                    onApprove={() => approve(inq.row, inq.name)}
                    onReject={() => reject(inq.row, inq.name)}
                    approveLoading={actionLoading === `approve-${inq.row}`}
                    rejectLoading={actionLoading === `reject-${inq.row}`}
                  />
                ))}
              </div>
            )}

            {approved.length > 0 && (
              <>
                <h2 className="font-serif text-xl text-gray-900 mb-4">Approved</h2>
                <div className="space-y-3 mb-10">
                  {approved.map((inq) => <InquiryRow key={inq.row} inquiry={inq} />)}
                </div>
              </>
            )}

            {rejected.length > 0 && (
              <>
                <h2 className="font-serif text-xl text-gray-900 mb-4">Rejected</h2>
                <div className="space-y-3">
                  {rejected.map((inq) => <InquiryRow key={inq.row} inquiry={inq} />)}
                </div>
              </>
            )}

            {inquiries.length === 0 && (
              <p className="text-gray-400 text-sm">No inquiries yet.</p>
            )}
          </div>
        )}

        {/* ─── BOOKINGS TAB ─── */}
        {tab === 'bookings' && (
          <div>
            <h2 className="font-serif text-xl text-gray-900 mb-4">All Bookings</h2>
            {bookings.length === 0 ? (
              <p className="text-gray-400 text-sm">No bookings yet.</p>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Guest</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Check-in</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Check-out</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Pax</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Total</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Source</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => (
                      <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {b.guestName}
                          {b.rating && (
                            <div className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5 mt-0.5">
                              {'★'.repeat(b.rating)}
                              <span className="text-gray-400 font-normal ml-1">({b.rating}/5)</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{b.checkIn}</td>
                        <td className="px-4 py-3 text-gray-700">{b.checkOut || '—'}</td>
                        <td className="px-4 py-3 text-gray-700">{b.headcount}</td>
                        <td className="px-4 py-3 text-gray-700 capitalize">
                          {b.stayType === 'daytrip' ? 'Day trip' : 'Overnight'}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{b.total || '—'}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {b.source}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-3">
                            {b.thankYouSentAt ? (
                              <span className="text-[10px] text-green-600 font-medium" title={`Sent at ${b.thankYouSentAt}`}>
                                ✓ Thanked
                              </span>
                            ) : (
                              <button
                                onClick={() => sendThankYou(b.id, b.guestName)}
                                disabled={actionLoading === `thankyou-${b.id}`}
                                className="bg-primary text-white text-xs px-3 py-1.5 rounded font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 whitespace-nowrap"
                              >
                                {actionLoading === `thankyou-${b.id}` ? 'Sending…' : 'Send Thank You'}
                              </button>
                            )}
                            <button
                              onClick={() => cancelBooking(b.id, b.guestName)}
                              disabled={actionLoading === `delete-${b.id}`}
                              className="text-xs text-red-600 hover:text-red-800 disabled:opacity-40"
                            >
                              {actionLoading === `delete-${b.id}` ? 'Cancelling…' : 'Cancel'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─── CALENDAR TAB ─── */}
        {tab === 'calendar' && (
          <CalendarView bookings={bookings} inquiries={inquiries} />
        )}
      </main>
    </div>
  )
}

// ─── Inquiry Card (Pending) ───────────────────────────────────────────────────

function InquiryCard({
  inquiry, onApprove, onReject, approveLoading, rejectLoading,
}: {
  inquiry: Inquiry
  onApprove: () => void
  onReject: () => void
  approveLoading: boolean
  rejectLoading: boolean
}) {
  const stayLabel = inquiry.stayType === 'daytrip' ? 'Day Trip' : 'Overnight'
  const dateRange =
    inquiry.checkOut && inquiry.checkOut !== inquiry.checkIn
      ? `${inquiry.checkIn} → ${inquiry.checkOut}`
      : inquiry.checkIn

  return (
    <div className="bg-white border border-amber-200 rounded-lg p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">{inquiry.name}</span>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Pending</span>
          </div>
          <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1 mt-1">
            <span>📅 {dateRange}</span>
            <span>👥 {inquiry.headcount} pax · {stayLabel}</span>
            {inquiry.estimatedTotal && (
              <span className="text-primary font-medium">
                {inquiry.estimatedTotal.replace('Estimated total: ', '')}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            <a href={`mailto:${inquiry.email}`} className="hover:underline">{inquiry.email}</a>
            {inquiry.phone && <span> · {inquiry.phone}</span>}
          </div>
          {inquiry.message && (
            <p className="text-sm text-gray-600 mt-2 italic">&ldquo;{inquiry.message}&rdquo;</p>
          )}
          <p className="text-xs text-gray-400 mt-2">{inquiry.timestamp}</p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={onApprove}
            disabled={approveLoading || rejectLoading}
            className="bg-primary text-white text-sm px-4 py-2 rounded-md font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {approveLoading ? 'Approving…' : '✓ Approve'}
          </button>
          <button
            onClick={onReject}
            disabled={approveLoading || rejectLoading}
            className="border border-gray-300 text-gray-600 text-sm px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {rejectLoading ? 'Rejecting…' : '✗ Reject'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Inquiry Row (Approved / Rejected) ───────────────────────────────────────

function InquiryRow({ inquiry }: { inquiry: Inquiry }) {
  const stayLabel = inquiry.stayType === 'daytrip' ? 'Day Trip' : 'Overnight'
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm flex items-center gap-4">
      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
        inquiry.status === 'Approved'
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-500'
      }`}>
        {inquiry.status}
      </span>
      <span className="font-medium text-gray-900 shrink-0">{inquiry.name}</span>
      <span className="text-gray-500">{inquiry.checkIn}</span>
      <span className="text-gray-500">{stayLabel}</span>
      <span className="text-gray-500">{inquiry.headcount} pax</span>
      {inquiry.estimatedTotal && (
        <span className="text-gray-600">{inquiry.estimatedTotal.replace('Estimated total: ', '')}</span>
      )}
    </div>
  )
}

// ─── Calendar View ────────────────────────────────────────────────────────────

function CalendarView({ bookings, inquiries }: { bookings: Booking[]; inquiries: Inquiry[] }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`

  const monthBookings = bookings.filter(
    (b) => b.checkIn.startsWith(monthStr) || b.checkOut?.startsWith(monthStr)
  )
  const monthPending = inquiries.filter(
    (i) => i.status === 'Pending' &&
      (i.checkIn.startsWith(monthStr) || i.checkOut?.startsWith(monthStr))
  )

  function isBlocked(day: number) {
    const d = `${monthStr}-${String(day).padStart(2, '0')}`
    return monthBookings.some((b) => d >= b.checkIn && d <= (b.checkOut || b.checkIn))
  }
  function isPending(day: number) {
    const d = `${monthStr}-${String(day).padStart(2, '0')}`
    return monthPending.some((i) => d >= i.checkIn && d <= (i.checkOut || i.checkIn))
  }
  function getBookingForDay(day: number) {
    const d = `${monthStr}-${String(day).padStart(2, '0')}`
    return monthBookings.find((b) => d >= b.checkIn && d <= (b.checkOut || b.checkIn))
  }

  const monthName = new Date(year, month, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) } else { setMonth(m => m - 1) }
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) } else { setMonth(m => m + 1) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl text-gray-900">{monthName}</h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="border border-gray-200 rounded px-3 py-1.5 text-sm hover:bg-gray-50">‹ Prev</button>
          <button onClick={nextMonth} className="border border-gray-200 rounded px-3 py-1.5 text-sm hover:bg-gray-50">Next ›</button>
        </div>
      </div>

      <div className="flex gap-4 text-xs text-gray-600 mb-4">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-primary/20 border border-primary/30 inline-block" /> Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300 inline-block" /> Pending inquiry
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`e${i}`} className="border-r border-b border-gray-100 h-16" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const blocked = isBlocked(day)
            const pending = isPending(day)
            const booking = getBookingForDay(day)
            const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear()

            return (
              <div
                key={day}
                title={booking ? `${booking.guestName} · ${booking.stayType}` : undefined}
                className={`border-r border-b border-gray-100 h-16 p-1 text-sm ${
                  blocked ? 'bg-primary/10' : pending ? 'bg-amber-50' : 'bg-white'
                }`}
              >
                <span className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-medium ${
                  isToday ? 'bg-primary text-white' : 'text-gray-700'
                }`}>{day}</span>
                {blocked && booking && day === parseInt(booking.checkIn.split('-')[2]) && (
                  <p className="text-[10px] text-primary font-medium mt-0.5 truncate leading-tight">{booking.guestName}</p>
                )}
                {pending && (
                  <p className="text-[10px] text-amber-700 mt-0.5 leading-tight">⏳</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {(monthBookings.length > 0 || monthPending.length > 0) && (
        <div className="mt-6 space-y-2">
          <h3 className="font-medium text-gray-700 text-sm">This month</h3>
          {monthBookings.map(b => (
            <div key={b.id} className="text-sm text-gray-600 flex gap-2">
              <span className="text-primary">●</span>
              <span>{b.guestName} · {b.checkIn} → {b.checkOut} · {b.headcount} pax</span>
            </div>
          ))}
          {monthPending.map(i => (
            <div key={i.row} className="text-sm text-amber-700 flex gap-2">
              <span>⏳</span>
              <span>{i.name} inquiry · {i.checkIn} → {i.checkOut}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
