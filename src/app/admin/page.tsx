import Link from 'next/link';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    redirect('/admin/login?redirect=/admin');
  }
  return (
    <div className="min-h-screen pt-28 px-4 sm:px-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl text-primary font-headline-md font-bold">Admin Portal</h1>
            <p className="text-sm text-on-surface-variant">
              Manage Ambika Jewels showroom operations, daily market rates, and counter billing.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/admin/orders"
              className="bg-surface-container border border-primary text-primary hover:bg-primary/10 font-bold px-5 py-3 rounded-xl shadow transition-all text-sm inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">receipt_long</span>
              <span>Online Orders Hub</span>
            </Link>

            <Link
              href="/admin/counter"
              className="gold-bg-gradient font-bold text-on-primary-fixed px-6 py-3 rounded-xl shadow-lg hover:shadow-primary/20 transition-all text-sm inline-flex items-center gap-2"
            >
              <span>Launch Counter POS</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/orders"
            className="glass-panel p-6 rounded-xl border border-primary/40 hover:border-primary transition-all group space-y-2 bg-surface-container-high"
          >
            <span className="text-xs font-bold text-primary uppercase tracking-wider block">Live Orders</span>
            <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
              <span>Online Orders</span>
              <span className="material-symbols-outlined text-base text-primary">shopping_bag</span>
            </h3>
            <p className="text-xs text-on-surface-variant">
              Manage website orders, update fulfillment status (Processing/Shipped), check CBDT PAN (&gt;₹2L), and track BVC couriers.
            </p>
          </Link>

          <Link
            href="/admin/counter"
            className="glass-panel p-6 rounded-xl border border-primary/30 hover:border-primary transition-all group space-y-2 bg-surface-container-high"
          >
            <span className="text-xs font-bold text-primary uppercase tracking-wider block">Module 1</span>
            <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
              Daily Rate Controller
            </h3>
            <p className="text-xs text-on-surface-variant">
              Set 24K, 22K, 18K, 14K Gold and Silver rates per gram with presets & Jammu market links.
            </p>
          </Link>

          <Link
            href="/admin/counter"
            className="glass-panel p-6 rounded-xl border border-primary/30 hover:border-primary transition-all group space-y-2 bg-surface-container-high"
          >
            <span className="text-xs font-bold text-primary uppercase tracking-wider block">Module 2</span>
            <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
              Goldsmith Billing & POS
            </h3>
            <p className="text-xs text-on-surface-variant">
              Compute gross/stone weights, making charges, hallmarking, GST, trade-in, and WhatsApp invoices.
            </p>
          </Link>

          <Link
            href="/admin/counter"
            className="glass-panel p-6 rounded-xl border border-primary/30 hover:border-primary transition-all group space-y-2 bg-surface-container-high"
          >
            <span className="text-xs font-bold text-primary uppercase tracking-wider block">Module 3</span>
            <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
              Customer Savings Goals
            </h3>
            <p className="text-xs text-on-surface-variant">
              Track bridal trousseau advance payments, weight progress %, live gold growth, and deposits.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

