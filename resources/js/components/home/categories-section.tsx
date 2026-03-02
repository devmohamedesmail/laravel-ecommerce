import React from 'react';
import { ArrowRight, Shirt, Smartphone, Home as HomeIcon, Watch, Gem, Baby, Dumbbell, Palette } from 'lucide-react';

const categories = [
    {
        icon: Shirt,
        label: 'Fashion',
        count: '2,400+ items',
        color: 'from-pink-500 to-rose-400',
        bg: 'bg-pink-50',
        iconColor: 'text-pink-500',
    },
    {
        icon: Smartphone,
        label: 'Electronics',
        count: '1,800+ items',
        color: 'from-blue-500 to-cyan-400',
        bg: 'bg-blue-50',
        iconColor: 'text-blue-500',
    },
    {
        icon: HomeIcon,
        label: 'Home & Living',
        count: '3,200+ items',
        color: 'from-green-500 to-emerald-400',
        bg: 'bg-green-50',
        iconColor: 'text-green-600',
    },
    {
        icon: Watch,
        label: 'Watches',
        count: '640+ items',
        color: 'from-amber-500 to-yellow-400',
        bg: 'bg-amber-50',
        iconColor: 'text-amber-500',
    },
    {
        icon: Gem,
        label: 'Jewelry',
        count: '920+ items',
        color: 'from-purple-500 to-violet-400',
        bg: 'bg-purple-50',
        iconColor: 'text-purple-500',
    },
    {
        icon: Baby,
        label: 'Kids & Baby',
        count: '1,100+ items',
        color: 'from-sky-400 to-teal-400',
        bg: 'bg-sky-50',
        iconColor: 'text-sky-500',
    },
    {
        icon: Dumbbell,
        label: 'Sports',
        count: '870+ items',
        color: 'from-orange-500 to-amber-400',
        bg: 'bg-orange-50',
        iconColor: 'text-orange-500',
    },
    {
        icon: Palette,
        label: 'Beauty',
        count: '1,560+ items',
        color: 'from-red-400 to-pink-400',
        bg: 'bg-red-50',
        iconColor: 'text-red-400',
    },
];

export default function CategorySection() {
    return (
        <section className="py-14 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#c96] mb-2 block">Explore</span>
                        <h2 className="text-3xl font-extrabold text-gray-900">Shop by Category</h2>
                    </div>
                    <a
                        href="#"
                        className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#c96] hover:gap-3 transition-all"
                    >
                        View All <ArrowRight size={16} />
                    </a>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                    {categories.map(({ icon: Icon, label, count, color, bg, iconColor }) => (
                        <a
                            key={label}
                            href="#"
                            className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className={`w-14 h-14 rounded-xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}>
                                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                                <Icon size={26} className={`${iconColor} relative z-10`} />
                            </div>
                            <div className="text-center">
                                <div className="text-sm font-semibold text-gray-800 group-hover:text-[#c96] transition-colors leading-tight">
                                    {label}
                                </div>
                                <div className="text-[10px] text-gray-400 mt-0.5">{count}</div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
