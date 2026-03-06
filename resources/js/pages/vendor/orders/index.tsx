import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import VendorLayout from '@/layouts/vendor-layout';
import { ShoppingBag, Clock, Loader2, CheckCircle2, XCircle, Eye } from 'lucide-react';

interface Store { id: number; name: string; currency: string; }
interface Props { store: Store; }
type OrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';
interface MockOrder { id: string; customer: string; email: string; date: string; total: number; items: number; status: OrderStatus; }

const MOCK_ORDERS: MockOrder[] = [
    { id: '#ORD-1001', customer: 'Ahmed Ali', email: 'ahmed@example.com', date: 'Mar 5, 2026', total: 149.99, items: 3, status: 'delivered' },
    { id: '#ORD-1002', customer: 'Sara Hassan', email: 'sara@example.com', date: 'Mar 4, 2026', total: 89.00, items: 1, status: 'processing' },
    { id: '#ORD-1003', customer: 'Omar Mahmoud', email: 'omar@example.com', date: 'Mar 4, 2026', total: 320.50, items: 5, status: 'pending' },
    { id: '#ORD-1004', customer: 'Nour Ibrahim', email: 'nour@example.com', date: 'Mar 3, 2026', total: 45.00, items: 1, status: 'cancelled' },
    { id: '#ORD-1005', customer: 'Yara Khaled', email: 'yara@example.com', date: 'Mar 3, 2026', total: 210.00, items: 4, status: 'delivered' },
    { id: '#ORD-1006', customer: 'Khalid Saeed', email: 'khld@example.com', date: 'Mar 2, 2026', total: 67.50, items: 2, status: 'pending' },
    { id: '#ORD-1007', customer: 'Lina Mostafa', email: 'lina@example.com', date: 'Mar 2, 2026', total: 155.00, items: 3, status: 'processing' },
    { id: '#ORD-1008', customer: 'Tariq Amin', email: 'tariq@example.com', date: 'Mar 1, 2026', total: 498.00, items: 6, status: 'delivered' },
];

function StatusBadge({ status }: { status: OrderStatus }) {
    const { t } = useTranslation();
    const map: Record<OrderStatus, { cls: string; icon: React.ReactNode }> = {
        pending: { cls: 'bg-amber-100 text-amber-700', icon: <Clock size={11} /> },
        processing: { cls: 'bg-blue-100 text-blue-700', icon: <Loader2 size={11} /> },
        delivered: { cls: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={11} /> },
        cancelled: { cls: 'bg-red-100 text-red-700', icon: <XCircle size={11} /> },
    };
    const { cls, icon } = map[status];
    return <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>{icon} {t(`vendor.orders.${status}`)}</span>;
}

export default function VendorOrders({ store }: Props) {
    const { t } = useTranslation();
    const [filter, setFilter] = useState<OrderStatus | ''>('');
    const ALL: OrderStatus[] = ['pending', 'processing', 'delivered', 'cancelled'];
    const filtered = filter ? MOCK_ORDERS.filter(o => o.status === filter) : MOCK_ORDERS;
    const counts = ALL.reduce((acc, s) => { acc[s] = MOCK_ORDERS.filter(o => o.status === s).length; return acc; }, {} as Record<OrderStatus, number>);

    return (
        <VendorLayout title={t('vendor.orders.title')}>
            <Head title={`${store.name} — ${t('vendor.orders.title')}`} />
            <div className="mb-6">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{t('vendor.orders.title')}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{t('vendor.orders.subtitle')}</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: t('vendor.orders.pending'), val: counts.pending, cls: 'bg-amber-50 text-amber-700' },
                    { label: t('vendor.orders.processing'), val: counts.processing, cls: 'bg-blue-50 text-blue-700' },
                    { label: t('vendor.orders.delivered'), val: counts.delivered, cls: 'bg-green-50 text-green-700' },
                    { label: t('vendor.orders.cancelled'), val: counts.cancelled, cls: 'bg-red-50 text-red-700' },
                ].map(c => (
                    <div key={c.label} className={`rounded-xl px-4 py-3 flex flex-col gap-1 ${c.cls}`}>
                        <span className="text-xs font-medium opacity-80">{c.label}</span>
                        <span className="text-2xl font-extrabold">{c.val}</span>
                    </div>
                ))}
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-5">
                {[{ val: '', label: t('vendor.orders.filter_all') }, ...ALL.map(s => ({ val: s, label: t(`vendor.orders.${s}`) }))].map(tab => (
                    <button key={tab.val} onClick={() => setFilter(tab.val as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${filter === tab.val ? 'bg-orange-500 text-white border-orange-500' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-orange-300'}`}>
                        {tab.label}
                        {tab.val && <span className="ms-1.5">{counts[tab.val as OrderStatus]}</span>}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4"><ShoppingBag size={28} className="text-orange-300" /></div>
                    <p className="text-gray-500 text-sm">{t('vendor.orders.no_orders')}</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                    <th className="px-5 py-3 text-start font-medium">{t('vendor.orders.order_id')}</th>
                                    <th className="px-5 py-3 text-start font-medium">{t('vendor.orders.customer')}</th>
                                    <th className="px-5 py-3 text-start font-medium hidden md:table-cell">{t('vendor.orders.date')}</th>
                                    <th className="px-5 py-3 text-start font-medium">{t('vendor.orders.total')}</th>
                                    <th className="px-5 py-3 text-start font-medium">{t('vendor.orders.status')}</th>
                                    <th className="px-5 py-3 text-end font-medium">{t('vendor.orders.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {filtered.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="px-5 py-3.5 font-mono text-xs text-orange-500 font-medium">{order.id}</td>
                                        <td className="px-5 py-3.5">
                                            <p className="font-medium text-gray-900 dark:text-white">{order.customer}</p>
                                            <p className="text-xs text-gray-400">{order.email}</p>
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{order.date}</td>
                                        <td className="px-5 py-3.5 font-semibold text-gray-900 dark:text-white">{store.currency} {order.total}</td>
                                        <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                                        <td className="px-5 py-3.5 text-end">
                                            <button className="inline-flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-medium px-2.5 py-1.5 rounded-lg hover:bg-orange-50 transition-colors">
                                                <Eye size={12} /> {t('vendor.orders.view')}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </VendorLayout>
    );
}
