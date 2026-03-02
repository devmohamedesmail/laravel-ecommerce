import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Heart, ShoppingCart, Trash2, Share2, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import TopBar from '@/components/home/top-header';
import Navbar from '@/components/home/navbar';
import Footer from '@/components/home/footer';
import { Button } from '@/components/ui/button';

interface WishlistItem {
    id: number;
    name: string;
    price: number;
    oldPrice: number | null;
    rating: number;
    category: string;
    inStock: boolean;
}

const INITIAL: WishlistItem[] = [
    { id: 1, name: 'Premium Wireless Noise-Cancelling Headphones', price: 89.99, oldPrice: 149.99, rating: 4.5, category: 'Electronics', inStock: true },
    { id: 2, name: '18K Gold Plated Layered Necklace Set', price: 45.00, oldPrice: 75.00, rating: 5, category: 'Jewelry', inStock: true },
    { id: 3, name: 'Ultra-Boost Running Shoes Breathable Mesh', price: 79.99, oldPrice: 120.00, rating: 4.5, category: 'Sports', inStock: false },
    { id: 4, name: 'Ergonomic Office Chair with Lumbar Support', price: 249.99, oldPrice: 399.99, rating: 4, category: 'Home', inStock: true },
    { id: 5, name: 'Natural Skincare Gift Set Bamboo & Rose', price: 65.00, oldPrice: null, rating: 5, category: 'Beauty', inStock: true },
    { id: 6, name: 'Minimalist Stainless Steel Smart Watch', price: 199.00, oldPrice: 280.00, rating: 4.5, category: 'Watches', inStock: true },
];

function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={11} className={s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'} />
            ))}
        </div>
    );
}

export default function WishlistPage() {
    const { t } = useTranslation();
    const [items, setItems] = useState<WishlistItem[]>(INITIAL);
    const [addedIds, setAddedIds] = useState<number[]>([]);

    const removeItem = (id: number) => setItems(prev => prev.filter(i => i.id !== id));
    const clearAll = () => setItems([]);
    const addToCart = (id: number) => setAddedIds(prev => [...prev, id]);

    return (
        <>
            <Head title={t('wishlist.title')} />
            <TopBar />
            <Navbar />

            {/* Hero */}
            <div className="bg-gradient-to-r from-rose-600 to-orange-500 text-white py-10 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Heart size={26} className="fill-white" />
                        <div>
                            <h1 className="text-2xl font-extrabold">{t('wishlist.title')}</h1>
                            <p className="text-white/80 text-sm">{t('wishlist.subtitle')}</p>
                        </div>
                    </div>
                    {items.length > 0 && (
                        <div className="flex gap-3">
                            <button
                                onClick={clearAll}
                                className="flex items-center gap-2 text-sm text-white/80 hover:text-white border border-white/30 px-4 py-2 rounded-full hover:border-white transition-colors"
                            >
                                <Trash2 size={14} /> {t('wishlist.clear_all')}
                            </button>
                            <button className="flex items-center gap-2 text-sm bg-white text-rose-600 font-semibold px-4 py-2 rounded-full hover:bg-rose-50 transition-colors">
                                <Share2 size={14} /> {t('wishlist.share')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gray-50 min-h-screen py-10 px-4">
                <div className="max-w-7xl mx-auto">

                    {items.length === 0 ? (
                        <div className="text-center py-24">
                            <div className="w-28 h-28 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-6">
                                <Heart size={44} className="text-rose-300" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('wishlist.empty_title')}</h2>
                            <p className="text-gray-500 mb-8">{t('wishlist.empty_desc')}</p>
                            <Link href="/user/shop">
                                <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2 rounded-full px-8">
                                    {t('wishlist.empty_cta')} <ArrowRight size={16} />
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-gray-500 mb-5">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {items.map(item => {
                                    const disc = item.oldPrice ? Math.round((1 - item.price / item.oldPrice) * 100) : 0;
                                    const added = addedIds.includes(item.id);
                                    return (
                                        <div key={item.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                            {/* Image */}
                                            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-40 flex items-center justify-center">
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-orange-50 flex items-center justify-center">
                                                    <ShoppingBag size={28} className="text-rose-300" />
                                                </div>
                                                {!item.inStock && (
                                                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Out of Stock</span>
                                                    </div>
                                                )}
                                                {disc > 0 && (
                                                    <span className="absolute top-2 left-2 text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">-{disc}%</span>
                                                )}
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500 text-gray-400"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                            {/* Info */}
                                            <div className="p-4">
                                                <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wide mb-1">{item.category}</p>
                                                <p className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 leading-snug">{item.name}</p>
                                                <Stars rating={item.rating} />
                                                <div className="flex items-center gap-2 mt-2 mb-3">
                                                    <span className="text-base font-extrabold text-gray-900">${item.price}</span>
                                                    {item.oldPrice && <span className="text-xs text-gray-400 line-through">${item.oldPrice}</span>}
                                                </div>
                                                <button
                                                    onClick={() => addToCart(item.id)}
                                                    disabled={!item.inStock || added}
                                                    className={`w-full py-2 text-xs font-bold rounded-xl transition-all gap-2 flex items-center justify-center ${added
                                                            ? 'bg-emerald-500 text-white'
                                                            : item.inStock
                                                                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    <ShoppingCart size={13} />
                                                    {added ? '✓ Added' : t('wishlist.add_to_cart')}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}
