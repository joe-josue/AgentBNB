'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { PROPERTY_CONFIG } from '@/lib/config'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/#story', label: 'Our Story' },
  { href: '/#spaces', label: 'The Space' },
  { href: '/#gallery', label: 'Gallery' },
  { href: '/pricechecker', label: 'Availability' },
  { href: '/faq', label: 'FAQ' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const solidNav = scrolled || pathname !== '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleMobileNavClick = () => {
    setMobileOpen(false)
  }

  return (
    <header
      className={cn(
        'transition-all duration-300',
        solidNav
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            'font-serif text-lg font-medium tracking-wide transition-colors',
            solidNav ? 'text-ink' : 'text-white'
          )}
        >
          {PROPERTY_CONFIG.name}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-sans font-medium transition-colors hover:opacity-80',
                solidNav ? 'text-ink' : 'text-white/90'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button
            asChild
            size="sm"
            className={cn(
              'ml-2 transition-all',
              solidNav
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-white text-primary hover:bg-white/90'
            )}
          >
            <Link href="/reserve">Inquire Now</Link>
          </Button>
        </div>

        {/* Mobile nav */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                'md:hidden p-2 rounded-md transition-colors',
                solidNav ? 'text-ink' : 'text-white'
              )}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-background pt-12">
            <div className="flex flex-col gap-1">
              <p className="font-serif text-xl text-ink mb-6 px-4">
                {PROPERTY_CONFIG.name}
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleMobileNavClick}
                  className="text-left px-4 py-3 text-ink font-sans text-base hover:bg-muted rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 px-4">
                <Button
                  asChild
                  className="w-full bg-primary text-white hover:bg-primary-dark"
                >
                  <Link href="/reserve" onClick={handleMobileNavClick}>
                    Inquire Now
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
