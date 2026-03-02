import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    Search, SlidersHorizontal, Heart, ShoppingCart, Star, X,
    ChevronDown, ChevronUp, Grid3X3, List, ArrowUpDown
} from 'lucide-react';
import TopBar from '@/components/home/top-header';
import Navbar from '@/components/home/navbar';
import Footer from '@/components/home/footer';
import { Button } from '@/components/ui/button';

const PRODUCTS = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: `Premium Product ${i + 1}`,
    price: Math.floor(Math.random() * 180) + 20,
    oldPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 250) + 100 : null,
    rating: +(Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 500) + 10,
    category: ['Fashion', 'Electronics', 'Home', 'Sports', 'Beauty'][i % 5],
    badge: i % 7 === 0 ? 'Sale' : i % 9 === 0 ? 'New' : null,
    inStock: Math.random() > 0.15,
}));

const CATEGORIES = ['Fashion', 'Electronics', 'Home & Living', 'Sports', 'Beauty', 'Watches', 'Jewelry'];
const BRANDS = ['Nike', 'Apple', 'Samsung', 'Zara', 'IKEA', 'Gucci', 'Sony'];

function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <Star
                    key={s}
                    size={11}
                    className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
                />
            ))}
        </div>
    );
}

function ProductCard({ p, onAddToCart, onWishlist }: any) {
    const [wished, setWished] = useState(false);
    const disc = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

    return (
        <div className="group bg-white rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
            {/* Image area */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 aspect-square flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center">
                    <ShoppingCart size={32} className="text-orange-300" />
                </div>
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {p.badge === 'Sale' && <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">SALE -{disc}%</span>}
                    {p.badge === 'New' && <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">NEW</span>}
                    {!p.inStock && <span className="text-[10px] font-bold bg-gray-400 text-white px-2 py-0.5 rounded-full">Out of Stock</span>}
                </div>
                {/* Wishlist btn */}
                <button
                    onClick={() => { setWished(!wished); onWishlist(p); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                >
                    <Heart size={14} className={wished ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                </button>
                {/* Quick add overlay */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                        onClick={() => onAddToCart(p)}
                        disabled={!p.inStock}
                        className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        + Add to Cart
                    </button>
                </div>
            </div>
            {/* Info */}
            <div className="p-3 flex flex-col gap-1.5 flex-1">
                <p className="text-[10px] text-orange-500 font-semibold uppercase tracking-wide">{p.category}</p>
                <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">{p.name}</p>
                <Stars rating={p.rating} />
                <div className="flex items-center gap-2 mt-auto pt-1">
                    <span className="text-base font-extrabold text-gray-900">${p.price}</span>
                    {p.oldPrice && <span className="text-xs text-gray-400 line-through">${p.oldPrice}</span>}
                </div>
            </div>
        </div>
    );
}

export default function ShopPage() {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('newest');
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [showFilter, setShowFilter] = useState(false);
    const [selectedCats, setSelectedCats] = useState<string[]>([]);
    const [priceMax, setPriceMax] = useState(200);
    const [cartCount, setCartCount] = useState(0);

    const toggleCat = (c: string) =>
        setSelectedCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

    const filtered = PRODUCTS.filter(p => {
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (selectedCats.length && !selectedCats.includes(p.category)) return false;
        if (p.price > priceMax) return false;
        return true;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (sort === 'price_asc') return a.price - b.price;
        if (sort === 'price_desc') return b.price - a.price;
        if (sort === 'popular') return b.reviews - a.reviews;
        return b.id - a.id;
    });

    return (
        <>
            <Head title={t('shop.title')} />
            <TopBar />
            <Navbar />

            {/* Hero */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{t('shop.title')}</h1>
                    <p className="text-gray-400 text-sm mb-6">{t('shop.subtitle')}</p>
                    {/* Search */}
                    <div className="flex max-w-xl mx-auto border-2 border-orange-500 rounded-full overflow-hidden bg-white">
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder={t('common.search_placeholder')}
                            className="flex-1 px-5 py-3 text-sm text-gray-800 outline-none"
                        />
                        <button className="bg-orange-500 hover:bg-orange-600 px-6 transition-colors">
                            <Search size={18} className="text-white" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex gap-6">

                        {/* Sidebar */}
                        <aside className="hidden lg:block w-60 shrink-0">
                            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-800 text-sm">{t('shop.filter')}</h3>
                                    {selectedCats.length > 0 && (
                                        <button onClick={() => setSelectedCats([])} className="text-xs text-orange-500 hover:underline">{t('shop.clear_filters')}</button>
                                    )}
                                </div>
                                {/* Categories */}
                                <div className="mb-5">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{t('common.all_categories')}</p>
                                    <div className="space-y-2">
                                        {CATEGORIES.map(c => (
                                            <label key={c} className="flex items-center gap-2.5 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCats.includes(c)}
                                                    onChange={() => toggleCat(c)}
                                                    className="accent-orange-500 w-3.5 h-3.5"
                                                />
                                                <span className="text-sm text-gray-600 group-hover:text-orange-500 transition-colors">{c}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                {/* Price */}
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{t('shop.price_range')}</p>
                                    <input
                                        type="range" min={0} max={300} value={priceMax}
                                        onChange={e => setPriceMax(+e.target.value)}
                                        className="w-full accent-orange-500"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>$0</span><span className="font-semibold text-orange-600">${priceMax}</span>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main */}
                        <div className="flex-1 min-w-0">
                            {/* Toolbar */}
                            <div className="flex items-center justify-between mb-5 bg-white rounded-xl border border-gray-100 px-4 py-3">
                                <span className="text-sm text-gray-500">{sorted.length} {t('shop.title')}</span>
                                <div className="flex items-center gap-3">
                                    {/* Sort */}
                                    <div className="flex items-center gap-2">
                                        <ArrowUpDown size={14} className="text-gray-400" />
                                        <select
                                            value={sort}
                                            onChange={e => setSort(e.target.value)}
                                            className="text-sm text-gray-600 outline-none bg-transparent cursor-pointer"
                                        >
                                            <option value="newest">{t('shop.sort_options.newest')}</option>
                                            <option value="price_asc">{t('shop.sort_options.price_asc')}</option>
                                            <option value="price_desc">{t('shop.sort_options.price_desc')}</option>
                                            <option value="popular">{t('shop.sort_options.popular')}</option>
                                        </select>
                                    </div>
                                    {/* View toggle */}
                                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
                                        <button onClick={() => setView('grid')} className={`p-1 rounded ${view === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-400'}`}><Grid3X3 size={14} /></button>
                                        <button onClick={() => setView('list')} className={`p-1 rounded ${view === 'list' ? 'bg-orange-500 text-white' : 'text-gray-400'}`}><List size={14} /></button>
                                    </div>
                                </div>
                            </div>

                            {sorted.length === 0 ? (
                                <div className="text-center py-20 text-gray-400">
                                    <ShoppingCart size={48} className="mx-auto mb-3 opacity-30" />
                                    <p>{t('shop.no_products')}</p>
                                </div>
                            ) : (
                                <div className={view === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4' : 'flex flex-col gap-4'}>
                                    {sorted.map(p => (
                                        <ProductCard
                                            key={p.id}
                                            p={p}
                                            onAddToCart={() => setCartCount(c => c + 1)}
                                            onWishlist={() => { }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
