import React from 'react'
import { Store } from 'lucide-react'
import { useTranslation } from 'react-i18next'
export default function Hero() {
    const { t } = useTranslation();
    return (
        <div className="bg-linear-to-br from-primary/90 to-primary/70 py-16 text-white text-center px-4">
            <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Store size={22} />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t('create_store.title')}</h1>
            </div>
            <p className="text-white/80 text-sm max-w-md mx-auto">{t('create_store.subtitle')}</p>
        </div>
    )
}
