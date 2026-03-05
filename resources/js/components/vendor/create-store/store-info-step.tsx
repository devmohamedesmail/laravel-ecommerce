import React from 'react'
import {Zap,Phone,Mail} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ErrorMsg from '@/components/ui/error-message';
import { Textarea } from '@/components/ui/textarea';
export default function StoreInfoStep({register, errors}:any) {
    const {t}=useTranslation();
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-2 mb-1">
                <Zap size={18} className="text-orange-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('create_store.info.heading')}</h2>
            </div>

            <div className="space-y-1.5">
                <Label>{t('create_store.info.name')} <span className="text-red-500">*</span></Label>
                <Input {...register('name')} placeholder={t('create_store.info.name_placeholder')} aria-invalid={!!errors.name} />
                <ErrorMsg message={errors.name?.message} />
            </div>

            <div className="space-y-1.5">
                <Label>{t('create_store.info.description')}</Label>
                <Textarea {...register('description')} rows={3} placeholder={t('create_store.info.description_placeholder')} />
                <ErrorMsg message={errors.description?.message} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label>{t('create_store.info.phone')}</Label>
                    <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input {...register('phone')} placeholder={t('create_store.info.phone_placeholder')} className="pl-8" />
                    </div>
                    <ErrorMsg message={errors.phone?.message} />
                </div>
                <div className="space-y-1.5">
                    <Label>{t('create_store.info.email')}</Label>
                    <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input {...register('email')} type="email" placeholder={t('create_store.info.email_placeholder')} className="pl-8" aria-invalid={!!errors.email} />
                    </div>
                    <ErrorMsg message={errors.email?.message} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* <div className="space-y-1.5">
                    <Label>{t('create_store.info.currency')} <span className="text-red-500">*</span></Label>
                    <SelectField icon={DollarSign} {...register('currency')}>
                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </SelectField>
                    <ErrorMsg message={errors.currency?.message} />
                </div> */}
                {/* <div className="space-y-1.5">
                    <Label>{t('create_store.info.timezone')} <span className="text-red-500">*</span></Label>
                    <SelectField icon={Clock} {...register('timezone')}>
                        {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                    </SelectField>
                    <ErrorMsg message={errors.timezone?.message} />
                </div> */}
            </div>
        </div>
    )
}
