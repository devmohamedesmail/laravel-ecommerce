import React from 'react'
import { MapPin } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useTranslation } from 'react-i18next'
import ErrorMsg from '@/components/ui/error-message';

export default function StoreLocationStep({register,errors}:any) {

    const { t } = useTranslation();
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-2 mb-1">
                <MapPin size={18} className="text-orange-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('create_store.location.heading')}</h2>
            </div>

            <div className="space-y-1.5">
                <Label>{t('create_store.location.address')}</Label>
                <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input {...register('address')} placeholder={t('create_store.location.address_placeholder')} className="pl-8" />
                </div>
                <ErrorMsg message={errors.address?.message} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label>{t('create_store.location.city')}</Label>
                    <Input {...register('city')} placeholder={t('create_store.location.city_placeholder')} />
                    <ErrorMsg message={errors.city?.message} />
                </div>
                <div className="space-y-1.5">
                    <Label>{t('create_store.location.state')}</Label>
                    <Input {...register('state')} placeholder={t('create_store.location.state_placeholder')} />
                    <ErrorMsg message={errors.state?.message} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label>{t('create_store.location.zip')}</Label>
                    <Input {...register('zip')} placeholder={t('create_store.location.zip_placeholder')} />
                    <ErrorMsg message={errors.zip?.message} />
                </div>
                <div className="space-y-1.5">
                    <Label>{t('create_store.location.country')}</Label>
                    {/* <SelectField icon={Globe} {...register('country')}>
                        <option value="">{t('create_store.location.country_placeholder')}</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </SelectField> */}
                    <ErrorMsg message={errors.country?.message} />
                </div>
            </div>
        </div>
    )
}
