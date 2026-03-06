import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import VendorLayout from '@/layouts/vendor-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Search, Package, X, AlertTriangle } from 'lucide-react';

interface Category { id: number; name_en: string; name_ar: string; }
interface ProductItem {
    id: number; name: string; price: number; sale_price?: number;
    stock?: number; sku?: string; status: string; category_id?: number;
    description?: string; category?: Category;
}
interface PaginatedProducts { data: ProductItem[]; current_page: number; last_page: number; total: number; }
interface Store { id: number; name: string; currency: string; }
interface Props { store: Store; products: PaginatedProducts; categories: Category[]; }
type FormData = Omit<ProductItem, 'id' | 'category'>;

const DEFAULT_FORM: FormData = { name: '', description: '', price: 0, sale_price: undefined, stock: undefined, sku: '', status: 'active', category_id: undefined };

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        active: 'bg-green-100 text-green-700', inactive: 'bg-gray-100 text-gray-600', draft: 'bg-amber-100 text-amber-700',
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? styles.inactive}`}>{status}</span>;
}

function ProductModal({ open, onClose, categories, editProduct, currency, processing, onSubmit }: any) {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const [form, setForm] = useState<FormData>(DEFAULT_FORM);

    React.useEffect(() => {
        setForm(editProduct ? {
            name: editProduct.name, description: editProduct.description ?? '', price: editProduct.price,
            sale_price: editProduct.sale_price, stock: editProduct.stock, sku: editProduct.sku ?? '',
            status: editProduct.status, category_id: editProduct.category_id,
        } : DEFAULT_FORM);
    }, [editProduct, open]);

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="font-bold text-gray-900 dark:text-white">
                        {editProduct ? t('vendor_dashboard.products.edit_modal_title') : t('vendor_dashboard.products.add_modal_title')}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <Label>{t('vendor_dashboard.products.name')} <span className="text-red-500">*</span></Label>
                        <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>{t('vendor_dashboard.products.description')}</Label>
                        <Textarea rows={3} value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>{t('vendor_dashboard.products.price')} ({currency})</Label>
                            <Input type="number" min={0} step={0.01} value={form.price} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>{t('vendor_dashboard.products.sale_price')}</Label>
                            <Input type="number" min={0} step={0.01} value={form.sale_price ?? ''} onChange={e => setForm(f => ({ ...f, sale_price: e.target.value ? parseFloat(e.target.value) : undefined }))} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>{t('vendor_dashboard.products.stock')}</Label>
                            <Input type="number" min={0} value={form.stock ?? ''} onChange={e => setForm(f => ({ ...f, stock: e.target.value ? parseInt(e.target.value) : undefined }))} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>{t('vendor_dashboard.products.sku')}</Label>
                            <Input value={form.sku ?? ''} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>{t('vendor_dashboard.products.category')}</Label>
                            <select value={form.category_id ?? ''} onChange={e => setForm(f => ({ ...f, category_id: e.target.value ? parseInt(e.target.value) : undefined }))}
                                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-white dark:bg-gray-900 dark:text-white h-9 outline-none">
                                <option value="">{t('vendor_dashboard.products.select_category')}</option>
                                {categories.map((c: Category) => <option key={c.id} value={c.id}>{isRtl ? c.name_ar : c.name_en}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>{t('vendor_dashboard.products.status')}</Label>
                            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-white dark:bg-gray-900 dark:text-white h-9 outline-none">
                                <option value="active">{t('vendor_dashboard.products.active')}</option>
                                <option value="inactive">{t('vendor_dashboard.products.inactive')}</option>
                                <option value="draft">{t('vendor_dashboard.products.draft')}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                    <Button type="button" variant="outline" onClick={onClose}>{t('vendor_dashboard.products.cancel')}</Button>
                    <Button type="button" disabled={processing || !form.name} onClick={() => onSubmit(form)} className="bg-orange-500 hover:bg-orange-600 text-white border-0">
                        {processing ? t('vendor_dashboard.products.saving') : t('vendor_dashboard.products.save')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function DeleteDialog({ open, onCancel, onConfirm, processing }: any) {
    const { t, i18n } = useTranslation();
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6">
                <div className="flex flex-col items-center text-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle size={22} className="text-red-500" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('vendor_dashboard.products.delete_confirm')}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={onCancel}>{t('vendor_dashboard.products.cancel')}</Button>
                    <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white border-0" disabled={processing} onClick={onConfirm}>{t('vendor_dashboard.products.delete')}</Button>
                </div>
            </div>
        </div>
    );
}

export default function VendorProducts({ store, products, categories }: Props) {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const [modalOpen, setModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<ProductItem | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ProductItem | null>(null);
    const [processing, setProcessing] = useState(false);
    const [search, setSearch] = useState('');

    const filtered = products.data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    const handleSubmit = (data: FormData) => {
        setProcessing(true);
        const opts = {
            onSuccess: () => { toast.success(t('vendor_dashboard.products.save_success')); setModalOpen(false); },
            onError: () => toast.error(t('common.error')),
            onFinish: () => setProcessing(false),
        };
        editProduct
            ? router.put(`/vendor/products/${editProduct.id}`, data as any, opts)
            : router.post('/vendor/products', data as any, opts);
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        setProcessing(true);
        router.delete(`/vendor/products/${deleteTarget.id}`, {
            onSuccess: () => { toast.success(t('vendor_dashboard.products.delete_success')); setDeleteTarget(null); },
            onError: () => toast.error(t('common.error')),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <VendorLayout title={t('vendor_dashboard.products.title')}>
            <Head title={`${store.name} — ${t('vendor_dashboard.products.title')}`} />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{t('vendor_dashboard.products.title')}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{products.total} {t('vendor_dashboard.products.title').toLowerCase()}</p>
                </div>
                <Button onClick={() => { setEditProduct(null); setModalOpen(true); }} className="bg-orange-500 hover:bg-orange-600 text-white border-0 gap-2 shrink-0">
                    <Plus size={16} /> {t('vendor_dashboard.products.add')}
                </Button>
            </div>

            <div className="relative mb-5 max-w-sm">
                <Search size={14} className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'} text-gray-400`} />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('vendor_dashboard.products.search')} className={isRtl ? 'pr-9' : 'pl-9'} />
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4"><Package size={28} className="text-orange-300" /></div>
                    <p className="text-gray-500 text-sm">{t('vendor_dashboard.products.no_products')}</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                    <th className="px-5 py-3 text-start font-medium">{t('vendor_dashboard.products.name')}</th>
                                    <th className="px-5 py-3 text-start font-medium hidden md:table-cell">{t('vendor_dashboard.products.category')}</th>
                                    <th className="px-5 py-3 text-start font-medium">{t('vendor_dashboard.products.price')}</th>
                                    <th className="px-5 py-3 text-start font-medium hidden sm:table-cell">{t('vendor_dashboard.products.stock')}</th>
                                    <th className="px-5 py-3 text-start font-medium">{t('vendor_dashboard.products.status')}</th>
                                    <th className="px-5 py-3 text-end font-medium">{t('vendor_dashboard.orders.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {filtered.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <p className="font-medium text-gray-900 dark:text-white truncate max-w-44">{product.name}</p>
                                            {product.sku && <p className="text-xs text-gray-400 mt-0.5">SKU: {product.sku}</p>}
                                        </td>
                                        <td className="px-5 py-3.5 hidden md:table-cell text-gray-500">
                                            {product.category ? (isRtl ? product.category.name_ar : product.category.name_en) : '—'}
                                        </td>
                                        <td className="px-5 py-3.5 font-semibold text-gray-900 dark:text-white">{store.currency} {product.price}</td>
                                        <td className="px-5 py-3.5 hidden sm:table-cell text-gray-600">{product.stock ?? '∞'}</td>
                                        <td className="px-5 py-3.5"><StatusBadge status={product.status} /></td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => { setEditProduct(product); setModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"><Pencil size={14} /></button>
                                                <button onClick={() => setDeleteTarget(product)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ProductModal open={modalOpen} onClose={() => setModalOpen(false)} categories={categories} editProduct={editProduct} currency={store.currency} processing={processing} onSubmit={handleSubmit} />
            <DeleteDialog open={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} processing={processing} />
        </VendorLayout>
    );
}
