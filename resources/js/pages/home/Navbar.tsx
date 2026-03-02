import React, { useState, useEffect } from 'react';
import {
    Search, ShoppingCart, Heart, User, Menu, X, ChevronDown,
    Zap, Shirt, Smartphone, Home as HomeIcon, Watch, Gem, Baby, Dumbbell
} from 'lucide-react';

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

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cartCount] = useState(3);
    const [wishlistCount] = useState(5);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [showCatDropdown, setShowCatDropdown] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <>
            {/* Main Navbar */}
            <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-4 h-18 py-3">

                        {/* Mobile Hamburger */}
                        <button
                            className="lg:hidden text-gray-700 hover:text-[#c96] transition-colors"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            <Menu size={24} />
                        </button>

                        {/* Logo */}
                        <a href="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="flex items-center justify-center w-9 h-9 bg-[#c96] rounded-lg">
                                <Zap size={20} className="text-white" fill="white" />
                            </div>
                            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                                Shop<span className="text-[#c96]">ella</span>
                            </span>
                        </a>

                        {/* Search Bar — desktop */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
                            <div className="flex w-full border-2 border-[#c96] rounded-full overflow-hidden shadow-sm">
                                <select className="border-r border-gray-200 bg-gray-50 text-gray-600 text-xs px-3 outline-none cursor-pointer min-w-[110px]">
                                    <option>All Categories</option>
                                    {categories.map(c => (
                                        <option key={c.label}>{c.label}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search for products, brands…"
                                    className="flex-1 px-4 py-2.5 text-sm outline-none bg-white text-gray-800 placeholder-gray-400"
                                />
                                <button className="bg-[#c96] hover:bg-[#b8852a] transition-colors px-5 flex items-center justify-center">
                                    <Search size={18} className="text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center gap-1 ml-auto lg:ml-0">
                            {/* Mobile search */}
                            <button className="md:hidden p-2 text-gray-700 hover:text-[#c96] transition-colors">
                                <Search size={22} />
                            </button>

                            {/* Wishlist */}
                            <a href="#" className="relative p-2 text-gray-700 hover:text-[#c96] transition-colors group">
                                <Heart size={22} className="group-hover:scale-110 transition-transform" />
                                {wishlistCount > 0 && (
                                    <span className="absolute top-1 right-1 bg-[#c96] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                                        {wishlistCount}
                                    </span>
                                )}
                                <span className="hidden lg:block text-[10px] text-gray-500 text-center -mt-0.5">Wishlist</span>
                            </a>

                            {/* Cart */}
                            <a href="#" className="relative p-2 text-gray-700 hover:text-[#c96] transition-colors group">
                                <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                                {cartCount > 0 && (
                                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                                        {cartCount}
                                    </span>
                                )}
                                <span className="hidden lg:block text-[10px] text-gray-500 text-center -mt-0.5">Cart</span>
                            </a>

                            {/* Account */}
                            <a href="/login" className="relative p-2 text-gray-700 hover:text-[#c96] transition-colors group">
                                <User size={22} className="group-hover:scale-110 transition-transform" />
                                <span className="hidden lg:block text-[10px] text-gray-500 text-center -mt-0.5">Account</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Nav Links Bar */}
                <nav className="hidden lg:block border-t border-gray-100 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center gap-0">
                            {/* Browse by Category button */}
                            <div
                                className="relative"
                                onMouseEnter={() => setShowCatDropdown(true)}
                                onMouseLeave={() => setShowCatDropdown(false)}
                            >
                                <button className="flex items-center gap-2 bg-[#c96] text-white text-sm font-semibold px-5 py-3 hover:bg-[#b8852a] transition-colors">
                                    <Menu size={16} />
                                    Browse Categories
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
                                    <a
                                        href={link.href}
                                        className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#c96] transition-colors relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-[#c96] after:transition-all hover:after:w-full"
                                    >
                                        {link.label}
                                        {link.badge && (
                                            <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded ml-1 animate-pulse">
                                                {link.badge}
                                            </span>
                                        )}
                                        {link.hasDropdown && <ChevronDown size={12} className="group-hover:rotate-180 transition-transform" />}
                                    </a>
                                    {link.hasDropdown && openDropdown === link.label && (
                                        <div className="absolute top-full left-0 bg-white border border-gray-100 shadow-xl rounded-b-lg z-50 min-w-[180px] py-2">
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
            </header>

            {/* Mobile Menu Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-[100] flex">
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
                            <div className="flex border-2 border-[#c96] rounded-full overflow-hidden mb-4">
                                <input
                                    type="text"
                                    placeholder="Search products…"
                                    className="flex-1 px-4 py-2 text-sm outline-none"
                                />
                                <button className="bg-[#c96] px-4">
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
                                <a href="/login" className="flex-1 text-center text-sm font-semibold border border-[#c96] text-[#c96] py-2 rounded-full hover:bg-[#c96] hover:text-white transition-colors">
                                    Sign In
                                </a>
                                <a href="/register" className="flex-1 text-center text-sm font-semibold bg-[#c96] text-white py-2 rounded-full hover:bg-[#b8852a] transition-colors">
                                    Register
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
