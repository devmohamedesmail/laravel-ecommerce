import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Shield, ChevronRight, Lock, Eye, Share2, Cookie, Key, MessageSquare } from 'lucide-react';
import TopBar from '@/components/home/top-header';
import Navbar from '@/components/home/navbar';
import Footer from '@/components/home/footer';

const SECTIONS = [
    { key: 'collection', icon: Eye },
    { key: 'use', icon: Shield },
    { key: 'sharing', icon: Share2 },
    { key: 'cookies', icon: Cookie },
    { key: 'security', icon: Lock },
    { key: 'rights', icon: Key },
    { key: 'contact', icon: MessageSquare },
] as const;

type SectionKey = typeof SECTIONS[number]['key'];

export default function PrivacyPolicyPage() {
    const { t } = useTranslation();
    const [active, setActive] = useState<SectionKey>('collection');

    return (
        <>
            <Head title={t('privacy.title')} />
            <TopBar />
            <Navbar />

            {/* Hero */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center mx-auto mb-5">
                    <Shield size={28} className="text-orange-400" />
                </div>
                <h1 className="text-4xl font-extrabold mb-3">{t('privacy.title')}</h1>
                <p className="text-gray-400 max-w-md mx-auto text-sm mb-3">{t('privacy.subtitle')}</p>
                <span className="inline-block text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                    {t('privacy.last_updated')}
                </span>
            </div>

            <div className="bg-gray-50 min-h-screen py-12 px-4">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8">

                    {/* Sidebar nav */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-24">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Contents</p>
                            <nav className="space-y-1">
                                {SECTIONS.map(({ key, icon: Icon }) => (
                                    <button
                                        key={key}
                                        onClick={() => setActive(key)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${active === key
                                                ? 'bg-orange-50 text-orange-600'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon size={15} className={active === key ? 'text-orange-500' : 'text-gray-400'} />
                                        {t(`privacy.sections.${key}.title`)}
                                        {active === key && <ChevronRight size={13} className="ml-auto text-orange-400" />}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Content area */}
                    <div className="lg:col-span-3 space-y-5">
                        {SECTIONS.map(({ key, icon: Icon }) => (
                            <div
                                key={key}
                                id={key}
                                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${active === key
                                        ? 'border-orange-200 shadow-md shadow-orange-50'
                                        : 'border-gray-100'
                                    }`}
                            >
                                <button
                                    onClick={() => setActive(key)}
                                    className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${active === key ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        <Icon size={18} />
                                    </div>
                                    <h2 className={`text-base font-bold ${active === key ? 'text-orange-600' : 'text-gray-800'}`}>
                                        {t(`privacy.sections.${key}.title`)}
                                    </h2>
                                    <ChevronRight
                                        size={16}
                                        className={`ml-auto transition-transform ${active === key ? 'rotate-90 text-orange-400' : 'text-gray-300'}`}
                                    />
                                </button>
                                {active === key && (
                                    <div className="px-6 pb-6">
                                        <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                                            {t(`privacy.sections.${key}.body`)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Footer note */}
                        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                                <Shield size={18} className="text-orange-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-orange-800 mb-1">Your privacy matters</p>
                                <p className="text-xs text-orange-600 leading-relaxed">
                                    We are committed to protecting your personal information and your right to privacy.
                                    If you have any questions, email us at <strong>privacy@shopella.com</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
