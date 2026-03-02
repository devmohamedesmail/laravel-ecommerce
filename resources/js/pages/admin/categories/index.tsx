import React, { useState, useRef } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useForm, Controller } from 'react-hook-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
  Plus, Pencil, Trash2, Layers, ChevronLeft, ChevronRight,
  Search, X, CheckCircle, AlertCircle, ToggleLeft, ToggleRight,
  ImageIcon, Upload
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Parent {
  id: number;
  name_en: string;
  name_ar: string;
}

interface Category {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
  parent_id: number | null;
  parent: Parent | null;
  description_en: string | null;
  description_ar: string | null;
  image: string | null;
  is_active: boolean;
  created_at: string;
}

interface PaginatedCategories {
  data: Category[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

interface Props {
  categories: PaginatedCategories;
  parents: Parent[];
}

interface FormValues {
  name_en: string;
  name_ar: string;
  slug: string;
  parent_id: string;
  description_en: string;
  description_ar: string;
  is_active: boolean;
  // image is tracked separately in state, not via RHF
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Categories', href: '/admin/categories' },
];

function generateSlug(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// ─── Field component ─────────────────────────────────────────────────────────

function Field({
  label, error, required = false, children,
}: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

const inputCls = (err?: string) =>
  `w-full px-3.5 py-2.5 text-sm border rounded-lg outline-none transition-colors dark:bg-gray-800 dark:text-white placeholder-gray-400 ${err
    ? 'border-red-400 bg-red-50 dark:bg-red-900/10'
    : 'border-gray-200 dark:border-gray-600 focus:border-emerald-400'
  }`;

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CategoriesPage({ categories, parents }: Props) {
  const { flash } = usePage().props as any;

  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [search, setSearch] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name_en: '', name_ar: '', slug: '',
      parent_id: '', description_en: '',
      description_ar: '', is_active: true,
    },
  });

  const isActive = watch('is_active');
  const nameEn = watch('name_en');

  // Auto-generate slug from English name (only on create)
  React.useEffect(() => {
    if (!editCategory) {
      setValue('slug', generateSlug(nameEn ?? ''));
    }
  }, [nameEn, editCategory, setValue]);

  const openCreate = () => {
    setEditCategory(null);
    setImagePreview(null);
    setImageFile(null);
    reset({
      name_en: '', name_ar: '', slug: '', parent_id: '',
      description_en: '', description_ar: '', is_active: true,
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditCategory(cat);
    setImagePreview(cat.image ?? null);
    setImageFile(null);
    reset({
      name_en: cat.name_en,
      name_ar: cat.name_ar,
      slug: cat.slug,
      parent_id: cat.parent_id ? String(cat.parent_id) : '',
      description_en: cat.description_en ?? '',
      description_ar: cat.description_ar ?? '',
      is_active: cat.is_active,
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditCategory(null);
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    reset();
  };

  const onSubmit = (data: FormValues) => {
    setProcessing(true);

    const formData = new FormData();
    formData.append('name_en', data.name_en);
    formData.append('name_ar', data.name_ar);
    formData.append('slug', data.slug);
    formData.append('description_en', data.description_en ?? '');
    formData.append('description_ar', data.description_ar ?? '');
    formData.append('parent_id', data.parent_id ?? '');
    formData.append('is_active', data.is_active ? '1' : '0');

    // Use the file tracked in state — reliable alternative to RHF FileList
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const url = editCategory
      ? `/admin/categories/${editCategory.id}`
      : '/admin/categories';

    if (editCategory) {
      formData.append('_method', 'PUT');
    }

    router.post(url, formData as any, {
      forceFormData: true,
      onSuccess: () => closeModal(),
      onError: (errs) => {
        Object.entries(errs).forEach(([key, msg]) => {
          setError(key as keyof FormValues, { message: msg as string });
        });
      },
      onFinish: () => setProcessing(false),
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    router.delete(`/admin/categories/${deleteId}`, {
      onFinish: () => setDeleteId(null),
    });
  };

  const filtered = categories.data.filter(c =>
    c.name_en.toLowerCase().includes(search.toLowerCase()) ||
    c.name_ar.includes(search) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Categories Management" />

      <div className="p-6 space-y-6">

        {/* Flash message */}
        {flash?.success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            <CheckCircle size={16} /> {flash.success}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Layers size={22} className="text-emerald-500" />
              Categories Management
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{categories.total} total categories</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">

          {/* Search */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="relative max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search categories…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 outline-none focus:border-emerald-400 transition-colors dark:text-white"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name (EN)</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name (AR)</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Parent</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-gray-400 text-sm">
                      <Layers size={32} className="mx-auto mb-2 opacity-30" />
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((cat, i) => (
                    <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3.5 text-gray-400 text-xs">
                        {(categories.current_page - 1) * categories.per_page + i + 1}
                      </td>
                      <td className="px-5 py-3.5">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name_en} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <ImageIcon size={14} className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-gray-100">{cat.name_en}</td>
                      <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300 text-right font-medium" dir="rtl">{cat.name_ar}</td>
                      <td className="px-5 py-3.5">
                        <code className="bg-gray-100 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-xs">
                          {cat.slug}
                        </code>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs">
                        {cat.parent ? (
                          <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded text-xs font-medium">
                            {cat.parent.name_en}
                          </span>
                        ) : (
                          <span className="text-gray-400">Root</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cat.is_active
                          ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cat.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                          {cat.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs">
                        {new Date(cat.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEdit(cat)}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteId(cat.id)}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {categories.last_page > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500">Page {categories.current_page} of {categories.last_page} · {categories.total} results</p>
              <div className="flex gap-1">
                <button
                  disabled={categories.current_page === 1}
                  onClick={() => router.get(`/admin/categories?page=${categories.current_page - 1}`)}
                  className="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  disabled={categories.current_page === categories.last_page}
                  onClick={() => router.get(`/admin/categories?page=${categories.current_page + 1}`)}
                  className="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Create / Edit Modal ───────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700 shrink-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Layers size={18} className="text-emerald-500" />
                {editCategory ? 'Edit Category' : 'Create New Category'}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Scrollable body */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="overflow-y-auto flex-1"
              encType="multipart/form-data"
            >
              <div className="p-6 space-y-5">

                {/* Names row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Name (English)" error={errors.name_en?.message} required>
                    <input
                      {...register('name_en', { required: 'English name is required' })}
                      placeholder="e.g. Electronics"
                      className={inputCls(errors.name_en?.message)}
                    />
                  </Field>
                  <Field label="الاسم (عربي)" error={errors.name_ar?.message} required>
                    <input
                      {...register('name_ar', { required: 'Arabic name is required' })}
                      dir="rtl"
                      placeholder="مثال: الإلكترونيات"
                      className={`${inputCls(errors.name_ar?.message)} text-right`}
                    />
                  </Field>
                </div>

                {/* Slug */}
                <Field label="Slug" error={errors.slug?.message} required>
                  <input
                    {...register('slug', { required: 'Slug is required' })}
                    placeholder="e.g. electronics"
                    className={`${inputCls(errors.slug?.message)} font-mono`}
                  />
                </Field>

                {/* Parent + Active row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <Field label="Parent Category" error={errors.parent_id?.message}>
                    <select
                      {...register('parent_id')}
                      className={`${inputCls()} bg-white dark:bg-gray-800`}
                    >
                      <option value="">— Root (no parent) —</option>
                      {parents
                        .filter(p => p.id !== editCategory?.id)
                        .map(p => (
                          <option key={p.id} value={p.id}>{p.name_en}</option>
                        ))
                      }
                    </select>
                  </Field>

                  {/* Active toggle */}
                  <div className="flex items-center justify-between p-3.5 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</p>
                      <p className="text-xs text-gray-400">Visible on the storefront</p>
                    </div>
                    <Controller
                      name="is_active"
                      control={control}
                      render={({ field }) => (
                        <button type="button" onClick={() => field.onChange(!field.value)}>
                          {field.value
                            ? <ToggleRight size={36} className="text-emerald-500" />
                            : <ToggleLeft size={36} className="text-gray-400" />
                          }
                        </button>
                      )}
                    />
                  </div>
                </div>

                {/* Descriptions row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Description (English)" error={errors.description_en?.message}>
                    <textarea
                      {...register('description_en')}
                      rows={3}
                      placeholder="Optional description in English…"
                      className={`${inputCls()} resize-none`}
                    />
                  </Field>
                  <Field label="الوصف (عربي)" error={errors.description_ar?.message}>
                    <textarea
                      {...register('description_ar')}
                      dir="rtl"
                      rows={3}
                      placeholder="وصف اختياري بالعربية…"
                      className={`${inputCls()} resize-none text-right`}
                    />
                  </Field>
                </div>

                {/* Image upload */}
                <Field label="Category Image">
                  <div
                    className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-400 transition-colors group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img src={imagePreview} alt="Preview" className="h-24 w-auto rounded-lg object-cover mx-auto" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview(null);
                            setImageFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload size={24} className="mx-auto mb-2 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        <p className="text-sm text-gray-500">Click to upload image</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — max 2 MB</p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setImageFile(file);
                        setImagePreview(file ? URL.createObjectURL(file) : null);
                      }}
                    />
                  </div>
                </Field>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 px-6 py-4 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 py-2.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-60 transition-colors"
                >
                  {processing ? 'Saving…' : editCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ────────────────────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Delete Category?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This will also delete all child categories. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 text-gray-600 dark:text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
