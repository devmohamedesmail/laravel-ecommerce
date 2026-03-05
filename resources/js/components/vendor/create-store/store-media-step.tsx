import React from 'react'
import { Zap } from 'lucide-react'
import ImagePicker from '@/components/ui/image-picker';
import { useTranslation } from 'react-i18next';
export default function StoreMediaStep({
    logoPreview,
    setLogoFile,
    setLogoPreview,
    coverPreview,
    setCoverFile,
    setCoverPreview,
    watch,
    selectedCategories
}: any) {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-1">
                <Zap size={18} className="text-orange-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('create_store.media.heading')}</h2>
            </div>

            <ImagePicker
                label={t('create_store.media.logo')}
                preview={logoPreview}
                onFile={f => { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); }}
                onClear={() => { setLogoFile(null); setLogoPreview(null); }}
            />

            <ImagePicker
                label={t('create_store.media.cover')}
                preview={coverPreview}
                onFile={f => { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); }}
                onClear={() => { setCoverFile(null); setCoverPreview(null); }}
            />

            {/* Review summary */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('create_store.media.review_title')}</p>
                {([
                    [t('create_store.media.store_name'), watch('name')],
                    [t('create_store.media.email'), watch('email') || '—'],
                    [t('create_store.media.phone'), watch('phone') || '—'],
                    [t('create_store.media.city'), watch('city') || '—'],
                    [t('create_store.media.country'), watch('country') || '—'],
                    [t('create_store.media.currency'), watch('currency')],
                    [t('create_store.media.categories'),
                    selectedCategories.length
                        ? `${selectedCategories.length} ${t('create_store.media.selected')}`
                        : t('create_store.media.none')],
                ] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                        <span className="text-gray-500">{k}</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{v}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
