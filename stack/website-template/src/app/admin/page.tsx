import { getAllInquiries } from '@/lib/sheets'
import { getAllBookings } from '@/lib/bookings'
import AdminDashboard from './AdminDashboard'

// Always render fresh — never serve cached admin data
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [inquiries, bookings] = await Promise.all([
    getAllInquiries().catch(() => []),
    getAllBookings().catch(() => []),
  ])

  return <AdminDashboard initialInquiries={inquiries} initialBookings={bookings} />
}
