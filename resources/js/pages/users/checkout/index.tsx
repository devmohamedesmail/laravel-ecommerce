import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    CreditCard, Truck, ClipboardCheck, CheckCircle,
    Lock, ChevronRight, ShoppingCart, AlertCircle
} from 'lucide-react';
import TopBar from '@/components/home/top-header';
import Navbar from '@/components/home/navbar';
import Footer from '@/components/home/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ORDER_ITEMS = [
    { name: 'Premium Wireless Headphones', price: 89.99, qty: 1 },
    { name: 'Classic Leather Wallet', price: 34.99, qty: 2 },
];

const STEPS = ['shipping', 'payment', 'review'] as const;
type Step = typeof STEPS[number];

const STEP_ICONS: Record<Step, React.ElementType> = {
    shipping: Truck,
    payment: CreditCard,
    review: ClipboardCheck,
};

export default function CheckoutPage() {
    const { t } = useTranslation();
    const [step, setStep] = useState<Step>('shipping');
    const [placed, setPlaced] = useState(false);
    const [payMethod, setPayMethod] = useState<'card' | 'cod' | 'paypal'>('card');

    const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = 0;
    const total = subtotal + shipping;

    const stepIndex = STEPS.indexOf(step);

    if (placed) {
        return (
            <>
                <Head title={t('checkout.success_title')} />
                <TopBar />
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                    <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full text-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-emerald-500" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{t('checkout.success_title')}</h1>
                        <p className="text-gray-500 text-sm mb-8">{t('checkout.success_desc')}</p>
                        <Link href="/">
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8">
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Head title={t('checkout.title')} />
            <TopBar />
            <Navbar />

            {/* Hero */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-10 px-4">
                <div className="max-w-7xl mx-auto flex items-center gap-3">
                    <Lock size={22} className="text-orange-400" />
                    <div>
                        <h1 className="text-2xl font-extrabold">{t('checkout.title')}</h1>
                        <p className="text-gray-400 text-sm">{t('checkout.subtitle')}</p>
                    </div>
                </div>
            </div>

            {/* Step bar */}
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                        {STEPS.map((s, i) => {
                            const Icon = STEP_ICONS[s];
                            const done = i < stepIndex;
                            const active = s === step;
                            return (
                                <React.Fragment key={s}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${done ? 'bg-emerald-500 text-white' : active ? 'bg-orange-500 text-white ring-4 ring-orange-100' : 'bg-gray-100 text-gray-400'}`}>
                                            {done ? <CheckCircle size={14} /> : <Icon size={14} />}
                                        </div>
                                        <span className={`text-sm font-medium hidden sm:block ${active ? 'text-orange-600' : done ? 'text-emerald-600' : 'text-gray-400'}`}>
                                            {t(`checkout.steps.${s}`)}
                                        </span>
                                    </div>
                                    {i < STEPS.length - 1 && <ChevronRight size={14} className="text-gray-300 mx-1" />}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 min-h-screen py-10 px-4">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">

                    {/* Form area */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">

                            {/* ── Shipping ── */}
                            {step === 'shipping' && (
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-5">
                                        <Truck size={18} className="text-orange-500" /> {t('checkout.shipping.heading')}
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {(['first_name', 'last_name', 'email', 'phone', 'address', 'city', 'state', 'zip', 'country'] as const).map(field => (
                                            <div key={field} className={`space-y-1.5 ${['email', 'address', 'country'].includes(field) ? 'sm:col-span-2' : ''}`}>
                                                <Label className="text-sm">{t(`checkout.shipping.${field}`)}</Label>
                                                <Input placeholder={t(`checkout.shipping.${field}`)} />
                                            </div>
                                        ))}
                                    </div>
                                    <label className="flex items-center gap-2 mt-4 text-sm text-gray-600 cursor-pointer">
                                        <input type="checkbox" className="accent-orange-500" />
                                        {t('checkout.shipping.save_address')}
                                    </label>
                                    <div className="flex justify-end mt-6">
                                        <Button onClick={() => setStep('payment')} className="bg-orange-500 hover:bg-orange-600 text-white gap-2 rounded-xl px-8">
                                            {t('common.continue')} <ChevronRight size={16} />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* ── Payment ── */}
                            {step === 'payment' && (
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-5">
                                        <CreditCard size={18} className="text-orange-500" /> {t('checkout.payment.heading')}
                                    </h2>
                                    {/* Method selector */}
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        {(['card', 'cod', 'paypal'] as const).map(m => (
                                            <button
                                                key={m}
                                                onClick={() => setPayMethod(m)}
                                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-all ${payMethod === m ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-100 text-gray-600 hover:border-orange-300'}`}
                                            >
                                                {m === 'card' && <CreditCard size={20} />}
                                                {m === 'cod' && <Truck size={20} />}
                                                {m === 'paypal' && <span className="text-base font-extrabold text-blue-600">P</span>}
                                                {t(`checkout.payment.${m}`)}
                                            </button>
                                        ))}
                                    </div>
                                    {payMethod === 'card' && (
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <Label>{t('checkout.payment.card_number')}</Label>
                                                <Input placeholder="1234 5678 9012 3456" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label>{t('checkout.payment.expiry')}</Label>
                                                    <Input placeholder="MM / YY" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label>{t('checkout.payment.cvv')}</Label>
                                                    <Input placeholder="123" />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label>{t('checkout.payment.name_on_card')}</Label>
                                                <Input placeholder="John Doe" />
                                            </div>
                                        </div>
                                    )}
                                    {payMethod !== 'card' && (
                                        <div className="text-center py-8 text-gray-400 text-sm">
                                            {payMethod === 'cod' ? '🚚 Pay when your order arrives.' : '🔵 You will be redirected to PayPal to complete payment.'}
                                        </div>
                                    )}
                                    <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-4">
                                        <Lock size={11} /> {t('checkout.payment.secure_note')}
                                    </p>
                                    <div className="flex justify-between mt-6">
                                        <Button variant="outline" onClick={() => setStep('shipping')} className="gap-2">{t('common.back')}</Button>
                                        <Button onClick={() => setStep('review')} className="bg-orange-500 hover:bg-orange-600 text-white gap-2 rounded-xl px-8">
                                            {t('common.continue')} <ChevronRight size={16} />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* ── Review ── */}
                            {step === 'review' && (
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-5">
                                        <ClipboardCheck size={18} className="text-orange-500" /> {t('checkout.review.heading')}
                                    </h2>
                                    <div className="space-y-3 mb-5">
                                        {ORDER_ITEMS.map(item => (
                                            <div key={item.name} className="flex justify-between text-sm">
                                                <span className="text-gray-700">{item.name} × {item.qty}</span>
                                                <span className="font-semibold text-gray-900">${(item.price * item.qty).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-gray-100 pt-4 flex justify-between font-extrabold text-gray-900">
                                        <span>Total</span>
                                        <span className="text-orange-600 text-lg">${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between mt-6">
                                        <Button variant="outline" onClick={() => setStep('payment')} className="gap-2">{t('common.back')}</Button>
                                        <Button onClick={() => setPlaced(true)} className="bg-orange-500 hover:bg-orange-600 text-white gap-2 rounded-xl px-8 font-bold">
                                            🚀 {t('checkout.place_order')}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order summary sidebar */}
                    <div>
                        <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
                            <h3 className="font-bold text-gray-800 mb-4">{t('cart.order_summary')}</h3>
                            <div className="space-y-3 mb-4">
                                {ORDER_ITEMS.map(item => (
                                    <div key={item.name} className="flex gap-3 items-center">
                                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                            <ShoppingCart size={14} className="text-orange-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-gray-400">×{item.qty}</p>
                                        </div>
                                        <span className="text-sm font-semibold">${(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>{t('cart.subtotal')}</span><span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>{t('cart.shipping')}</span><span className="text-emerald-600">{t('cart.free_shipping')}</span>
                                </div>
                                <div className="flex justify-between font-extrabold text-gray-900 text-base pt-1 border-t border-gray-100">
                                    <span>{t('cart.grand_total')}</span>
                                    <span className="text-orange-600">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
