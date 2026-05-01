'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const DISMISS_KEY = 'property-site_soft_banner_dismissed'

export function SoftOpeningBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem(DISMISS_KEY)
    if (!dismissed) setVisible(true)
  }, [])

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="relative z-40 bg-accent text-white text-center py-2.5 px-10 text-sm font-sans">
      <span className="font-medium">Soft Launch Introductory Rates Now Active</span>
      <span className="hidden sm:inline text-white/80">
        {' '}— Discounted direct-book rates while we build momentum. Best value available on this site.
      </span>
      <button
        onClick={dismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        aria-label="Dismiss banner"
      >
        <X size={16} />
      </button>
    </div>
  )
}
