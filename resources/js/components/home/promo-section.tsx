import React from 'react';
import { ArrowRight, Tag, Truck, Shield } from 'lucide-react';

const banners = [
    {
        title: 'Spring Fashion\nLookbook 2026',
        desc: 'Fresh styles for a fresh season — curated by our style experts.',
        cta: 'Shop Collection',
        bg: 'from-[#fdf2e9] to-[#fce8d5]',
        accent: '#c96',
        emoji: '🌸',
        tag: 'New Season',
    },
    {
        title: 'Smart Home\nEssentials',
        desc: 'Upgrade your living space with the latest smart devices.',
        cta: 'Explore Now',
        bg: 'from-[#eaf4fb] to-[#d5eaf7]',
        accent: '#2196f3',
        emoji: '🏠',
        tag: 'Top Picks',
    },
];

export default function PromoSection() {
    return (
        <section className="py-14 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 space-y-12">

                {/* Top two-column promo banners */}
                <div className="grid md:grid-cols-2 gap-6">
                    {banners.map((b) => (
                        <div
                            key={b.title}
                            className={`relative bg-gradient-to-br ${b.bg} rounded-2xl p-8 overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300`}
                        >
                            {/* Background emoji */}
                            <div className="absolute right-6 bottom-4 text-[120px] opacity-15 group-hover:scale-110 group-hover:opacity-25 transition-all duration-500 select-none">
                                {b.emoji}
                            </div>
                            <span
                                className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4"
                                style={{ background: `${b.accent}18`, color: b.accent }}
                            >
                                {b.tag}
                            </span>
                            <h3
                                className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 whitespace-pre-line leading-tight"
                            >
                                {b.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-6 max-w-xs">{b.desc}</p>
                            <a
                                href="#"
                                className="inline-flex items-center gap-2 text-sm font-bold group-inner hover:gap-4 transition-all duration-200"
                                style={{ color: b.accent }}
                            >
                                {b.cta} <ArrowRight size={16} />
                            </a>
                        </div>
                    ))}
                </div>

                {/* Full-width Banner */}
                <div className="relative bg-gradient-to-r from-[#1a1a2e] to-[#16213e] rounded-2xl p-8 md:p-12 overflow-hidden flex flex-col md:flex-row items-center gap-8">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="w-full h-full" style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)',
                            backgroundSize: '20px 20px'
                        }} />
                    </div>
                    <div
                        className="absolute right-0 top-0 bottom-0 w-1/2 opacity-5"
                        style={{
                            background: 'radial-gradient(ellipse at right, #c96 0%, transparent 70%)'
                        }}
                    />

                    <div className="relative z-10 flex-1">
                        <span className="inline-block bg-[#c96]/20 text-[#c96] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                            Limited Offer
                        </span>
                        <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                            Members Get <span className="text-[#c96]">Extra 20%</span> Off
                        </h3>
                        <p className="text-gray-400 max-w-md mb-6">
                            Join Shopella Plus and unlock exclusive savings, early access to sales, and free express shipping on every order.
                        </p>
                        <a
                            href="#"
                            className="inline-flex items-center gap-2 bg-[#c96] hover:bg-[#b8852a] text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all hover:gap-3"
                        >
                            Join for Free <ArrowRight size={16} />
                        </a>
                    </div>

                    <div className="relative z-10 flex gap-6 flex-shrink-0">
                        {[
                            { icon: Tag, val: '20%', label: 'Extra Savings' },
                            { icon: Truck, val: 'Free', label: 'Express Shipping' },
                            { icon: Shield, val: 'VIP', label: 'Member Access' },
                        ].map(({ icon: Icon, val, label }) => (
                            <div key={label} className="flex flex-col items-center text-center text-white">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-2">
                                    <Icon size={20} className="text-[#c96]" />
                                </div>
                                <div className="text-xl font-extrabold text-[#c96]">{val}</div>
                                <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
