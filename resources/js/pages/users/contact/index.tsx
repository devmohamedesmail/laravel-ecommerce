import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, ChevronUp, CheckCircle, AlertCircle } from 'lucide-react';
import TopBar from '@/components/home/top-header';
import Navbar from '@/components/home/navbar';
import Footer from '@/components/home/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const INFO_CARDS = [
    { icon: MapPin, color: 'bg-orange-50 text-orange-500', key: 'address' },
    { icon: Phone, color: 'bg-blue-50 text-blue-500', key: 'phone' },
    { icon: Mail, color: 'bg-emerald-50 text-emerald-500', key: 'email' },
    { icon: Clock, color: 'bg-purple-50 text-purple-500', key: 'hours' },
] as const;

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4'] as const;

export default function ContactPage() {
    const { t } = useTranslation();
    const [state, setState] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<'success' | 'error' | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setResult('success');
        }, 1500);
    };

    return (
        <>
            <Head title={t('contact.title')} />
            <TopBar />
            <Navbar />

            {/* Hero */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs><pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                        </pattern></defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 text-xs font-bold px-4 py-2 rounded-full mb-4">
                        <Mail size={13} /> {t('contact.title')}
                    </div>
                    <h1 className="text-4xl font-extrabold mb-3">{t('contact.title')}</h1>
                    <p className="text-gray-400 max-w-md mx-auto text-sm">{t('contact.subtitle')}</p>
                </div>
            </div>

            {/* Info cards */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {INFO_CARDS.map(({ icon: Icon, color, key }) => (
                            <div key={key} className="flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                                    <Icon size={18} />
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{t(`contact.info.${key}`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 py-14 px-4">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">

                    {/* Contact form */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Send size={18} className="text-orange-500" /> {t('contact.info.heading')}
                        </h2>

                        {result === 'success' ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                                    <CheckCircle size={32} className="text-emerald-500" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">{t('common.success')}</h3>
                                <p className="text-gray-500 text-sm">{t('contact.form.success')}</p>
                                <button onClick={() => { setResult(null); setState({ name: '', email: '', subject: '', message: '' }); }}
                                    className="mt-6 text-sm text-orange-500 hover:underline">Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label>{t('contact.form.name')}</Label>
                                        <Input required value={state.name} onChange={e => setState(s => ({ ...s, name: e.target.value }))} placeholder={t('contact.form.name_placeholder')} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>{t('contact.form.email')}</Label>
                                        <Input required type="email" value={state.email} onChange={e => setState(s => ({ ...s, email: e.target.value }))} placeholder={t('contact.form.email_placeholder')} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label>{t('contact.form.subject')}</Label>
                                    <Input required value={state.subject} onChange={e => setState(s => ({ ...s, subject: e.target.value }))} placeholder={t('contact.form.subject_placeholder')} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>{t('contact.form.message')}</Label>
                                    <Textarea required rows={5} value={state.message} onChange={e => setState(s => ({ ...s, message: e.target.value }))} placeholder={t('contact.form.message_placeholder')} />
                                </div>
                                <Button type="submit" disabled={submitting} className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl gap-2 py-3 font-bold">
                                    <Send size={15} />
                                    {submitting ? t('contact.form.submitting') : t('contact.form.submit')}
                                </Button>
                            </form>
                        )}
                    </div>

                    {/* FAQ */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">{t('contact.faq.heading')}</h2>
                        <div className="space-y-3">
                            {FAQ_KEYS.map((key, i) => (
                                <div key={key} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-sm font-semibold text-gray-800">{t(`contact.faq.${key}`)}</span>
                                        {openFaq === i
                                            ? <ChevronUp size={16} className="text-orange-500 shrink-0" />
                                            : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                                    </button>
                                    {openFaq === i && (
                                        <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50">
                                            {t(`contact.faq.${key.replace('q', 'a') as 'a1' | 'a2' | 'a3' | 'a4'}`)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Map placeholder */}
                        <div className="mt-6 rounded-2xl overflow-hidden border border-gray-100 bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center">
                            <div className="text-center text-gray-400">
                                <MapPin size={32} className="mx-auto mb-2 opacity-40" />
                                <p className="text-sm font-medium">Interactive Map</p>
                                <p className="text-xs">{t('contact.info.address')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
