import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import VendorLayout from '@/layouts/vendor-layout';
import { Tag, Settings, ArrowRight } from 'lucide-react';

interface Category { id: number; name_en: string; name_ar: string; image?: string; }
interface Store { id: number; name: string; }
interface Props { store: Store; categories: Category[]; }

export default function VendorCategories({ store, categories }: Props) {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    return (
        <VendorLayout title={t('vendor.categories.title')}>
            <Head title={`${store.name} — ${t('vendor.categories.title')}`} />

            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{t('vendor.categories.title')}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('vendor.categories.subtitle')}</p>
                </div>
                <Link href="/vendor/settings" className="flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600 font-medium">
                    <Settings size={14} /> {t('vendor.categories.go_to_settings')} <ArrowRight size={13} />
                </Link>
            </div>

            {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4"><Tag size={28} className="text-orange-300" /></div>
                    <p className="text-gray-500 text-sm mb-4">{t('vendor.categories.no_categories')}</p>
                    <Link href="/vendor/settings" className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors">
                        <Settings size={14} /> {t('vendor.categories.go_to_settings')}
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categories.map(cat => (
                        <div key={cat.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-28 bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 flex items-center justify-center">
                                {cat.image ? <img src={cat.image} alt={isRtl ? cat.name_ar : cat.name_en} className="w-full h-full object-cover" /> : <Tag size={36} className="text-orange-300" />}
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{isRtl ? cat.name_ar : cat.name_en}</h3>
                                <div className="mt-3 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                    <span className="text-xs text-green-600 font-medium">{t('vendor.categories.active')}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </VendorLayout>
    );
}
