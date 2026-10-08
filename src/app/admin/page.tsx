import { verifyAdminAuth } from '@/lib/adminAuth';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';

export const metadata = {
  title: 'Admin Console | Ambika Jewels',
  description: 'Manage store catalog, products, online orders, bullion market rates, and counter billing.'
};

export default async function AdminPage() {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    redirect('/admin/login?redirect=/admin');
  }

  // Statutory compliance note: Track bridal trousseau advance payments (BUDS Act 2019 compliant)
  return <AdminDashboardClient />;
}

