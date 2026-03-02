import React, { useState } from 'react';
import { Heart, Star, ShoppingCart, Eye, ArrowLeftRight } from 'lucide-react';

export interface Product {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    badge?: string;
    badgeColor?: string;
    isNew?: boolean;
    isSale?: boolean;
    category: string;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [wishlisted, setWishlisted] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    const discount = product.oldPrice
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : null;

    const handleAddToCart = () => {
        setAddingToCart(true);
        setTimeout(() => setAddingToCart(false), 1200);
    };

    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
            {/* Image Container */}
            <div className="relative overflow-hidden bg-gray-50 aspect-[4/3]">
                {/* Placeholder image */}
                <div
                    className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 group-hover:scale-105 transition-transform duration-500"
                >
                    <div className="text-center">
                        <div className="text-5xl mb-1">
                            {product.category === 'Fashion' ? '👗' :
                                product.category === 'Electronics' ? '💻' :
                                    product.category === 'Home' ? '🏠' :
                                        product.category === 'Watch' ? '⌚' :
                                            product.category === 'Sports' ? '⚽' :
                                                product.category === 'Beauty' ? '💄' : '🛍️'}
                        </div>
                        <div className="text-xs text-gray-400">{product.category}</div>
                    </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.isNew && (
                        <span className="bg-teal-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>
                    )}
                    {discount && (
                        <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                            -{discount}%
                        </span>
                    )}
                    {product.badge && (
                        <span
                            className="text-white text-[9px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: product.badgeColor || '#c96' }}
                        >
                            {product.badge}
                        </span>
                    )}
                </div>

                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-10 group-hover:translate-x-0 transition-transform duration-300">
                    <button
                        onClick={() => setWishlisted(!wishlisted)}
                        className={`w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#c96] hover:text-white transition-all duration-200 ${wishlisted ? 'text-red-500 bg-red-50' : 'text-gray-500'}`}
                        title="Wishlist"
                    >
                        <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
                    </button>
                    <button
                        className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:bg-[#c96] hover:text-white transition-all duration-200"
                        title="Compare"
                    >
                        <ArrowLeftRight size={13} />
                    </button>
                    <button
                        className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:bg-[#c96] hover:text-white transition-all duration-200"
                        title="Quick View"
                    >
                        <Eye size={14} />
                    </button>
                </div>

                {/* Add to Cart - slides up on hover */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                        onClick={handleAddToCart}
                        className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white transition-all duration-200 ${addingToCart ? 'bg-green-500' : 'bg-[#c96] hover:bg-[#b8852a]'}`}
                    >
                        <ShoppingCart size={16} />
                        {addingToCart ? 'Added! ✓' : 'Add to Cart'}
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
                <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-1">{product.category}</p>
                <a href="#" className="text-sm font-semibold text-gray-800 hover:text-[#c96] transition-colors line-clamp-2 leading-snug mb-2 flex-1">
                    {product.name}
                </a>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={12}
                                className={star <= Math.round(product.rating) ? 'text-amber-400' : 'text-gray-200'}
                                fill={star <= Math.round(product.rating) ? 'currentColor' : 'currentColor'}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
                    {product.oldPrice && (
                        <span className="text-sm text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
