import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — Your Property',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // No Navbar, no public layout — standalone admin shell
  return <>{children}</>
}
