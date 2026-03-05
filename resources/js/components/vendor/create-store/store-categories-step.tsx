import React from 'react'
import { Tag, X, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
    name_ar: string;
    name_en: string;
    image: string;
    count?: string;
}
export default function StoreCategoriesStep({ selectedCategories, toggleCategory }: any) {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const { categories } = usePage<{ categories: Category[] }>().props


    const parents = categories.filter(c => !c.parent_id);
    const getChildren = (parentId: number) => categories.filter(c => c.parent_id === parentId);
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-2 mb-1">
                <Tag size={18} className="text-orange-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('create_store.categories.heading')}</h2>
            </div>
            <p className="text-sm text-gray-500">{t('create_store.categories.description')}</p>

            {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-900/20">
                    {selectedCategories.map((id: Number) => {
                        const cat = categories?.find((c: any) => c.id === id);
                        return cat ? (
                            <span key={id} className="inline-flex items-center gap-1.5 text-xs bg-orange-500 text-white px-2.5 py-1 rounded-full font-medium">
                                {isRtl ? cat.name_ar : cat.name_en}
                                <button type="button" onClick={() => toggleCategory(id)}><X size={10} /></button>
                            </span>
                        ) : null;
                    })}
                </div>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {parents.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-8">{t('create_store.categories.no_categories')}</p>
                )}
                {parents.map((parent:any) => {
                    const children = getChildren(parent.id);
                    const isSelected = selectedCategories.includes(parent.id);
                    return (
                        <div key={parent.id} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                            <button type="button" onClick={() => toggleCategory(parent.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${isSelected ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                <span className={`text-sm font-semibold ${isSelected ? 'text-orange-600 dark:text-orange-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                    {isRtl ? parent.name_ar : parent.name_en}
                                </span>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300 dark:border-gray-600'}`}>
                                    {isSelected && <CheckCircle size={12} className="text-white" />}
                                </div>
                            </button>
                            {children.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-white dark:bg-gray-900">
                                    {children.map((child:any) => {
                                        const childSel = selectedCategories.includes(child.id);
                                        return (
                                            <button key={child.id} type="button" onClick={() => toggleCategory(child.id)}
                                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-all ${childSel ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-300'}`}>
                                                {isRtl ? child.name_ar : child.name_en}
                                                {childSel && <CheckCircle size={11} className="text-orange-500 ms-1 shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
