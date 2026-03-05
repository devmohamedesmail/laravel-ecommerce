import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';

import MainLayout from '@/layouts/main-layout';
import Hero from '@/components/vendor/create-store/hero';
import StepBar from '@/components/vendor/create-store/step-bar';
import StoreInfoStep from '@/components/vendor/create-store/store-info-step';
import StoreLocationStep from '@/components/vendor/create-store/store-location-step';
import StoreCategoriesStep from '@/components/vendor/create-store/store-categories-step';
import StoreMediaStep from '@/components/vendor/create-store/store-media-step';

// ─── Zod schema ───────────────────────────────────────────────────────────────
// currency / timezone are set silently via hidden defaults — not collected in UI

const schema = z.object({
    name:        z.string().min(3, 'Store name must be at least 3 characters'),
    description: z.string().optional(),
    phone:       z.string().optional(),
    email:       z.string().email('Invalid email address').or(z.literal('')).optional(),
    address:     z.string().optional(),
    city:        z.string().optional(),
    state:       z.string().optional(),
    zip:         z.string().optional(),
    country:     z.string().optional(),
    currency:    z.string().optional(),
    timezone:    z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// Fields validated at each step (empty array = no validation needed)
const STEP_FIELDS: (keyof FormValues)[][] = [
    ['name', 'description', 'phone', 'email'],   // Step 0: Store Info
    ['address', 'city', 'state', 'zip', 'country'], // Step 1: Location
    [],    // Step 2: Categories
    [],    // Step 3: Media / Review
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CreateStore() {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    const [step, setStep]                         = useState(0);
    const [processing, setProcessing]             = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [logoFile, setLogoFile]                 = useState<File | null>(null);
    const [coverFile, setCoverFile]               = useState<File | null>(null);
    const [logoPreview, setLogoPreview]           = useState<string | null>(null);
    const [coverPreview, setCoverPreview]         = useState<string | null>(null);
    const [stepErrors, setStepErrors]             = useState<number[]>([]);

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
            name:        '',
            description: '',
            phone:       '',
            email:       '',
            address:     '',
            city:        '',
            state:       '',
            zip:         '',
            country:     '',
            currency:    'USD',   // hidden default — not shown in UI
            timezone:    'UTC',   // hidden default — not shown in UI
        },
    });

    const STEP_LABELS = [
        t('create_store.steps.info'),
        t('create_store.steps.location'),
        t('create_store.steps.categories'),
        t('create_store.steps.media'),
    ];

    // ─── Navigation ───────────────────────────────────────────────────────────

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

    // ─── Submit ───────────────────────────────────────────────────────────────

    const onSubmit = (data: FormValues) => {
        setProcessing(true);
        const formData = new FormData();

        // Append all text fields
        Object.entries(data).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
                formData.append(k, String(v));
            }
        });

        // Append categories
        selectedCategories.forEach(id => formData.append('categories[]', String(id)));

        // Append images only if selected
        if (logoFile)  formData.append('logo',  logoFile);
        if (coverFile) formData.append('cover', coverFile);

        router.post('/create-store', formData as any, {
            forceFormData: true,
            onSuccess: () => toast.success(t('create_store.toast.success')),
            onError:   () => toast.error(t('create_store.toast.error')),
            onFinish:  () => setProcessing(false),
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
        toast.error(t('create_store.toast.validation_error', 'Please fix the errors before submitting.'));
    };

    // ─── Category toggle ──────────────────────────────────────────────────────

    const toggleCategory = (id: number) =>
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id],
        );

    // Per-step error messages for the banner
    const currentStepErrorMsgs = STEP_FIELDS[step]
        .filter(f => errors[f])
        .map(f => errors[f]?.message as string);

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <MainLayout>
            <Head title={t('create_store.title')} />
            <Hero />

            <div className="min-h-screen bg-gray-50 py-12 px-4" dir={isRtl ? 'rtl' : 'ltr'}>
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">

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

                            {/* Step 0 — Store Info */}
                            {step === 0 && (
                                <StoreInfoStep register={register} errors={errors} />
                            )}

                            {/* Step 1 — Location */}
                            {step === 1 && (
                                <StoreLocationStep register={register} errors={errors} />
                            )}

                            {/* Step 2 — Categories */}
                            {step === 2 && (
                                <StoreCategoriesStep
                                    selectedCategories={selectedCategories}
                                    toggleCategory={toggleCategory}
                                />
                            )}

                            {/* Step 3 — Media & Review */}
                            {step === 3 && (
                                <StoreMediaStep
                                    logoPreview={logoPreview}
                                    setLogoFile={setLogoFile}
                                    setLogoPreview={setLogoPreview}
                                    coverPreview={coverPreview}
                                    setCoverFile={setCoverFile}
                                    setCoverPreview={setCoverPreview}
                                    watch={watch}
                                    selectedCategories={selectedCategories}
                                />
                            )}

                            {/* Navigation */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                {step > 0 ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setStep(s => s - 1)}
                                        className="gap-2"
                                    >
                                        <ChevronLeft size={16} /> {t('create_store.nav.previous')}
                                    </Button>
                                ) : <div />}

                                {step < STEP_LABELS.length - 1 ? (
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                        className="gap-2 bg-orange-500 hover:bg-orange-600 text-white border-0"
                                    >
                                        {t('create_store.nav.next')} <ChevronRight size={16} />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="gap-2 bg-orange-500 hover:bg-orange-600 text-white border-0 min-w-36"
                                    >
                                        {processing
                                            ? t('create_store.nav.submitting')
                                            : `🚀 ${t('create_store.nav.submit')}`
                                        }
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}