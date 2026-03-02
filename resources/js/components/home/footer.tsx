import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, Zap, ChevronRight, Heart } from 'lucide-react';
import { Link } from '@inertiajs/react';

const footerLinks = {
    'Shop': ['New Arrivals', 'Best Sellers', 'Sale', 'Brands', 'All Products'],
    'Customer Care': ['My Account', 'Track Your Order', 'Returns & Exchanges', 'FAQs', 'Support Center'],
    'Company': ['About Us', 'Careers', 'Press', 'Blog', 'Affiliate Program'],
};

const socials = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-[#1877f2]' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-[#1da1f2]' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500' },
    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:bg-[#ff0000]' },
];

const payments = ['💳 Visa', '💳 Mastercard', '🅿️ PayPal', '🍏 Apple Pay', '🔼 Stripe'];

export default function Footer() {
    return (
        <footer className="bg-[#1a1a1a] text-gray-300">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <a href="/" className="flex items-center gap-2 mb-4">
                            <div className="flex items-center justify-center w-9 h-9 bg-[#c96] rounded-lg">
                                <Zap size={20} className="text-white" fill="white" />
                            </div>
                            <span className="text-2xl font-extrabold text-white">
                                Shop<span className="text-[#c96]">ella</span>
                            </span>
                        </a>
                        <p className="text-sm text-gray-400 leading-relaxed mb-5 max-w-xs">
                            Your one-stop destination for premium products at unbeatable prices. Shop smart, live better.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-2 mb-6">
                            {socials.map(({ icon: Icon, href, label, color }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className={`w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 hover:text-white ${color} transition-all duration-200`}
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>

                        {/* Contact */}
                        <div className="space-y-2.5 text-sm">
                            <div className="flex items-start gap-2.5">
                                <MapPin size={15} className="text-[#c96] shrink-0 mt-0.5" />
                                <span className="text-gray-400">123 Commerce Street, NY 10001, USA</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Phone size={15} className="text-[#c96] shrink-0" />
                                <a href="tel:+11234567890" className="text-gray-400 hover:text-white transition-colors">+1 (123) 456-7890</a>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Mail size={15} className="text-[#c96] shrink-0" />
                                <a href="mailto:support@shopella.com" className="text-gray-400 hover:text-white transition-colors">support@shopella.com</a>
                            </div>
                        </div>
                    </div>

                    {/* Links Columns */}
                    {Object.entries(footerLinks).map(([heading, links]) => (
                        <div key={heading}>
                            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">{heading}</h4>
                            <ul className="space-y-2.5">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="group flex items-center gap-1 text-sm text-gray-400 hover:text-[#c96] transition-colors"
                                        >
                                            <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all text-[#c96]" />
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        © {new Date().getFullYear()} Shopella. Made with <Heart size={11} className="text-red-500 fill-red-500 mx-0.5" /> All rights reserved.
                    </p>

                    {/* Payment Methods */}
                    <div className="flex items-center gap-3 flex-wrap justify-center">
                        <span className="text-xs text-gray-500">We accept:</span>
                        <div className="flex gap-1.5 flex-wrap">
                            {payments.map((p) => (
                                <span
                                    key={p}
                                    className="text-xs bg-white/10 text-gray-400 px-2 py-1 rounded font-medium"
                                >
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Legal links */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                        <Link href='/create-store/page' className="hover:text-white transition-colors">Be Seller</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

