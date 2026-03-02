import React, { useState } from 'react';
import { Phone, Mail, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';

export default function TopBar() {
    const {t, i18n } = useTranslation();


    const LANGUAGES = [
        { code: 'en', label: 'English' },
        { code: 'ar', label: 'العربية' },
    ];
    const currentLang = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0];

    const switchLanguage = (code: string) => {
        i18n.changeLanguage(code);
        document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = code;
    };

    return (
        <div className="bg-[#333] text-white text-xs">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9">
                {/* Left: promo + contact */}
                <div className="flex items-center gap-5">
                    <span className="hidden sm:block font-medium tracking-wide">
                        {t('common.free_shipping')}
                    </span>
                    <span className="hidden md:flex items-center gap-1 text-gray-300">
                        <Phone size={11} />
                        <a href="tel:+11234567890" className="hover:text-secondary transition-colors">{t('common.contact_phone')}</a>
                    </span>
                    <span className="hidden md:flex items-center gap-1 text-gray-300">
                        <Mail size={11} />
                        <a href="mailto:support@shopella.com" className="hover:text-secondary transition-colors">support@shopella.com</a>
                    </span>
                </div>

                {/* Right: currency, language, links */}
                <div className="flex items-center gap-4">

                   

                    {/* Language Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1 hover:text-[#c96] transition-colors outline-none">
                            {currentLang.label} <ChevronDown size={11} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-24">
                            {LANGUAGES.map(l => (
                                <DropdownMenuItem
                                    key={l.code}
                                    onClick={() => switchLanguage(l.code)}
                                    className={`text-xs justify-between gap-2 ${i18n.language === l.code ? 'text-[#c96] font-semibold' : ''}`}
                                >
                                    {l.label} {i18n.language === l.code && <Check size={11} />}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <span className="text-gray-400">|</span>
                    <Link href="/login" className="hover:text-[#c96] transition-colors">{t('common.sign_in')}</Link>
                    <Link href="/register" className="hover:text-[#c96] transition-colors">{t('common.register')}</Link>
                </div>
            </div>
        </div>
    );
}
