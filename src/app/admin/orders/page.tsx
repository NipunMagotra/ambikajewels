import { verifyAdminAuth } from '@/lib/adminAuth';
import { redirect } from 'next/navigation';
import AdminOrdersClient from './AdminOrdersClient';

export const metadata = {
  title: 'Online Orders Management | Ambika Jewels Admin',
  description: 'Manage and fulfill online orders placed on Ambika Jewels showroom.'
};

export default async function AdminOrdersPage() {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    redirect('/admin/login');
  }

  return <AdminOrdersClient />;
}
