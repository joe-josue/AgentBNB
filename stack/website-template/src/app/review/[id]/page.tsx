'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ReviewPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [booking, setBooking] = useState<{ guestName: string, alreadyReviewed: boolean } | null>(null)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    fetch(`/api/review/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setBooking(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load booking info')
        setLoading(false)
      })
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) return alert('Please select a rating')
    
    setSubmitting(true)
    try {
      const res = await fetch(`/api/review/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review })
      })
      if (!res.ok) throw new Error('Failed to submit')
      setDone(true)
    } catch (err) {
      console.error('Review submission error:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f8f5]">
        <p className="font-serif text-gray-400">Loading...</p>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f8f5] px-6 text-center">
        <h1 className="font-serif text-2xl text-gray-900 mb-2">Oops</h1>
        <p className="text-gray-600 mb-6">{error || 'Booking not found'}</p>
        <Link href="/" className="text-primary underline">Return home</Link>
      </div>
    )
  }

  if (done || booking.alreadyReviewed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f8f5] px-6 text-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md w-full">
          <div className="text-4xl mb-4">✨</div>
          <h1 className="font-serif text-2xl text-gray-900 mb-2">Thank you!</h1>
          <p className="text-gray-600 mb-8">
            {done ? 'Your review has been saved.' : 'You have already submitted a review for this stay.'}
            <br />We appreciate your feedback and hope to see you again soon at Your Property.
          </p>
          <Link href="/" className="inline-block bg-[#1E6B7B] text-white px-8 py-3 rounded-md font-medium">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f9f8f5] py-12 px-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl text-gray-900 mb-2">Your Property</h1>
          <p className="text-gray-500 uppercase tracking-widest text-xs">How was your stay, {booking.guestName}?</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Your Rating</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-transform active:scale-90 ${
                    rating >= star ? 'text-amber-400' : 'text-gray-200'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience</label>
            <textarea
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#1E6B7B] focus:border-transparent outline-none transition-all"
              placeholder="What did you enjoy most? Anything we can improve?"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="w-full bg-[#1E6B7B] text-white py-4 rounded-lg font-semibold hover:bg-[#16525E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-900/10"
          >
            {submitting ? 'Sending...' : 'Submit Review'}
          </button>
          
          <p className="text-[10px] text-gray-400 mt-6 text-center leading-relaxed uppercase tracking-tight">
            Your feedback helps us maintain the sanctuary experience<br />for future guests.
          </p>
        </form>
      </div>
    </div>
  )
}
