import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard, { Product } from './ProductCard';

const products: Product[] = [
    {
        id: 1,
        name: 'Premium Wireless Noise-Cancelling Headphones Pro',
        price: 89.99,
        oldPrice: 149.99,
        rating: 4.5,
        reviews: 328,
        image: '',
        badge: 'Best Seller',
        badgeColor: '#c96',
        category: 'Electronics',
    },
    {
        id: 2,
        name: 'Classic Leather Slim Wallet with RFID Protection',
        price: 34.99,
        oldPrice: 59.00,
        rating: 4,
        reviews: 145,
        image: '',
        isNew: true,
        category: 'Fashion',
    },
    {
        id: 3,
        name: 'Minimalist Stainless Steel Smart Watch Series 5',
        price: 199.00,
        oldPrice: 280.00,
        rating: 5,
        reviews: 512,
        image: '',
        isSale: true,
        category: 'Watch',
    },
    {
        id: 4,
        name: 'Ergonomic Home Office Gaming Chair Lumbar Support',
        price: 249.99,
        oldPrice: 399.99,
        rating: 4,
        reviews: 76,
        image: '',
        category: 'Home',
    },
    {
        id: 5,
        name: 'Ultra-Boost Running Shoes Breathable Mesh',
        price: 79.99,
        oldPrice: 120.00,
        rating: 4.5,
        reviews: 203,
        image: '',
        isNew: true,
        category: 'Sports',
    },
    {
        id: 6,
        name: '18K Gold Plated Layered Necklace Set',
        price: 45.00,
        oldPrice: 75.00,
        rating: 5,
        reviews: 89,
        image: '',
        badge: 'Trending',
        badgeColor: '#7c3aed',
        category: 'Fashion',
    },
    {
        id: 7,
        name: 'Portable Bluetooth Speaker IPX7 Waterproof',
        price: 59.99,
        oldPrice: 99.99,
        rating: 4,
        reviews: 167,
        image: '',
        category: 'Electronics',
    },
    {
        id: 8,
        name: 'Natural Skincare Gift Set – Bamboo & Rose',
        price: 65.00,
        oldPrice: null,
        rating: 5,
        reviews: 44,
        image: '',
        isNew: true,
        category: 'Beauty',
    },
];

const tabs = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Beauty'];

export default function FeaturedProducts() {
    const [activeTab, setActiveTab] = useState('All');

    const filtered = activeTab === 'All'
        ? products
        : products.filter(p => p.category === activeTab);

    return (
        <section className="py-14 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#c96] mb-2 block">Handpicked</span>
                        <h2 className="text-3xl font-extrabold text-gray-900">Featured Products</h2>
                    </div>
                    <a
                        href="#"
                        className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#c96] hover:gap-3 transition-all"
                    >
                        View All Products <ArrowRight size={16} />
                    </a>
                </div>

                {/* Tab Filters */}
                <div className="flex gap-2 flex-wrap mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 text-sm font-medium rounded-full border transition-all duration-200 ${activeTab === tab
                                    ? 'bg-[#c96] text-white border-[#c96] shadow-md shadow-amber-200'
                                    : 'text-gray-600 border-gray-200 hover:border-[#c96] hover:text-[#c96]'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
                    {filtered.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-10">
                    <button className="group inline-flex items-center gap-2 px-8 py-3 border-2 border-[#c96] text-[#c96] font-semibold text-sm rounded-full hover:bg-[#c96] hover:text-white transition-all duration-300">
                        Load More Products <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
}
