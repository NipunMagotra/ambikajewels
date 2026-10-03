import { verifyAdminAuth } from '@/lib/adminAuth';
import { redirect } from 'next/navigation';
import AdminOrdersClient from './AdminOrdersClient';

export const metadata = {
  title: 'Online Orders Management | Ambika Jewels Admin',
  description: 'Manage and fulfill online orders placed on Ambika Jewels showroom.'
};

export default function AdminOrdersPage() {
  return <AdminOrdersClient />;
}
