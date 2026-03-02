import { Link } from '@inertiajs/react';
import { X,Search } from 'lucide-react';
import React from 'react'
import { useTranslation } from 'react-i18next';

export default function MobileDrawer({ setMobileOpen }: { setMobileOpen: (open: boolean) => void }) {
    const navLinks = [
    {
        label: 'Home', href: '/', hasDropdown: false,
    },
    {
        label: 'Shop', href: '#', hasDropdown: true,
        children: ['New Arrivals', 'Trending Now', 'Best Sellers', 'Clearance Sale'],
    },
    {
        label: 'Categories', href: '#', hasDropdown: true,
        children: ['Fashion', 'Electronics', 'Home & Living', 'Sports', 'Beauty'],
    },
    {
        label: 'Brands', href: '#', hasDropdown: true,
        children: ['Nike', 'Apple', 'Samsung', 'IKEA', 'Zara'],
    },
    {
        label: 'Sale', href: '#', hasDropdown: false, badge: 'HOT',
    },
    {
        label: 'Blog', href: '#', hasDropdown: false,
    },
    {
        label: 'Contact', href: '#', hasDropdown: false,
    },
];
    
    const {t}=useTranslation()
    return (
        <div className="fixed inset-0 z-100 flex">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="relative bg-white w-80 h-full overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b">
                    <span className="text-xl font-extrabold">Shop<span className="text-[#c96]">ella</span></span>
                    <button onClick={() => setMobileOpen(false)} className="p-1 hover:text-[#c96]">
                        <X size={22} />
                    </button>
                </div>
                <div className="p-4">
                    {/* Mobile Search */}
                    <div className="flex border-2 border-primary rounded-full overflow-hidden mb-4">
                        <input
                            type="text"
                            placeholder="Search products…"
                            className="flex-1 px-4 py-2 text-sm outline-none"
                        />
                        <button className="bg-primary px-4">
                            <Search size={16} className="text-white" />
                        </button>
                    </div>
                    {navLinks.map((link) => (
                        <div key={link.label}>
                            <a
                                href={link.href}
                                className="flex items-center justify-between py-3 text-sm font-medium text-gray-800 border-b border-gray-100 hover:text-[#c96] transition-colors"
                            >
                                {link.label}
                                {link.badge && (
                                    <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                        {link.badge}
                                    </span>
                                )}
                            </a>
                        </div>
                    ))}
                    <div className="mt-4 flex gap-3">
                        <Link href="/login" className="flex-1 text-center text-sm font-semibold border border-primary text-primary py-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                            {t('common.sign_in')}
                        </Link>
                        <Link href="/register" className="flex-1 text-center text-sm font-semibold bg-primary text-white py-2 rounded-full hover:bg-[#b8852a] transition-colors">
                            {t('common.register')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
