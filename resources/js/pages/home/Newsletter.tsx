import React, { useState } from 'react';
import { Send, Mail, CheckCircle } from 'lucide-react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        setError('');
        setSubmitted(true);
    };

    return (
        <section className="relative py-20 overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#2d1a0e] to-[#3d2200]" />

            {/* Decorative orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#c96]/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="nl-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <rect width="40" height="40" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#nl-grid)" />
                </svg>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#c96]/20 rounded-2xl mb-6 mx-auto">
                    <Mail size={28} className="text-[#c96]" />
                </div>
                <h2 className="text-4xl font-extrabold text-white mb-3">
                    Join Our Newsletter
                </h2>
                <p className="text-gray-300 text-base mb-8 max-w-xl mx-auto">
                    Subscribe to get exclusive deals, style tips, and early access to our biggest sales — delivered straight to your inbox.
                </p>

                {submitted ? (
                    <div className="flex items-center justify-center gap-3 text-green-400 text-lg font-semibold animate-pulse">
                        <CheckCircle size={24} />
                        Thanks for subscribing! Check your inbox for a welcome gift 🎁
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                            <div className="flex-1 relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setError(''); }}
                                    placeholder="Enter your email address"
                                    className={`w-full bg-white/10 backdrop-blur-sm border ${error ? 'border-red-400' : 'border-white/20'} text-white placeholder-gray-400 rounded-full px-5 py-3.5 text-sm outline-none focus:border-[#c96] transition-colors`}
                                />
                            </div>
                            <button
                                type="submit"
                                className="group flex items-center justify-center gap-2 bg-[#c96] hover:bg-[#b8852a] text-white font-bold px-7 py-3.5 rounded-full text-sm transition-all duration-200 hover:gap-3 shrink-0"
                            >
                                <Send size={15} />
                                Subscribe
                            </button>
                        </div>
                        {error && <p className="mt-2 text-red-400 text-xs">{error}</p>}
                        <p className="mt-4 text-gray-500 text-xs">
                            🔒 No spam, ever. Unsubscribe at any time. We respect your privacy.
                        </p>
                    </form>
                )}

                {/* Perks */}
                <div className="flex justify-center gap-8 mt-10 text-center">
                    {[
                        { emoji: '🎁', label: 'Welcome Discount' },
                        { emoji: '⚡', label: 'Early Sale Access' },
                        { emoji: '📦', label: 'Exclusive Offers' },
                    ].map((p) => (
                        <div key={p.label} className="text-gray-400">
                            <div className="text-2xl mb-1">{p.emoji}</div>
                            <div className="text-xs font-medium">{p.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
