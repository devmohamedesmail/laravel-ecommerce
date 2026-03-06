import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import VendorLayout from '@/layouts/vendor-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Search, Package, X, AlertTriangle, Box, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Category { id: number; name_en: string; name_ar: string; }
interface AttributeValue { id: number; attribute_id: number; value: string; price: number; }
interface Attribute { id: number; name_en: string; name_ar: string; values: AttributeValue[]; }
interface ProductImage { id: number; image: string; order: number; }
interface Variant { id?: number; sku?: string; price: number; sale_price?: number; stock: number; is_active: boolean; attributeValues?: { id: number; attribute_id: number; value: string; }[]; }
interface ProductItem {
    id: number; title: string; slug?: string; description?: string; price: number; sale_price?: number;
    product_type: 'simple' | 'variant'; product_kind: 'physical' | 'digital'; stock: number; sku?: string;
    is_active: boolean; is_popular: boolean; is_featured: boolean; weight?: number; length?: number; width?: number; height?: number;
    tax: number; shipping_cost?: number; category_id: number; category?: Category;
    images?: ProductImage[]; variants?: Variant[];
}

interface PaginatedProducts { data: ProductItem[]; current_page: number; last_page: number; total: number; }
interface Store { id: number; name: string; currency: string; }
interface Props { store: Store; products: PaginatedProducts; categories: Category[]; attributes: Attribute[]; }

const variantSchema = z.object({
    id: z.number().optional(),
    sku: z.string().optional().nullable(),
    price: z.coerce.number().min(0, 'Price must be >= 0'),
    sale_price: z.coerce.number().optional().nullable().transform((val) => (val === 0 ? null : val)),
    stock: z.coerce.number().min(0).default(0),
    is_active: z.boolean().default(true),
    attribute_values: z.array(z.coerce.number()).optional(),
});

const productSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional().nullable(),
    price: z.coerce.number().min(0, 'Price must be >= 0'),
    sale_price: z.coerce.number().optional().nullable().transform((val) => (val === 0 ? null : val)),
    product_type: z.enum(['simple', 'variant']).default('simple'),
    product_kind: z.enum(['physical', 'digital']).default('physical'),
    stock: z.coerce.number().min(0).default(0),
    sku: z.string().optional().nullable(),
    is_active: z.boolean().default(true),
    is_popular: z.boolean().default(false),
    is_featured: z.boolean().default(false),
    weight: z.coerce.number().optional().nullable().transform((val) => (val === 0 ? null : val)),
    length: z.coerce.number().optional().nullable().transform((val) => (val === 0 ? null : val)),
    width: z.coerce.number().optional().nullable().transform((val) => (val === 0 ? null : val)),
    height: z.coerce.number().optional().nullable().transform((val) => (val === 0 ? null : val)),
    tax: z.coerce.number().min(0).default(0),
    shipping_cost: z.coerce.number().optional().nullable().transform((val) => (val === 0 ? null : val)),
    category_id: z.coerce.number().min(1, 'Category is required'),
    images: z.any().optional(),
    variants: z.array(variantSchema).optional(),
});

type ProductFormData = z.input<typeof productSchema>;

function StatusBadge({ is_active }: { is_active: boolean }) {
    if (is_active) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>;
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Inactive</span>;
}

function ProductModal({ open, onClose, categories, attributes, editProduct, currency, processing, onSubmit }: any) {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const [activeTab, setActiveTab] = useState<'general' | 'media' | 'inventory' | 'variants' | 'shipping' | 'visibility'>('general');
    const [previewImages, setPreviewImages] = useState<{ url: string, file?: File, existing?: boolean }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, reset, control, watch, setValue, formState: { errors } } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: '', description: '', price: 0, sale_price: null, product_type: 'simple', product_kind: 'physical',
            stock: 0, sku: '', is_active: true, is_popular: false, is_featured: false,
            weight: null, length: null, width: null, height: null, tax: 0, shipping_cost: null, category_id: 0,
            variants: [],
            images: null,
        }
    });

    const productType = watch('product_type');
    const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
        control,
        name: "variants"
    });

    React.useEffect(() => {
        if (open) {
            setActiveTab('general');
            if (editProduct) {
                const variantsParsed = editProduct.variants ? editProduct.variants.map((v: Variant) => ({
                    id: v.id, sku: v.sku || '', price: v.price, sale_price: v.sale_price || null, stock: v.stock, is_active: v.is_active,
                    attribute_values: v.attributeValues ? v.attributeValues.map(av => av.id) : []
                })) : [];

                reset({
                    title: editProduct.title, description: editProduct.description || '',
                    price: editProduct.price, sale_price: editProduct.sale_price || null,
                    product_type: editProduct.product_type, product_kind: editProduct.product_kind,
                    stock: editProduct.stock, sku: editProduct.sku || '',
                    is_active: editProduct.is_active, is_popular: editProduct.is_popular, is_featured: editProduct.is_featured,
                    weight: editProduct.weight || null, length: editProduct.length || null, width: editProduct.width || null, height: editProduct.height || null,
                    tax: editProduct.tax || 0, shipping_cost: editProduct.shipping_cost || null,
                    category_id: editProduct.category_id || 0,
                    variants: variantsParsed,
                    images: null,
                });

                if (editProduct.images) {
                    setPreviewImages(editProduct.images.map((img: ProductImage) => ({
                        url: img.image.startsWith('http') ? img.image : `/storage/${img.image}`,
                        existing: true
                    })));
                } else {
                    setPreviewImages([]);
                }
            } else {
                reset({
                    title: '', description: '', price: 0, sale_price: null, product_type: 'simple', product_kind: 'physical',
                    stock: 0, sku: '', is_active: true, is_popular: false, is_featured: false,
                    weight: null, length: null, width: null, height: null, tax: 0, shipping_cost: null, category_id: 0,
                    variants: [],
                    images: null,
                });
                setPreviewImages([]);
            }
        }
    }, [editProduct, open, reset]);

    if (!open) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setValue('images', newFiles);

            const newPreviews = newFiles.map(file => ({
                url: URL.createObjectURL(file),
                file: file,
                existing: false
            }));

            // Append rather than replace completely if modifying edit logic, but here we replace for simplicity.
            setPreviewImages(prev => [...prev.filter(p => p.existing), ...newPreviews]);
        }
    };

    const tabs = [
        { id: 'general', label: 'General' },
        { id: 'media', label: 'Images' },
        { id: 'inventory', label: 'Pricing & Inventory' },
        { id: 'variants', label: 'Variants', hidden: productType === 'simple' },
        { id: 'shipping', label: 'Logistics' },
        { id: 'visibility', label: 'Visibility' }
    ].filter(t => !t.hidden);

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 transition-opacity" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <h2 className="font-bold text-gray-900 dark:text-white">
                        {editProduct ? t('vendor.products.edit_modal_title', 'Edit Product') : t('vendor.products.add_modal_title', 'Add Product')}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                </div>

                <div className="flex px-6 border-b border-gray-100 dark:border-gray-800 shrink-0 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-6 flex-1 bg-white dark:bg-gray-900">
                    {/* GENERAL TAB */}
                    <div className={activeTab === 'general' ? 'block space-y-5' : 'hidden'}>
                        <div className="space-y-1.5">
                            <Label>{t('vendor.products.title', 'Title')} <span className="text-red-500">*</span></Label>
                            <Input {...register('title')} className={errors.title ? 'border-red-500' : ''} />
                            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label>{t('vendor.products.description', 'Description')}</Label>
                            <Textarea rows={4} {...register('description')} className="resize-none" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>{t('vendor.products.category', 'Category')} <span className="text-red-500">*</span></Label>
                                <Controller
                                    name="category_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value?.toString() || ""} onValueChange={(val) => field.onChange(Number(val))}>
                                            <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                                                <SelectValue placeholder={t('vendor.products.select_category', 'Select Category')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((c: Category) => (
                                                    <SelectItem key={c.id} value={c.id.toString()}>
                                                        {isRtl ? c.name_ar : c.name_en}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.category_id && <p className="text-xs text-red-500">{errors.category_id.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label>Product Type</Label>
                                <Controller
                                    name="product_type"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="simple">Simple Product</SelectItem>
                                                <SelectItem value="variant">Variant Product</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* MEDIA TAB */}
                    <div className={activeTab === 'media' ? 'block space-y-4' : 'hidden'}>
                        <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-800/20">
                            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                                <UploadCloud size={24} className="text-orange-500" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Click to upload images</h3>
                            <p className="text-xs text-gray-500 mb-4">PNG, JPG up to 2MB</p>
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" multiple accept="image/*" />
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="bg-white">
                                Browse Files
                            </Button>
                        </div>

                        {previewImages.length > 0 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
                                {previewImages.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm group">
                                        <img src={img.url} className="w-full h-full object-cover" alt="Preview" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button type="button" onClick={() => setPreviewImages(p => p.filter((_, i) => i !== idx))} className="text-white hover:text-red-400 p-1">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* INVENTORY & PRICING TAB */}
                    <div className={activeTab === 'inventory' ? 'block space-y-5' : 'hidden'}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>{t('vendor.products.price', 'Price')} ({currency}) <span className="text-red-500">*</span></Label>
                                <Input type="number" min={0} step="0.01" {...register('price')} className={errors.price ? 'border-red-500' : ''} disabled={productType === 'variant'} />
                                {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                                {productType === 'variant' && <p className="text-xs text-gray-400">Set base price. Variant prices can override this.</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>{t('vendor.products.sale_price', 'Sale Price')} ({currency})</Label>
                                <Input type="number" min={0} step="0.01" {...register('sale_price')} disabled={productType === 'variant'} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>{t('vendor.products.stock', 'Stock Quantity')}</Label>
                                <Input type="number" min={0} {...register('stock')} disabled={productType === 'variant'} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>{t('vendor.products.sku', 'SKU')}</Label>
                                <Input {...register('sku')} placeholder="e.g. PROD-1001" disabled={productType === 'variant'} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Tax (%)</Label>
                            <Input type="number" min={0} step="0.01" {...register('tax')} />
                        </div>
                    </div>

                    {/* VARIANTS TAB */}
                    <div className={activeTab === 'variants' && productType === 'variant' ? 'block space-y-4' : 'hidden'}>
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h3 className="text-sm font-semibold">Product Variants</h3>
                                <p className="text-xs text-gray-500">Add combinations of styles, sizes, etc.</p>
                            </div>
                            <Button type="button" onClick={() => appendVariant({ price: 0, stock: 0, sale_price: null, sku: '', is_active: true, attribute_values: [] })} size="sm" variant="outline" className="gap-2">
                                <Plus size={14} /> Add Variant
                            </Button>
                        </div>

                        {variantFields.length === 0 ? (
                            <div className="py-8 text-center border border-dashed rounded-xl border-gray-200">
                                <p className="text-sm text-gray-500 mb-2">No variants added yet.</p>
                                <Button type="button" onClick={() => appendVariant({ price: 0, stock: 0, sale_price: null, sku: '', is_active: true, attribute_values: [] })} size="sm">
                                    Create First Variant
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {variantFields.map((field, index) => (
                                    <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 relative">
                                        <button type="button" onClick={() => removeVariant(index)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 p-1">
                                            <X size={16} />
                                        </button>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs">Variant Price *</Label>
                                                <Input type="number" step="0.01" {...register(`variants.${index}.price`)} className="h-8 text-sm" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs">Variant Sale Price</Label>
                                                <Input type="number" step="0.01" {...register(`variants.${index}.sale_price`)} className="h-8 text-sm" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs">Stock</Label>
                                                <Input type="number" {...register(`variants.${index}.stock`)} className="h-8 text-sm" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs">SKU</Label>
                                                <Input {...register(`variants.${index}.sku`)} className="h-8 text-sm" />
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <Label className="text-xs mb-2 block">Variant Attributes</Label>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {attributes && attributes.map((attr:any) => (
                                                    <div key={attr.id}>
                                                        <Controller
                                                            name={`variants.${index}.attribute_values`}
                                                            control={control}
                                                            render={({ field: { value, onChange } }) => {
                                                                // Since we store all selected attribute value IDs in one flat array, 
                                                                // we need to find if this variant has an attribute_value belonging to THIS attribute.
                                                                const currentAttrValIds = value || [];
                                                                const matchingVal = attr.values.find((v:any) => currentAttrValIds.includes(v.id));

                                                                return (
                                                                    <Select
                                                                        value={matchingVal ? matchingVal.id.toString() : ""}
                                                                        onValueChange={(val) => {
                                                                            const newVal = Number(val);
                                                                            // Remove outdated value from same attribute family if exists
                                                                            const filtered = currentAttrValIds.filter(id => !attr.values.find((v:any) => v.id === id));
                                                                            onChange([...filtered, newVal]);
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="h-8 text-xs bg-white">
                                                                            <SelectValue placeholder={isRtl ? attr.name_ar : attr.name_en} />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {attr.values.map((val:any) => (
                                                                                <SelectItem key={val.id} value={val.id.toString()} className="text-xs">{val.value}</SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                )
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* LOGISTICS TAB */}
                    <div className={activeTab === 'shipping' ? 'block space-y-5' : 'hidden'}>
                        <div className="space-y-1.5">
                            <Label>Product Kind</Label>
                            <Controller
                                name="product_kind"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select kind" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="physical">Physical Product</SelectItem>
                                            <SelectItem value="digital">Digital Product</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Weight (kg)</Label>
                                <Input type="number" min={0} step="0.01" {...register('weight')} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Shipping Cost (Flat Rate)</Label>
                                <Input type="number" min={0} step="0.01" {...register('shipping_cost')} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label>Length (cm)</Label>
                                <Input type="number" min={0} step="0.01" {...register('length')} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Width (cm)</Label>
                                <Input type="number" min={0} step="0.01" {...register('width')} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Height (cm)</Label>
                                <Input type="number" min={0} step="0.01" {...register('height')} />
                            </div>
                        </div>
                    </div>

                    {/* VISIBILITY TAB */}
                    <div className={activeTab === 'visibility' ? 'block space-y-4' : 'hidden'}>
                        <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-base text-gray-900 dark:text-gray-100">Active Status</Label>
                                    <p className="text-xs text-gray-500 mt-0.5">Determine if the product is visible to customers.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" {...register('is_active')} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                                </label>
                            </div>

                            <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-base text-gray-900 dark:text-gray-100">Mark as Popular</Label>
                                    <p className="text-xs text-gray-500 mt-0.5">Show this product in popular sections.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" {...register('is_popular')} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                                </label>
                            </div>

                            <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-base text-gray-900 dark:text-gray-100">Mark as Featured</Label>
                                    <p className="text-xs text-gray-500 mt-0.5">Highlight this product on your store.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" {...register('is_featured')} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50 dark:bg-gray-900/50">
                    <Button type="button" variant="outline" onClick={onClose}>{t('vendor.products.cancel', 'Cancel')}</Button>
                    <Button type="submit" form="product-form" disabled={processing} className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-sm">
                        {processing ? t('vendor.products.saving', 'Saving...') : t('vendor.products.save', 'Save Product')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function DeleteDialog({ open, onCancel, onConfirm, processing }: any) {
    const { t, i18n } = useTranslation();
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 transition-opacity" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm p-6 transform scale-100 transition-transform">
                <div className="flex flex-col items-center text-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                        <AlertTriangle size={26} className="text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Delete Product?</h3>
                        <p className="text-sm text-gray-500">{t('vendor_dashboard.products.delete_confirm', 'Are you sure you want to delete this product? This action cannot be undone.')}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 border-gray-200" onClick={onCancel}>{t('vendor_dashboard.products.cancel', 'Cancel')}</Button>
                    <Button className="flex-1 bg-red-500 hover:bg-red-600 shadow-sm text-white border-0" disabled={processing} onClick={onConfirm}>{t('vendor_dashboard.products.delete', 'Delete')}</Button>
                </div>
            </div>
        </div>
    );
}

export default function VendorProducts({ store, products, categories, attributes }: Props) {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const [modalOpen, setModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<ProductItem | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ProductItem | null>(null);
    const [processing, setProcessing] = useState(false);
    const [search, setSearch] = useState('');

    const filtered = products.data.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

    const handleSubmit = (data: ProductFormData) => {
        setProcessing(true);

        const fd = new FormData();
        if (editProduct) {
            fd.append('_method', 'PUT'); // required for Laravel file uploads on updates
        }

        Object.keys(data).forEach(key => {
            if (key === 'images' && data.images) {
                Array.from(data.images).forEach((file: any) => {
                    fd.append(`images[]`, file as Blob);
                });
            } else if (key === 'variants' && data.variants) {
                data.variants.forEach((v, i) => {
                    fd.append(`variants[${i}][price]`, String(v.price));
                    fd.append(`variants[${i}][stock]`, String(v.stock));
                    if (v.sale_price !== null && v.sale_price !== undefined) fd.append(`variants[${i}][sale_price]`, String(v.sale_price));
                    if (v.sku) fd.append(`variants[${i}][sku]`, v.sku);
                    fd.append(`variants[${i}][is_active]`, v.is_active ? '1' : '0');
                    if (v.attribute_values) {
                        v.attribute_values.forEach((attrId, j) => {
                            fd.append(`variants[${i}][attribute_values][${j}]`, String(attrId));
                        });
                    }
                });
            } else {
                const val = (data as any)[key];
                if (val !== null && val !== undefined) {
                    fd.append(key, typeof val === 'boolean' ? (val ? '1' : '0') : val.toString());
                }
            }
        });

        const opts = {
            onSuccess: () => { toast.success(t('vendor.products.save_success', 'Product saved!')); setModalOpen(false); },
            onError: (errors: any) => {
                toast.error(t('common.error', 'Something went wrong.'));
                console.error(errors);
            },
            onFinish: () => setProcessing(false),
        };

        if (editProduct) {
            router.post(`/vendor/products/${editProduct.id}`, fd, opts);
        } else {
            router.post('/vendor/products', fd, opts);
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        setProcessing(true);
        router.delete(`/vendor/products/${deleteTarget.id}`, {
            onSuccess: () => { toast.success(t('vendor.products.delete_success', 'Product deleted!')); setDeleteTarget(null); },
            onError: () => toast.error(t('common.error', 'Something went wrong.')),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <VendorLayout title={t('vendor.products.title', 'Products')}>
            <Head title={`${store.name} — ${t('vendor.products.title', 'Products')}`} />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{t('vendor.products.title', 'Products')}</h2>
                    <p className="text-sm text-gray-500 mt-1 max-w-xl">Manage your catalog, variants, and product visibility across your digital storefront.</p>
                </div>
                <Button onClick={() => { setEditProduct(null); setModalOpen(true); }} className="bg-orange-500 hover:bg-orange-600 shadow-sm text-white border-0 gap-2 shrink-0 rounded-xl px-5">
                    <Plus size={18} /> {t('vendor.products.add', 'Add Product')}
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="relative w-full sm:w-80">
                    <Search size={16} className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'} text-gray-400`} />
                    <Input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={t('vendor.products.search', 'Search products by title...')}
                        className={`rounded-xl border-gray-200 shadow-sm ${isRtl ? 'pr-10' : 'pl-10'} h-10 w-full`}
                    />
                </div>
                <div className="text-sm text-gray-500 font-medium bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-4 py-2 rounded-xl shadow-sm">
                    Total: <span className="text-gray-900 dark:text-white font-bold">{products.total}</span>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 border-dashed">
                    <div className="w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center mb-5"><Box size={32} className="text-orange-400" /></div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Products Found</h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">{search ? t('vendor.products.no_search_results', 'No products match your search query.') : t('vendor.products.no_products', 'Get started by creating your first product to display on your storefront.')}</p>
                    {!search && (
                        <Button onClick={() => { setEditProduct(null); setModalOpen(true); }} variant="outline" className="mt-6 border-gray-200 shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                            Create First Product
                        </Button>
                    )}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-gray-500 uppercase tracking-wider bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                                    <th className="px-6 py-4 text-start font-semibold">{t('vendor_dashboard.products.title', 'Product')}</th>
                                    <th className="px-6 py-4 text-start font-semibold hidden lg:table-cell">{t('vendor_dashboard.products.category', 'Category')}</th>
                                    <th className="px-6 py-4 text-start font-semibold">{t('vendor_dashboard.products.price', 'Pricing')}</th>
                                    <th className="px-6 py-4 text-start font-semibold hidden sm:table-cell">{t('vendor_dashboard.products.stock', 'Stock')}</th>
                                    <th className="px-6 py-4 text-start font-semibold">{t('vendor_dashboard.products.status', 'Status')}</th>
                                    <th className="px-6 py-4 text-end font-semibold">{t('vendor_dashboard.orders.actions', 'Actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filtered.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors group">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            {product.images && product.images.length > 0 ? (
                                                <img src={product.images[0].image.startsWith('http') ? product.images[0].image : `/storage/${product.images[0].image}`} className="w-10 h-10 rounded-md object-cover border border-gray-200 shrink-0" alt="Thumb" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-md border border-gray-200 bg-gray-50 shrink-0 flex items-center justify-center text-gray-400">
                                                    <ImageIcon size={16} />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">{product.title}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    {product.sku && <span className="text-[10px] text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{product.sku}</span>}
                                                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">{product.product_type}</span>
                                                    {product.product_type === 'variant' && <span className="text-[10px] text-orange-500 font-medium">{product.variants?.length || 0} variants</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <span className="inline-flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-xs text-gray-600 dark:text-gray-300">
                                                {product.category ? (isRtl ? product.category.name_ar : product.category.name_en) : 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.product_type === 'variant' ? (
                                                <span className="font-semibold text-gray-700 dark:text-gray-300">See variants</span>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900 dark:text-white">{store.currency} {product.sale_price || product.price}</span>
                                                    {product.sale_price && <span className="text-xs text-gray-400 line-through">{store.currency} {product.price}</span>}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            {product.product_type === 'variant' ? (
                                                <span className="text-gray-500">—</span>
                                            ) : product.stock > 0
                                                ? <span className="font-medium text-gray-700 dark:text-gray-300">{product.stock} in stock</span>
                                                : <span className="font-medium text-red-500">Out of stock</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4"><StatusBadge is_active={product.is_active} /></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500">
                                                            <span className="sr-only">Open menu</span>
                                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.625 2.5C8.625 3.12132 8.12132 3.625 7.5 3.625C6.87868 3.625 6.375 3.12132 6.375 2.5C6.375 1.87868 6.87868 1.375 7.5 1.375C8.12132 1.375 8.625 1.87868 8.625 2.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM7.5 13.625C8.12132 13.625 8.625 13.1213 8.625 12.5C8.625 11.8787 8.12132 11.375 7.5 11.375C6.87868 11.375 6.375 11.8787 6.375 12.5C6.375 13.1213 6.87868 13.625 7.5 13.625Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => { setEditProduct(product); setModalOpen(true); }} className="gap-2 cursor-pointer">
                                                            <Pencil size={14} className="text-gray-500" /> Edit Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => setDeleteTarget(product)} className="text-red-500 gap-2 cursor-pointer hover:text-red-600 focus:text-red-600">
                                                            <Trash2 size={14} /> Delete Product
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {products.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between">
                            <p className="text-sm text-gray-600">Showing page {products.current_page} of {products.last_page}</p>
                        </div>
                    )}
                </div>
            )}

            <ProductModal open={modalOpen} onClose={() => setModalOpen(false)} categories={categories} attributes={attributes} editProduct={editProduct} currency={store.currency} processing={processing} onSubmit={handleSubmit} />
            <DeleteDialog open={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} processing={processing} />
        </VendorLayout>
    );
}
