import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, MoveRight } from 'lucide-react';
import TopBar from '@/components/home/top-header';
import Navbar from '@/components/home/navbar';
import Footer from '@/components/home/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CartItem {
    id: number;
    name: string;
    price: number;
    qty: number;
    category: string;
}

const INITIAL_ITEMS: CartItem[] = [
    { id: 1, name: 'Premium Wireless Headphones Pro', price: 89.99, qty: 1, category: 'Electronics' },
    { id: 2, name: 'Classic Leather Slim Wallet', price: 34.99, qty: 2, category: 'Fashion' },
    { id: 3, name: 'Minimalist Smart Watch Series 5', price: 199.00, qty: 1, category: 'Watches' },
];

export default function CartPage() {
    const { t } = useTranslation();
    const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);
    const [coupon, setCoupon] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);

    const updateQty = (id: number, delta: number) =>
        setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));

    const removeItem = (id: number) =>
        setItems(prev => prev.filter(i => i.id !== id));

    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = couponApplied ? subtotal * 0.1 : 0;
    const shipping = subtotal > 50 ? 0 : 9.99;
    const total = subtotal - discount + shipping;

    return (
        <>
            <Head title={t('cart.title')} />
            <TopBar />
            <Navbar />

            {/* Hero */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-10 px-4">
                <div className="max-w-7xl mx-auto flex items-center gap-3">
                    <ShoppingCart size={26} className="text-orange-400" />
                    <div>
                        <h1 className="text-2xl font-extrabold">{t('cart.title')}</h1>
                        <p className="text-gray-400 text-sm">{t('cart.subtitle')}</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 min-h-screen py-10 px-4">
                <div className="max-w-7xl mx-auto">

                    {items.length === 0 ? (
                        /* Empty state */
                        <div className="text-center py-24">
                            <div className="w-28 h-28 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag size={44} className="text-orange-300" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('cart.empty_title')}</h2>
                            <p className="text-gray-500 mb-8">{t('cart.empty_desc')}</p>
                            <Link href="/user/shop">
                                <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2 rounded-full px-8">
                                    {t('cart.empty_cta')} <ArrowRight size={16} />
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Items list */}
                            <div className="lg:col-span-2 space-y-4">
                                {items.map(item => (
                                    <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center hover:shadow-sm transition-shadow">
                                        {/* Thumbnail */}
                                        <div className="w-20 h-20 shrink-0 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                                            <ShoppingCart size={24} className="text-orange-300" />
                                        </div>
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] text-orange-500 font-semibold uppercase tracking-wide">{item.category}</p>
                                            <p className="text-sm font-semibold text-gray-800 mt-0.5 line-clamp-1">{item.name}</p>
                                            <p className="text-sm font-bold text-gray-900 mt-1">${item.price.toFixed(2)}</p>
                                        </div>
                                        {/* Qty */}
                                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5">
                                            <button onClick={() => updateQty(item.id, -1)} className="text-gray-500 hover:text-orange-500 transition-colors">
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                                            <button onClick={() => updateQty(item.id, 1)} className="text-gray-500 hover:text-orange-500 transition-colors">
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        {/* Line total */}
                                        <p className="text-sm font-extrabold text-gray-900 w-16 text-right">${(item.price * item.qty).toFixed(2)}</p>
                                        {/* Remove */}
                                        <button onClick={() => removeItem(item.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}

                                {/* Continue */}
                                <Link href="/user/shop" className="inline-flex items-center gap-2 text-sm text-orange-500 font-semibold hover:gap-3 transition-all mt-2">
                                    ← {t('cart.continue_shopping')}
                                </Link>
                            </div>

                            {/* Summary */}
                            <div className="space-y-4">
                                {/* Coupon */}
                                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                    <p className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
                                        <Tag size={14} className="text-orange-500" /> {t('cart.discount_code')}
                                    </p>
                                    <div className="flex gap-2">
                                        <Input
                                            value={coupon}
                                            onChange={e => setCoupon(e.target.value)}
                                            placeholder="SAVE10"
                                            className="text-sm"
                                        />
                                        <Button
                                            onClick={() => { if (coupon) setCouponApplied(true); }}
                                            variant="outline"
                                            className="shrink-0 text-orange-500 border-orange-300 hover:bg-orange-50 text-sm"
                                        >
                                            {t('cart.apply')}
                                        </Button>
                                    </div>
                                    {couponApplied && <p className="text-xs text-emerald-600 font-medium mt-2">✓ 10% discount applied!</p>}
                                </div>

                                {/* Totals */}
                                <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                                    <h3 className="font-bold text-gray-800 mb-4">{t('cart.order_summary')}</h3>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>{t('cart.subtotal')}</span>
                                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                                    </div>
                                    {couponApplied && (
                                        <div className="flex justify-between text-sm text-emerald-600">
                                            <span>{t('common.discount')}</span>
                                            <span>-${discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>{t('cart.shipping')}</span>
                                        <span className={shipping === 0 ? 'text-emerald-600 font-medium' : 'font-medium'}>
                                            {shipping === 0 ? t('cart.free_shipping') : `$${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-extrabold text-gray-900">
                                        <span>{t('cart.grand_total')}</span>
                                        <span className="text-orange-600">${total.toFixed(2)}</span>
                                    </div>
                                    <Link href="/user/checkout">
                                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2 rounded-xl py-3 font-bold mt-2">
                                            {t('cart.checkout')} <MoveRight size={16} />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}
