import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import VendorLayout from '@/layouts/vendor-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, X, Store, MapPin, Tag as TagIcon, Phone, Mail, Globe } from 'lucide-react';

interface Category { id: number; name_en: string; name_ar: string; parent_id: number | null; }
interface StoreData {
    id: number; name: string; description?: string; phone?: string; email?: string;
    address?: string; city?: string; state?: string; zip?: string; country?: string;
    currency: string; timezone: string;
}
interface Props { store: StoreData; categories: Category[]; storeCategories: number[]; }

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Saudi Arabia', 'UAE', 'Egypt', 'Jordan', 'Kuwait', 'Qatar', 'Oman', 'Bahrain'];

function SectionCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Icon size={14} className="text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

export default function VendorSettings({ store, categories, storeCategories }: Props) {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const [processing, setProcessing] = useState(false);
    const [selectedCats, setSelectedCats] = useState<number[]>(storeCategories);
    const [form, setForm] = useState({
        name: store.name ?? '', description: store.description ?? '',
        phone: store.phone ?? '', email: store.email ?? '',
        address: store.address ?? '', city: store.city ?? '',
        state: store.state ?? '', zip: store.zip ?? '', country: store.country ?? '',
    });

    const set = (key: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setForm(f => ({ ...f, [key]: e.target.value }));

    const toggleCat = (id: number) =>
        setSelectedCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

    const parents = categories.filter(c => !c.parent_id);
    const getChildren = (pid: number) => categories.filter(c => c.parent_id === pid);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.patch('/vendor/settings', { ...form, categories: selectedCats } as any, {
            onSuccess: () => toast.success(t('vendor_dashboard.settings.saved')),
            onError: () => toast.error(t('common.error')),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <VendorLayout title={t('vendor_dashboard.settings.title')}>
            <Head title={`${store.name} — ${t('vendor_dashboard.settings.title')}`} />
            <div className="mb-6">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{t('vendor_dashboard.settings.title')}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{t('vendor_dashboard.settings.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Store Info */}
                <SectionCard icon={Store} title={t('vendor_dashboard.settings.store_info')}>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label>{t('create_store.info.name')} <span className="text-red-500">*</span></Label>
                            <Input value={form.name} onChange={set('name')} required />
                        </div>
                        <div className="space-y-1.5">
                            <Label>{t('create_store.info.description')}</Label>
                            <Textarea rows={3} value={form.description} onChange={set('description') as any} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>{t('create_store.info.phone')}</Label>
                                <div className="relative">
                                    <Phone size={13} className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400`} />
                                    <Input value={form.phone} onChange={set('phone')} className={isRtl ? 'pr-8' : 'pl-8'} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label>{t('create_store.info.email')}</Label>
                                <div className="relative">
                                    <Mail size={13} className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400`} />
                                    <Input type="email" value={form.email} onChange={set('email')} className={isRtl ? 'pr-8' : 'pl-8'} />
                                </div>
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* Location */}
                <SectionCard icon={MapPin} title={t('vendor_dashboard.settings.location')}>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label>{t('create_store.location.address')}</Label>
                            <div className="relative">
                                <MapPin size={13} className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400`} />
                                <Input value={form.address} onChange={set('address')} className={isRtl ? 'pr-8' : 'pl-8'} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>{t('create_store.location.city')}</Label>
                                <Input value={form.city} onChange={set('city')} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>{t('create_store.location.state')}</Label>
                                <Input value={form.state} onChange={set('state')} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>{t('create_store.location.zip')}</Label>
                                <Input value={form.zip} onChange={set('zip')} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>{t('create_store.location.country')}</Label>
                                <div className="relative">
                                    <Globe size={13} className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none`} />
                                    <select value={form.country} onChange={set('country')}
                                        className={`w-full ${isRtl ? 'pr-8' : 'pl-8'} py-2 text-sm border border-input rounded-md bg-white dark:bg-gray-900 dark:text-white h-9 outline-none`}>
                                        <option value="">{t('create_store.location.country_placeholder')}</option>
                                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* Categories */}
                <SectionCard icon={TagIcon} title={t('vendor_dashboard.settings.categories')}>
                    <p className="text-xs text-gray-500 mb-4">{t('vendor_dashboard.settings.categories_desc')}</p>
                    {selectedCats.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/20">
                            {selectedCats.map(id => {
                                const cat = categories.find(c => c.id === id);
                                return cat ? (
                                    <span key={id} className="inline-flex items-center gap-1.5 text-xs bg-orange-500 text-white px-2.5 py-1 rounded-full font-medium">
                                        {isRtl ? cat.name_ar : cat.name_en}
                                        <button type="button" onClick={() => toggleCat(id)}><X size={10} /></button>
                                    </span>
                                ) : null;
                            })}
                        </div>
                    )}
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                        {parents.map(parent => {
                            const children = getChildren(parent.id);
                            const isSelected = selectedCats.includes(parent.id);
                            return (
                                <div key={parent.id} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                                    <button type="button" onClick={() => toggleCat(parent.id)}
                                        className={`w-full flex items-center justify-between px-4 py-3 text-start transition-colors text-sm font-semibold ${isSelected ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' : 'bg-gray-50 dark:bg-gray-800/40 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                        {isRtl ? parent.name_ar : parent.name_en}
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                                            {isSelected && <CheckCircle size={12} className="text-white" />}
                                        </div>
                                    </button>
                                    {children.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-white dark:bg-gray-900">
                                            {children.map(child => {
                                                const childSel = selectedCats.includes(child.id);
                                                return (
                                                    <button key={child.id} type="button" onClick={() => toggleCat(child.id)}
                                                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-all ${childSel ? 'border-orange-400 bg-orange-50 text-orange-600' : 'border-gray-100 dark:border-gray-700 text-gray-600 hover:border-orange-300'}`}>
                                                        {isRtl ? child.name_ar : child.name_en}
                                                        {childSel && <CheckCircle size={11} className="text-orange-500 ms-1 shrink-0" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </SectionCard>

                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={processing} className="bg-orange-500 hover:bg-orange-600 text-white border-0 min-w-36">
                        {processing ? t('vendor_dashboard.settings.saving') : t('vendor_dashboard.settings.save')}
                    </Button>
                </div>
            </form>
        </VendorLayout>
    );
}
