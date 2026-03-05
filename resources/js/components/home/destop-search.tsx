import React, { useState } from 'react'
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import {
    Search, ShoppingCart, Heart, User, Menu, X, ChevronDown,
    Zap, Shirt, Smartphone, Home as HomeIcon, Watch, Gem, Baby, Dumbbell
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
const categories = [
    { icon: Shirt, label: 'Fashion', href: '#' },
    { icon: Smartphone, label: 'Electronics', href: '#' },
    { icon: HomeIcon, label: 'Home & Living', href: '#' },
    { icon: Watch, label: 'Watches', href: '#' },
    { icon: Gem, label: 'Jewelry', href: '#' },
    { icon: Baby, label: 'Baby & Kids', href: '#' },
    { icon: Dumbbell, label: 'Sports', href: '#' },
    { icon: Zap, label: 'Flash Deals', href: '#' },
];
export default function DesktopSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const { t } = useTranslation();
    return (
        <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
            <div className="flex w-full border border-primary rounded-full overflow-hidden shadow-sm">
                {/* <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="border-0 border-r border-gray-200 rounded-none bg-gray-50 text-gray-600 text-xs h-full min-w-32 focus-visible:ring-0 shadow-none">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t('common.all_categories')}</SelectItem>
                        {categories.map(c => (
                            <SelectItem key={c.label} value={c.label}>{c.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select> */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search for products, brands…"
                    className="flex-1 px-4 py-2.5 text-sm outline-none bg-white text-gray-800 placeholder-gray-400"
                />
                <button className="bg-primary hover:bg-primary/80 transition-colors px-5 flex items-center justify-center">
                    <Search size={18} className="text-white" />
                </button>
            </div>
        </div>
    )
}
