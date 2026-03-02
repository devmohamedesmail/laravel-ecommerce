import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
  Plus, Pencil, Trash2, Shield, ToggleLeft, ToggleRight,
  ChevronLeft, ChevronRight, Search, X, CheckCircle, AlertCircle
} from 'lucide-react';

interface Role {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

interface PaginatedRoles {
  data: Role[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

interface Props {
  roles: PaginatedRoles;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Roles', href: '/admin/roles' },
];

const emptyForm = { name: '', slug: '', description: '', is_active: true };

function generateSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function RolesPage({ roles }: Props) {
  const { flash } = usePage().props as any;
  const [showModal, setShowModal] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [processing, setProcessing] = useState(false);

  const openCreate = () => {
    setEditRole(null);
    setForm(emptyForm);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (role: Role) => {
    setEditRole(role);
    setForm({
      name: role.name,
      slug: role.slug,
      description: role.description ?? '',
      is_active: role.is_active,
    });
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditRole(null);
    setForm(emptyForm);
    setErrors({});
  };

  const handleNameChange = (value: string) => {
    setForm(f => ({
      ...f,
      name: value,
      slug: editRole ? f.slug : generateSlug(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    const method = editRole ? 'put' : 'post';
    const url = editRole ? `/admin/roles/${editRole.id}` : '/admin/roles';

    router[method](url, form as any, {
      onSuccess: () => { closeModal(); },
      onError: (errs) => { setErrors(errs); },
      onFinish: () => setProcessing(false),
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    router.delete(`/admin/roles/${deleteId}`, {
      onFinish: () => setDeleteId(null),
    });
  };

  const filtered = roles.data.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Roles Management" />

      <div className="p-6 space-y-6">
        {/* Flash messages */}
        {flash?.success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            <CheckCircle size={16} /> {flash.success}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield size={22} className="text-violet-500" />
              Roles Management
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{roles.total} total roles</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={16} /> Add New Role
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Search bar */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="relative max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search roles…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 outline-none focus:border-violet-400 transition-colors dark:text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-gray-400 text-sm">
                      No roles found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((role, i) => (
                    <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3.5 text-gray-400 text-xs">
                        {(roles.current_page - 1) * roles.per_page + i + 1}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-gray-100">{role.name}</td>
                      <td className="px-5 py-3.5">
                        <code className="bg-gray-100 dark:bg-gray-700 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded text-xs">{role.slug}</code>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                        {role.description || '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${role.is_active
                            ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${role.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                          {role.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs">
                        {new Date(role.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEdit(role)}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-900/30 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteId(role.id)}
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
          {roles.last_page > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500">
                Page {roles.current_page} of {roles.last_page} · {roles.total} results
              </p>
              <div className="flex gap-1">
                <button
                  disabled={roles.current_page === 1}
                  onClick={() => router.get(`/admin/roles?page=${roles.current_page - 1}`)}
                  className="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  disabled={roles.current_page === roles.last_page}
                  onClick={() => router.get(`/admin/roles?page=${roles.current_page + 1}`)}
                  className="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield size={18} className="text-violet-500" />
                {editRole ? 'Edit Role' : 'Create New Role'}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name <span className="text-red-500">*</span></label>
                <input
                  value={form.name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="e.g. Editor"
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-lg outline-none transition-colors dark:bg-gray-800 dark:text-white ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 dark:border-gray-600 focus:border-violet-400'}`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Slug <span className="text-red-500">*</span></label>
                <input
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="e.g. editor"
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-lg outline-none transition-colors dark:bg-gray-800 dark:text-white font-mono ${errors.slug ? 'border-red-400 bg-red-50' : 'border-gray-200 dark:border-gray-600 focus:border-violet-400'}`}
                />
                {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Optional description…"
                  rows={2}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:border-violet-400 transition-colors dark:bg-gray-800 dark:text-white resize-none"
                />
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</p>
                  <p className="text-xs text-gray-400">Enable or disable this role</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                  className="transition-colors"
                >
                  {form.is_active
                    ? <ToggleRight size={36} className="text-violet-600" />
                    : <ToggleLeft size={36} className="text-gray-400" />
                  }
                </button>
              </div>

              {/* Footer buttons */}
              <div className="flex gap-3 pt-2">
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
                  className="flex-1 py-2.5 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-lg disabled:opacity-60 transition-colors"
                >
                  {processing ? 'Saving…' : editRole ? 'Update Role' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Delete Role?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone. Users with this role will have no role assigned.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 text-gray-600 dark:text-gray-300 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
