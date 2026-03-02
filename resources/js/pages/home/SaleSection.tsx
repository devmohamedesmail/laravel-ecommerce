import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, ArrowRight, Flame } from 'lucide-react';

const saleProducts = [
    {
        id: 1,
        name: 'Wireless Earbuds Pro — Noise Cancelling, 30h Battery',
        price: 39.99,
        oldPrice: 89.99,
        rating: 4.5,
        reviews: 1204,
        sold: 843,
        stock: 1000,
        emoji: '🎧',
    },
    {
        id: 2,
        name: 'Mechanical Gaming Keyboard RGB Backlit Tenkeyless',
        price: 54.99,
        oldPrice: 110.00,
        rating: 4,
        reviews: 876,
        sold: 620,
        stock: 800,
        emoji: '⌨️',
    },
    {
        id: 3,
        name: 'Yoga Mat Premium Non-Slip 6mm Extra Thick',
        price: 24.99,
        oldPrice: 49.99,
        rating: 5,
        reviews: 432,
        sold: 390,
        stock: 500,
        emoji: '🧘',
    },
    {
        id: 4,
        name: 'Stainless Steel Insulated Tumbler 20oz — 5 Colors',
        price: 19.99,
        oldPrice: 39.99,
        rating: 4.5,
        reviews: 2100,
        sold: 1800,
        stock: 2000,
        emoji: '🥤',
    },
];

function useCountdown(targetDate: Date) {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    useEffect(() => {
        const calc = () => {
            const diff = targetDate.getTime() - Date.now();
            if (diff <= 0) return;
            setTimeLeft({
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        };
        calc();
        const t = setInterval(calc, 1000);
        return () => clearInterval(t);
    }, []);
    return timeLeft;
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function SaleSection() {
    const endTime = new Date(Date.now() + 18 * 60 * 60 * 1000 + 45 * 60 * 1000); // ~18h 45m from now
    const { hours, minutes, seconds } = useCountdown(endTime);
    const [wishlisted, setWishlisted] = useState<Record<number, boolean>>({});

    return (
        <section className="py-14 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Flame size={18} className="text-red-500 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-widest text-red-500">Flash Sale</span>
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900">Deals of the Day</h2>
                        </div>
                        {/* Countdown */}
                        <div className="flex items-center gap-1.5 ml-4">
                            {[
                                { val: pad(hours), label: 'HRS' },
                                { val: pad(minutes), label: 'MIN' },
                                { val: pad(seconds), label: 'SEC' },
                            ].map((t, i) => (
                                <React.Fragment key={t.label}>
                                    {i > 0 && <span className="text-red-500 font-bold text-lg self-start pt-1">:</span>}
                                    <div className="flex flex-col items-center">
                                        <div className="bg-red-500 text-white text-lg font-extrabold w-12 h-12 rounded-lg flex items-center justify-center shadow-md shadow-red-200 tabular-nums">
                                            {t.val}
                                        </div>
                                        <div className="text-[9px] text-gray-500 mt-1 font-semibold">{t.label}</div>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <a href="#" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#c96] hover:gap-3 transition-all">
                        View All Deals <ArrowRight size={16} />
                    </a>
                </div>

                {/* Sale Products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {saleProducts.map((product) => {
                        const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
                        const progress = Math.round((product.sold / product.stock) * 100);
                        return (
                            <div
                                key={product.id}
                                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                {/* Image area */}
                                <div className="relative bg-gradient-to-br from-red-50 to-orange-50 aspect-square flex items-center justify-center overflow-hidden">
                                    <span className="text-7xl group-hover:scale-110 transition-transform duration-500">{product.emoji}</span>
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-red-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow">
                                            -{discount}%
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setWishlisted(w => ({ ...w, [product.id]: !w[product.id] }))}
                                        className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:text-red-500 transition-colors"
                                    >
                                        <Heart size={14} fill={wishlisted[product.id] ? 'currentColor' : 'none'} className={wishlisted[product.id] ? 'text-red-500' : 'text-gray-400'} />
                                    </button>
                                </div>

                                {/* Info */}
                                <div className="p-4 flex flex-col flex-1 gap-2">
                                    <p className="text-xs text-gray-500 leading-snug line-clamp-2 font-medium">{product.name}</p>

                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} size={11} fill={s <= Math.round(product.rating) ? '#f59e0b' : '#e5e7eb'} className={s <= Math.round(product.rating) ? 'text-amber-400' : 'text-gray-200'} />
                                        ))}
                                        <span className="text-xs text-gray-400">({product.reviews})</span>
                                    </div>

                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-extrabold text-red-500">${product.price}</span>
                                        <span className="text-sm text-gray-400 line-through">${product.oldPrice}</span>
                                    </div>

                                    {/* Stock progress */}
                                    <div>
                                        <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                                            <span>Sold: <span className="font-semibold text-gray-700">{product.sold}</span></span>
                                            <span>Available: <span className="font-semibold text-gray-700">{product.stock - product.sold}</span></span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full transition-all"
                                                style={{
                                                    width: `${progress}%`,
                                                    background: progress > 80 ? '#ef4444' : progress > 50 ? '#f97316' : '#c96'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <button className="mt-auto flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-bold py-2.5 rounded-xl transition-all duration-200">
                                        <ShoppingCart size={15} />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
