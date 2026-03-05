import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Category {
    id: number;
    name: string;
    name_ar: string;
    name_en: string;
    image: string;
    count?: string;
}
export default function CategorySection() {
    const { categories } = usePage<{ categories: Category[] }>().props;
    const {t,i18n}=useTranslation();
   
    return (
        <section className="py-14 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">{t('categories.explore')}</span>
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            {t('categories.shop_by_category')}
                        </h2>
                    </div>
                    <a
                        href="#"
                        className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-3 transition-all"
                    >
                        {t('categories.view_all')}
                        <ArrowRight size={16} />
                    </a>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                    {categories?.map((category: any) => (
                        <Link href="#" key={category.id} className='group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-lg hover:-translate-y-1 transition-all duration-300'>
                            <div className={`w-full h-full  rounded-xl  flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}>
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity`} />
                                <img src={category?.image} alt={category?.name_ar} className="w-full h-full object-cover" />
                            </div>

                            <div className="text-center">
                                <div className="text-sm font-semibold text-gray-800 group-hover:text-priamry transition-colors leading-tight">
                                    {category?.name}
                                    {
                                        i18n.language === 'ar' ? category?.name_ar : category?.name_en
                                    }
                                </div>
                                {/* <div className="text-[10px] text-gray-400 mt-0.5">{count}</div> */}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
