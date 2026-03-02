import React, { useState } from 'react'
import { Shirt, Smartphone, HomeIcon, Watch, Gem, Baby, Dumbbell, Zap, Menu, ChevronDown } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function DesktopNavbar() {
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
 const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { t } = useTranslation();
    return (
        <nav className="hidden lg:block border-t border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-0">
                    {/* Browse by Category button */}
                    <div
                        className="relative"
                        onMouseEnter={() => setShowCatDropdown(true)}
                        onMouseLeave={() => setShowCatDropdown(false)}
                    >
                        <button className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-3 hover:bg-secondary transition-colors">
                            <Menu size={16} />
                            {t('common.categories')}
                            <ChevronDown size={14} className={`transition-transform ${showCatDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showCatDropdown && (
                            <div className="absolute top-full left-0 bg-white border border-gray-100 shadow-xl rounded-b-lg z-50 w-56 py-2">
                                {categories.map(({ icon: Icon, label, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#c96] transition-colors"
                                    >
                                        <Icon size={16} className="text-gray-400 group-hover:text-[#c96]" />
                                        {label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Main nav links */}
                    {navLinks.map((link) => (
                        <div
                            key={link.label}
                            className="relative group"
                            onMouseEnter={() => setOpenDropdown(link.label)}
                            onMouseLeave={() => setOpenDropdown(null)}
                        >
                            <Link
                                href={link.href}
                                className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
                            >
                                {link.label}
                                {link.badge && (
                                    <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded ml-1 animate-pulse">
                                        {link.badge}
                                    </span>
                                )}
                                {link.hasDropdown && <ChevronDown size={12} className="group-hover:rotate-180 transition-transform" />}
                            </Link>
                            {link.hasDropdown && openDropdown === link.label && (
                                <div className="absolute top-full left-0 bg-white border border-gray-100 shadow-xl rounded-b-lg z-50 min-w-45 py-2">
                                    {link.children?.map((child) => (
                                        <a
                                            key={child}
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#c96] transition-colors"
                                        >
                                            {child}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </nav>
    )
}
