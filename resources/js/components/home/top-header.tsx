import React, { useState } from 'react';
import { Phone, Mail, ChevronDown, Check, LayoutDashboard, User, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Link, router, usePage } from '@inertiajs/react';


export default function TopBar() {
    const { t, i18n } = useTranslation();


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
    const { auth } = usePage().props as any

    const handleLogout = () => {
        router.post('/logout');
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




                    {auth?.user ? (


                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-lg hover:bg-accent/50 transition-all duration-200 outline-none">
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-white font-semibold text-sm">
                                        {auth.user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-medium text-foreground">{auth.user.name}</p>
                                        <p className="text-xs text-muted-foreground">{t('header.my-account')}</p>
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 sm:w-72">
                                {/* User Info Section */}
                                <div className="p-4 border-b border-border bg-accent/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-lg">
                                            {auth.user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate">{auth.user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{auth.user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard" className="cursor-pointer">
                                        <LayoutDashboard className="w-5 h-5 text-primary" />
                                        <span>{t('header.dashboard')}</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="cursor-pointer">
                                        <User className="w-5 h-5 text-primary" />
                                        <span>{t('header.profile')}</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem variant="destructive" onClick={handleLogout} className="cursor-pointer">
                                    <LogOut className="w-5 h-5" />
                                    <span>{t('auth.logout')}</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <span className="text-gray-400">|</span>
                            <Link href="/login" className="hover:text-[#c96] transition-colors">{t('common.sign_in')}</Link>
                            <Link href="/register" className="hover:text-[#c96] transition-colors">{t('common.register')}</Link></>
                    )}




                </div>
            </div>
        </div>
    );
}
