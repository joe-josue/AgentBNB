'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { SoftOpeningBanner } from '@/components/SoftOpeningBanner'
import { SOFT_OPENING } from '@/lib/config'

export function ConditionalNav() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {SOFT_OPENING && <SoftOpeningBanner />}
      <Navbar />
    </div>
  )
}
