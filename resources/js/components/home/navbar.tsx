import React, { useState, useEffect } from 'react';
import {
    Search, ShoppingCart, Heart, User, Menu, X, ChevronDown,
    Zap, Shirt, Smartphone, Home as HomeIcon, Watch, Gem, Baby, Dumbbell
} from 'lucide-react';
import Logo from '../ui/logo';
import DesktopSearch from './destop-search';
import NavbarIcon from '../ui/navbar-icon';
import { useTranslation } from 'react-i18next';
import MobileDrawer from '../ui/mobile-drawer';
import DesktopNavbar from './destop-navbar';





export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { t } = useTranslation();
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


                        <Logo />
                        <DesktopSearch />

                        {/* Right Icons */}
                        <div className="flex items-center gap-1 ml-auto lg:ml-0">
                            {/* Mobile search */}
                            <button className="md:hidden p-2 text-gray-700 hover:text-[#c96] transition-colors">
                                <Search size={22} />
                            </button>

                            {/* Wishlist */}

                            <NavbarIcon
                                href="/wishlist/page"
                                icon={<Heart size={22} className="group-hover:scale-110 transition-transform" />}
                                count={wishlistCount}
                                label={t('common.wishlist')}
                            />

                            {/* Cart */}
                            <NavbarIcon
                                href="/cart/page"
                                icon={<ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />}
                                count={cartCount}
                                label={t('common.cart')}
                            />


                            <NavbarIcon
                                icon={<User size={22} className="group-hover:scale-110 transition-transform" />}
                                href="/login"
                                label={t('common.account')}
                            />

                        </div>
                    </div>
                </div>

                {/* Nav Links Bar */}
               <DesktopNavbar />
            </header>

            {/* Mobile Menu Drawer */}
            {mobileOpen && (
              <MobileDrawer setMobileOpen={setMobileOpen}/>
            )}
        </>
    );
}
