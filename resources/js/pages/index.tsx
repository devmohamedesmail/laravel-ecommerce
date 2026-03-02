import React from 'react';
import { Head } from '@inertiajs/react';
import TopBar from './home/TopBar';
import Navbar from './home/Navbar';
import HeroBanner from './home/HeroBanner';
import CategorySection from './home/CategorySection';
import FeaturedProducts from './home/FeaturedProducts';
import PromoSection from './home/PromoSection';
import SaleSection from './home/SaleSection';
import Newsletter from './home/Newsletter';
import Footer from './home/Footer';

export default function Home() {
    return (
        <>
            <Head title="Shopella — Shop Smart, Live Better">
                <meta name="description" content="Discover the best deals on fashion, electronics, home & living, and more at Shopella. Premium products at unbeatable prices." />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>

            <div className="font-[Inter,sans-serif] bg-white min-h-screen">
                {/* Top announcement bar */}
                <TopBar />

                {/* Main navigation */}
                <Navbar />

                {/* Hero slider */}
                <main>
                    <HeroBanner />

                    {/* Shop by Category */}
                    <CategorySection />

                    {/* Featured Products with tabs */}
                    <FeaturedProducts />

                    {/* Promo banners */}
                    <PromoSection />

                    {/* Flash Sale with countdown */}
                    <SaleSection />

                    {/* Newsletter signup */}
                    <Newsletter />
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </>
    );
}
