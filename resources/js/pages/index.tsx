import React from 'react';
import { Head } from '@inertiajs/react';
import TopBar from '@/components/home/top-header';
import Navbar from '@/components/home/navbar';
import HeroBanner from '@/components/home/hero-banner';
import CategorySection from '@/components/home/categories-section';
import FeaturedProducts from '@/components/home/featured-products';
import PromoSection from '@/components/home/promo-section';
import SaleSection from '@/components/home/sale-section';
import Newsletter from '@/components/home/news-letter';
import Footer from '@/components/home/footer';

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
                <TopBar />
                <Navbar />
                <main>
                    <HeroBanner />
                    <CategorySection />
                    <FeaturedProducts />
                    <PromoSection />
                    <SaleSection />
                    <Newsletter />
                </main>
                <Footer />
            </div>
        </>
    );
}
