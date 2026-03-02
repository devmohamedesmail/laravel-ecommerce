import React, { useState } from 'react';
import { Phone, Mail, ChevronDown } from 'lucide-react';

export default function TopBar() {
    const [showCurrency, setShowCurrency] = useState(false);
    const [showLang, setShowLang] = useState(false);
    const [currency, setCurrency] = useState('USD');
    const [lang, setLang] = useState('English');

    return (
        <div className="bg-[#333] text-white text-xs">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9">
                {/* Left: promo + contact */}
                <div className="flex items-center gap-5">
                    <span className="hidden sm:block font-medium tracking-wide">
                        🔥 Free shipping on orders over <span className="text-[#c96] font-bold">$50</span>
                    </span>
                    <span className="hidden md:flex items-center gap-1 text-gray-300">
                        <Phone size={11} />
                        <a href="tel:+11234567890" className="hover:text-[#c96] transition-colors">+1 (123) 456-7890</a>
                    </span>
                    <span className="hidden md:flex items-center gap-1 text-gray-300">
                        <Mail size={11} />
                        <a href="mailto:support@shopella.com" className="hover:text-[#c96] transition-colors">support@shopella.com</a>
                    </span>
                </div>

                {/* Right: currency, language, links */}
                <div className="flex items-center gap-4">
                    {/* Currency Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowCurrency(!showCurrency); setShowLang(false); }}
                            className="flex items-center gap-1 hover:text-[#c96] transition-colors"
                        >
                            {currency} <ChevronDown size={11} />
                        </button>
                        {showCurrency && (
                            <div className="absolute top-full right-0 mt-1 bg-white text-gray-800 shadow-lg rounded z-50 min-w-[80px]">
                                {['USD', 'EUR', 'GBP'].map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => { setCurrency(c); setShowCurrency(false); }}
                                        className={`block w-full px-3 py-1.5 text-xs text-left hover:bg-gray-100 ${currency === c ? 'text-[#c96] font-semibold' : ''}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Language Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowLang(!showLang); setShowCurrency(false); }}
                            className="flex items-center gap-1 hover:text-[#c96] transition-colors"
                        >
                            {lang} <ChevronDown size={11} />
                        </button>
                        {showLang && (
                            <div className="absolute top-full right-0 mt-1 bg-white text-gray-800 shadow-lg rounded z-50 min-w-[90px]">
                                {['English', 'العربية', 'Français'].map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => { setLang(l); setShowLang(false); }}
                                        className={`block w-full px-3 py-1.5 text-xs text-left hover:bg-gray-100 ${lang === l ? 'text-[#c96] font-semibold' : ''}`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <span className="text-gray-400">|</span>
                    <a href="/login" className="hover:text-[#c96] transition-colors">Sign In</a>
                    <a href="/register" className="hover:text-[#c96] transition-colors">Register</a>
                </div>
            </div>
        </div>
    );
}
