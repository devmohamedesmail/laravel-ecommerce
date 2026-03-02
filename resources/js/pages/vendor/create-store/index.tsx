import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

// UI components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ErrorMsg from '@/components/ui/error';
import ImagePicker from '@/components/ui/image-picker';
import Footer from '@/components/home/footer';

import {
    Store, Phone, Mail, MapPin, Globe, DollarSign,
    Clock, Tag, CheckCircle, ChevronRight, ChevronLeft,
    Zap, AlertCircle, X
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
    id: number;
    name_en: string;
    name_ar: string;
    parent_id: number | null;
}

interface Props {
    categories: Category[];
}

// ─── Static data ──────────────────────────────────────────────────────────────

const CURRENCIES = ['USD', 'EUR', 'GBP', 'SAR', 'AED', 'EGP', 'JOD', 'KWD', 'QAR', 'OMR'];

const TIMEZONES = [
    'UTC', 'America/New_York', 'America/Chicago', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Asia/Dubai', 'Asia/Riyadh',
    'Asia/Cairo', 'Asia/Amman', 'Asia/Kuwait', 'Asia/Doha', 'Asia/Muscat',
];

const COUNTRIES = [
    'United States', 'United Kingdom', 'Canada', 'Saudi Arabia',
    'UAE', 'Egypt', 'Jordan', 'Kuwait', 'Qatar', 'Oman', 'Bahrain',
];

// ─── Zod schema ───────────────────────────────────────────────────────────────

const schema = z.object({
    name: z.string().min(3, 'Store name must be at least 3 characters'),
    description: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email address').or(z.literal('')).optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
    currency: z.string().min(1, 'Currency is required'),
    timezone: z.string().min(1, 'Timezone is required'),
});

type FormValues = z.infer<typeof schema>;

// Fields belonging to each step (for per-step trigger + error routing)
const STEP_FIELDS: (keyof FormValues)[][] = [
    ['name', 'description', 'phone', 'email', 'currency', 'timezone'],
    ['address', 'city', 'state', 'zip', 'country'],
    [],
    [],
];

// ─── Step bar ─────────────────────────────────────────────────────────────────

function StepBar({ current, stepErrors, labels }: {
    current: number; stepErrors: number[]; labels: string[];
}) {
    return (
        <div className="flex items-center justify-center gap-0 mb-8">
            {labels.map((label, i) => {
                const hasError = stepErrors.includes(i);
                const done = i < current;
                const active = i === current;
                return (
                    <React.Fragment key={label}>
                        <div className="flex flex-col items-center">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                ${hasError ? 'bg-red-500 text-white ring-4 ring-red-100'
                                    : done ? 'bg-orange-500 text-white'
                                        : active ? 'bg-orange-500 text-white ring-4 ring-orange-200'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                {hasError ? <AlertCircle size={16} /> : done ? <CheckCircle size={16} /> : i + 1}
                            </div>
                            <span className={`text-xs mt-1 font-medium ${hasError ? 'text-red-500' : active ? 'text-orange-500' : 'text-gray-400'}`}>
                                {label}
                            </span>
                        </div>
                        {i < labels.length - 1 && (
                            <div className={`h-0.5 w-12 mx-1 mb-5 transition-all ${done ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

// ─── Select wrapper (keeps border + icon consistent) ─────────────────────────

function SelectField({ icon: Icon, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { icon?: React.ElementType }) {
    return (
        <div className="relative">
            {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
            <select
                className={`w-full ${Icon ? 'pl-8' : 'pl-3'} pr-3 py-2 text-sm border border-input rounded-md bg-white dark:bg-gray-900 dark:text-white outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 h-9`}
                {...props}
            >
                {children}
            </select>
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CreateStore({ categories }: Props) {
    const { t, i18n } = useTranslation();
    const { flash } = usePage().props as any;
    const isRtl = i18n.language === 'ar';

    const [step, setStep] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [stepErrors, setStepErrors] = useState<number[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        watch,
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            name: '', description: '', phone: '', email: '',
            address: '', city: '', state: '', zip: '',
            country: '', currency: 'USD', timezone: 'UTC',
        },
    });

    const STEP_LABELS = [
        t('create_store.steps.info'),
        t('create_store.steps.location'),
        t('create_store.steps.categories'),
        t('create_store.steps.media'),
    ];

    // Navigation
    const handleNext = async () => {
        const fields = STEP_FIELDS[step];
        const valid = fields.length === 0 || await trigger(fields);
        if (valid) {
            setStepErrors(e => e.filter(s => s !== step));
            setStep(s => s + 1);
        } else {
            setStepErrors(e => e.includes(step) ? e : [...e, step]);
        }
    };

    // Submit
    const onSubmit = (data: FormValues) => {
        setProcessing(true);
        const formData = new FormData();
        Object.entries(data).forEach(([k, v]) => formData.append(k, v ?? ''));
        selectedCategories.forEach(id => formData.append('categories[]', String(id)));
        if (logoFile) formData.append('logo', logoFile);
        if (coverFile) formData.append('cover', coverFile);

        router.post('/create-store', formData as any, {
            forceFormData: true,
            onSuccess: () => toast.success(t('create_store.toast.success')),
            onError: () => toast.error(t('create_store.toast.error')),
            onFinish: () => setProcessing(false),
        });
    };

    const onError = (errs: typeof errors) => {
        const errorSteps: number[] = [];
        STEP_FIELDS.forEach((fields, i) => {
            if (fields.some(f => errs[f])) errorSteps.push(i);
        });
        setStepErrors(errorSteps);
        const firstErrorStep = STEP_FIELDS.findIndex(fields => fields.some(f => errs[f]));
        if (firstErrorStep !== -1) setStep(firstErrorStep);
        toast.error(t('create_store.toast.error'));
    };

    // Category helpers
    const toggleCategory = (id: number) =>
        setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

    const parents = categories.filter(c => !c.parent_id);
    const getChildren = (parentId: number) => categories.filter(c => c.parent_id === parentId);

    // Per-step error list (for the error banner)
    const currentStepErrorMsgs = STEP_FIELDS[step]
        .filter(f => errors[f])
        .map(f => errors[f]?.message as string);

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <>
            <Head title={t('create_store.title')} />

            {/* Hero */}
            <div className="bg-linear-to-br from-orange-500 to-amber-400 py-16 text-white text-center px-4">
                <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Store size={22} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t('create_store.title')}</h1>
                </div>
                <p className="text-white/80 text-sm max-w-md mx-auto">{t('create_store.subtitle')}</p>
            </div>

            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4" dir={isRtl ? 'rtl' : 'ltr'}>
                <div className="max-w-2xl mx-auto">

                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                        <StepBar current={step} stepErrors={stepErrors} labels={STEP_LABELS} />

                        {/* Error banner */}
                        {currentStepErrorMsgs.length > 0 && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800 p-4">
                                <p className="text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2 mb-2">
                                    <AlertCircle size={15} /> {t('create_store.validation.fix_errors')}
                                </p>
                                <ul className="text-xs text-red-600 dark:text-red-400 space-y-1 list-disc list-inside">
                                    {currentStepErrorMsgs.map((msg, i) => <li key={i}>{msg}</li>)}
                                </ul>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit, onError)}>

                            {/* ── Step 0: Store Info ──────────────────────── */}
                            {step === 0 && (
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
                                        <div className="space-y-1.5">
                                            <Label>{t('create_store.info.currency')} <span className="text-red-500">*</span></Label>
                                            <SelectField icon={DollarSign} {...register('currency')}>
                                                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </SelectField>
                                            <ErrorMsg message={errors.currency?.message} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>{t('create_store.info.timezone')} <span className="text-red-500">*</span></Label>
                                            <SelectField icon={Clock} {...register('timezone')}>
                                                {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                                            </SelectField>
                                            <ErrorMsg message={errors.timezone?.message} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Step 1: Location ────────────────────────── */}
                            {step === 1 && (
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
                                            <SelectField icon={Globe} {...register('country')}>
                                                <option value="">{t('create_store.location.country_placeholder')}</option>
                                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </SelectField>
                                            <ErrorMsg message={errors.country?.message} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Step 2: Categories ──────────────────────── */}
                            {step === 2 && (
                                <div className="space-y-5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Tag size={18} className="text-orange-500" />
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('create_store.categories.heading')}</h2>
                                    </div>
                                    <p className="text-sm text-gray-500">{t('create_store.categories.description')}</p>

                                    {selectedCategories.length > 0 && (
                                        <div className="flex flex-wrap gap-2 p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-900/20">
                                            {selectedCategories.map(id => {
                                                const cat = categories.find(c => c.id === id);
                                                return cat ? (
                                                    <span key={id} className="inline-flex items-center gap-1.5 text-xs bg-orange-500 text-white px-2.5 py-1 rounded-full font-medium">
                                                        {isRtl ? cat.name_ar : cat.name_en}
                                                        <button type="button" onClick={() => toggleCategory(id)}><X size={10} /></button>
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    )}

                                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                                        {parents.length === 0 && (
                                            <p className="text-center text-gray-400 text-sm py-8">{t('create_store.categories.no_categories')}</p>
                                        )}
                                        {parents.map(parent => {
                                            const children = getChildren(parent.id);
                                            const isSelected = selectedCategories.includes(parent.id);
                                            return (
                                                <div key={parent.id} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                                                    <button type="button" onClick={() => toggleCategory(parent.id)}
                                                        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${isSelected ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                                        <span className={`text-sm font-semibold ${isSelected ? 'text-orange-600 dark:text-orange-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                                            {isRtl ? parent.name_ar : parent.name_en}
                                                        </span>
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300 dark:border-gray-600'}`}>
                                                            {isSelected && <CheckCircle size={12} className="text-white" />}
                                                        </div>
                                                    </button>
                                                    {children.length > 0 && (
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-white dark:bg-gray-900">
                                                            {children.map(child => {
                                                                const childSel = selectedCategories.includes(child.id);
                                                                return (
                                                                    <button key={child.id} type="button" onClick={() => toggleCategory(child.id)}
                                                                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-all ${childSel ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-300'}`}>
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
                                </div>
                            )}

                            {/* ── Step 3: Media ───────────────────────────── */}
                            {step === 3 && (
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
                            )}

                            {/* ── Navigation ─────────────────────────────── */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                {step > 0 ? (
                                    <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)} className="gap-2">
                                        <ChevronLeft size={16} /> {t('create_store.nav.previous')}
                                    </Button>
                                ) : <div />}

                                {step < STEP_LABELS.length - 1 ? (
                                    <Button type="button" onClick={handleNext} className="gap-2 bg-orange-500 hover:bg-orange-600 text-white border-0">
                                        {t('create_store.nav.next')} <ChevronRight size={16} />
                                    </Button>
                                ) : (
                                    <Button type="submit" disabled={processing} className="gap-2 bg-orange-500 hover:bg-orange-600 text-white border-0 min-w-36">
                                        {processing ? t('create_store.nav.submitting') : `🚀 ${t('create_store.nav.submit')}`}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
