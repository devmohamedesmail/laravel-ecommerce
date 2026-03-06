import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import VendorLayout from '@/layouts/vendor-layout';
import { Package, Tag, ShoppingBag, TrendingUp, Plus, ArrowRight, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface Store { id: number; name: string; logo?: string; currency: string; }
interface Props { store: Store; productCount: number; categoryCount: number; }

const MOCK_ORDERS = [
  { id: '#ORD-1001', customer: 'Ahmed Ali', date: 'Mar 5, 2026', total: 149.99, status: 'delivered' },
  { id: '#ORD-1002', customer: 'Sara Hassan', date: 'Mar 4, 2026', total: 89.00, status: 'processing' },
  { id: '#ORD-1003', customer: 'Omar Mahmoud', date: 'Mar 4, 2026', total: 320.50, status: 'pending' },
  { id: '#ORD-1004', customer: 'Nour Ibrahim', date: 'Mar 3, 2026', total: 45.00, status: 'cancelled' },
  { id: '#ORD-1005', customer: 'Yara Khaled', date: 'Mar 3, 2026', total: 210.00, status: 'delivered' },
];

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    pending: { cls: 'bg-amber-100 text-amber-700', icon: <Clock size={11} /> },
    processing: { cls: 'bg-blue-100 text-blue-700', icon: <Loader2 size={11} /> },
    delivered: { cls: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={11} /> },
    cancelled: { cls: 'bg-red-100 text-red-700', icon: <XCircle size={11} /> },
  };
  const { cls, icon } = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {icon} {t(`vendor_dashboard.orders.${status}`)}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ElementType; color: string; }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-4 shadow-xs hover:shadow-sm transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        <p className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">{value}</p>
      </div>
    </div>
  );
}

export default function VendorDashboard({ store, productCount = 0, categoryCount = 0 }: Props) {
  const { t } = useTranslation();

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Redirecting…</p>
      </div>
    );
  }

  const mockRevenue = MOCK_ORDERS.reduce((s, o) => s + o.total, 0).toFixed(2);
  const mockOrders = MOCK_ORDERS.length;

  const stats = [
    { label: t('vendor.overview.total_products'), value: productCount, icon: Package, color: 'bg-linear-to-br from-orange-400 to-orange-600' },
    { label: t('vendor.overview.total_categories'), value: categoryCount, icon: Tag, color: 'bg-linear-to-br from-violet-400 to-violet-600' },
    { label: t('vendor.overview.total_orders'), value: mockOrders, icon: ShoppingBag, color: 'bg-linear-to-br from-blue-400 to-blue-600' },
    { label: t('vendor.overview.total_revenue'), value: `$${mockRevenue}`, icon: TrendingUp, color: 'bg-linear-to-br from-emerald-400 to-emerald-600' },
  ];

  return (
    <VendorLayout title={`${t('vendor.overview.welcome')}, ${store.name ?? ''}`}>
      <Head title={`${store.name ?? 'Dashboard'} — Dashboard`} />

      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{t('vendor.overview.welcome')} 👋</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('vendor.overview.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{t('vendor.overview.recent_orders')}</h3>
            <Link href="/vendor/orders" className="text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1">
              {t('vendor.overview.view_orders')} <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-50 dark:border-gray-800">
                  <th className="px-5 py-3 text-start font-medium">{t('vendor.orders.order_id')}</th>
                  <th className="px-5 py-3 text-start font-medium">{t('vendor.orders.customer')}</th>
                  <th className="px-5 py-3 text-start font-medium hidden sm:table-cell">{t('vendor.orders.date')}</th>
                  <th className="px-5 py-3 text-start font-medium">{t('vendor.orders.total')}</th>
                  <th className="px-5 py-3 text-start font-medium">{t('vendor.orders.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {MOCK_ORDERS.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-orange-500 font-medium">{order.id}</td>
                    <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300">{order.customer}</td>
                    <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">{order.date}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900 dark:text-white">${order.total}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">{t('vendor.overview.quick_actions')}</h3>
          <div className="space-y-3">
            {[
              { label: t('vendor.overview.add_product'), href: '/vendor/products', icon: Plus, color: 'bg-orange-500 hover:bg-orange-600 text-white' },
              { label: t('vendor.overview.manage_products'), href: '/vendor/products', icon: Package, color: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200' },
              { label: t('vendor.overview.view_orders'), href: '/vendor/orders', icon: ShoppingBag, color: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200' },
              { label: t('vendor.overview.edit_settings'), href: '/vendor/settings', icon: ArrowRight, color: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200' },
            ].map(action => {
              const Icon = action.icon;
              return (
                <Link key={action.label} href={action.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${action.color}`}>
                  <Icon size={16} className="shrink-0" /> {action.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}
