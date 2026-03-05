import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const slides = [
    {
        id: 1,
        badge: 'New Arrivals',
        title: 'Elevate Your\nWardrobe Game',
        subtitle: 'Discover the latest fashion trends with up to 40% off on premium collections',
        cta: 'Shop Now',
        ctaHref: '#',
        bg: 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
        accent: '#c96',
        imageGradient: 'from-amber-400/20 to-orange-500/10',
        pattern: 'circles',
    },
    {
        id: 2,
        badge: 'Electronics Sale',
        title: 'Tech Deals That\nBlow Your Mind',
        subtitle: 'Premium gadgets & electronics at unbeatable prices — up to 60% savings',
        cta: 'Explore Deals',
        ctaHref: '#',
        bg: 'from-[#0d1b2a] via-[#1b2a3b] to-[#243447]',
        accent: '#4f9cf9',
        imageGradient: 'from-blue-400/20 to-cyan-500/10',
        pattern: 'dots',
    },
    {
        id: 3,
        badge: 'Flash Sale — 24h Only',
        title: 'Summer Collection\nIs Here!',
        subtitle: 'Fresh styles for every occasion — free shipping on all orders today',
        cta: 'Grab the Deal',
        ctaHref: '#',
        bg: 'from-[#1a0a00] via-[#2d1200] to-[#3d1a00]',
        accent: '#f97316',
        imageGradient: 'from-orange-400/25 to-red-500/10',
        pattern: 'waves',
    },
];

const stats = [
    { value: '50K+', label: 'Products' },
    { value: '200+', label: 'Brands' },
    { value: '1M+', label: 'Customers' },
    { value: '24/7', label: 'Support' },
];

export default function HeroBanner() {
    const [current, setCurrent] = useState(0);
    const [transitioning, setTransitioning] = useState(false);
    const {t,i18n}=useTranslation()

    const goTo = (index: number) => {
        if (transitioning) return;
        setTransitioning(true);
        setTimeout(() => {
            setCurrent(index);
            setTransitioning(false);
        }, 300);
    };

    const prev = () => goTo((current - 1 + slides.length) % slides.length);
    const next = () => goTo((current + 1) % slides.length);

    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [current]);

    const slide = slides[current];

    return (
        <section className="relative overflow-hidden">
            {/* Main Slide */}
            <div className={`bg-gradient-to-br ${slide.bg} relative min-h-[520px] md:min-h-[600px] flex items-center transition-all duration-500`}>
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                    {slide.pattern === 'circles' && (
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="circles" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                                    <circle cx="30" cy="30" r="20" fill="none" stroke="white" strokeWidth="1" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#circles)" />
                        </svg>
                    )}
                    {slide.pattern === 'dots' && (
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                                    <circle cx="5" cy="5" r="2" fill="white" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#dots)" />
                        </svg>
                    )}
                </div>

                {/* Glow orbs */}
                <div
                    className="absolute top-10 right-20 w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-700"
                    style={{ background: slide.accent }}
                />
                <div
                    className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full blur-2xl opacity-10 transition-all duration-700"
                    style={{ background: slide.accent }}
                />

                <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Text Content */}
                        <div className={`text-white transition-all duration-500 ${transitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                            <span
                                className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
                                style={{ background: `${slide.accent}25`, color: slide.accent, border: `1px solid ${slide.accent}40` }}
                            >
                                ✨ {slide.badge}
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5 whitespace-pre-line">
                                {slide.title.split('\n').map((t, i) => (
                                    <span key={i} className="block">
                                        {i === 1 ? <span style={{ color: slide.accent }}>{t}</span> : t}
                                    </span>
                                ))}
                            </h1>
                            <p className="text-gray-300 text-base md:text-lg mb-8 max-w-md leading-relaxed">
                                {slide.subtitle}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href={slide.ctaHref}
                                    className="group inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold rounded-full text-white transition-all duration-300 hover:gap-3 hover:shadow-xl"
                                    style={{ background: slide.accent }}
                                >
                                    {slide.cta}
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a
                                    href="#"
                                    className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-full border border-white/30 text-white hover:bg-white/10 transition-all duration-300"
                                >
                                    View Catalog
                                </a>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-6 mt-10 pt-8 border-t border-white/10">
                                {stats.map((s) => (
                                    <div key={s.label}>
                                        <div className="text-xl font-extrabold" style={{ color: slide.accent }}>{s.value}</div>
                                        <div className="text-gray-400 text-xs">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visual side */}
                        <div className={`relative hidden md:flex items-center justify-center transition-all duration-500 ${transitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                            <div
                                className="w-80 h-80 lg:w-96 lg:h-96 rounded-full flex items-center justify-center"
                                style={{ background: `radial-gradient(circle, ${slide.accent}15, transparent 70%)` }}
                            >
                                {/* Product mockup rings */}
                                <div
                                    className="w-72 h-72 rounded-full border border-dashed opacity-30 animate-spin"
                                    style={{ borderColor: slide.accent, animationDuration: '20s' }}
                                />
                                <div
                                    className="absolute w-56 h-56 rounded-full border border-dashed opacity-20 animate-spin"
                                    style={{ borderColor: slide.accent, animationDuration: '15s', animationDirection: 'reverse' }}
                                />
                                {/* Center badge */}
                                <div
                                    className="absolute flex flex-col items-center justify-center w-40 h-40 rounded-full text-white text-center shadow-2xl"
                                    style={{ background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}bb)` }}
                                >
                                    <span className="text-3xl font-black">40%</span>
                                    <span className="text-xs font-semibold uppercase tracking-wider opacity-90">OFF</span>
                                    <span className="text-[10px] opacity-75 mt-1">This Week</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slide Controls */}
                <button
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                >
                    <ChevronRight size={20} />
                </button>

                {/* Dots */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className="rounded-full transition-all duration-300"
                            style={{
                                width: i === current ? '24px' : '8px',
                                height: '8px',
                                background: i === current ? slide.accent : 'rgba(255,255,255,0.4)',
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Feature Pills below hero */}
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
                        {[
                            { icon: '🚚', title: t('feature.free_shipping'), desc: t('feature.free_shipping_desc') },
                            { icon: '🔄', title: t('feature.easy_returns'), desc: t('feature.easy_returns_desc') },
                            { icon: '🔒', title: t('feature.secure_payment'), desc: t('feature.secure_payment_desc') },
                            { icon: '🎧', title: t('feature.24_7_support'), desc: t('feature.24_7_support_desc') },
                        ].map((f) => (
                            <div key={f.title} className="flex items-center gap-3 px-6 py-4 hover:bg-orange-50 transition-colors cursor-default">
                                <span className="text-2xl">{f.icon}</span>
                                <div>
                                    <div className="text-sm font-semibold text-gray-800">{f.title}</div>
                                    <div className="text-xs text-gray-500">{f.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
