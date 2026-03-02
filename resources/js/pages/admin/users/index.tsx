import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
  Plus, Pencil, Trash2, Users, ChevronLeft, ChevronRight,
  Search, X, CheckCircle, AlertCircle, Eye, EyeOff
} from 'lucide-react';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role_id: number | null;
  role: Role | null;
  created_at: string;
}

interface PaginatedUsers {
  data: User[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

interface Props {
  users: PaginatedUsers;
  roles: Role[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Users', href: '/admin/users' },
];

const emptyForm = { name: '', email: '', password: '', role_id: '' };

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const avatarColors = [
  'bg-violet-500', 'bg-blue-500', 'bg-green-500', 'bg-amber-500',
  'bg-red-500', 'bg-pink-500', 'bg-teal-500', 'bg-orange-500',
];
function avatarColor(id: number) {
  return avatarColors[id % avatarColors.length];
}

export default function UsersPage({ users, roles }: Props) {
  const { flash } = usePage().props as any;
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const openCreate = () => {
    setEditUser(null);
    setForm(emptyForm);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role_id: user.role_id ? String(user.role_id) : '',
    });
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditUser(null);
    setForm(emptyForm);
    setErrors({});
    setShowPassword(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    const method = editUser ? 'put' : 'post';
    const url = editUser ? `/admin/users/${editUser.id}` : '/admin/users';
    const payload = {
      ...form,
      role_id: form.role_id ? Number(form.role_id) : null,
      password: form.password || undefined,
    };

    router[method](url, payload as any, {
      onSuccess: () => closeModal(),
      onError: (errs) => setErrors(errs),
      onFinish: () => setProcessing(false),
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    router.delete(`/admin/users/${deleteId}`, {
      onFinish: () => setDeleteId(null),
    });
  };

  const filtered = users.data.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.role?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users Management" />

      <div className="p-6 space-y-6">
        {/* Flash */}
        {flash?.success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            <CheckCircle size={16} /> {flash.success}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users size={22} className="text-blue-500" />
              Users Management
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{users.total} total users</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={16} /> Add New User
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="relative max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search users…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 outline-none focus:border-blue-400 transition-colors dark:text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">No users found.</td>
                  </tr>
                ) : (
                  filtered.map((user, i) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3.5 text-gray-400 text-xs">
                        {(users.current_page - 1) * users.per_page + i + 1}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full ${avatarColor(user.id)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                            {getInitials(user.name)}
                          </div>
                          <span className="font-semibold text-gray-800 dark:text-gray-100">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{user.email}</td>
                      <td className="px-5 py-3.5">
                        {user.role ? (
                          <span className="inline-flex items-center text-xs font-medium bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 px-2.5 py-1 rounded-full">
                            {user.role.name}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">No role</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEdit(user)}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteId(user.id)}
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
          {users.last_page > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500">Page {users.current_page} of {users.last_page} · {users.total} results</p>
              <div className="flex gap-1">
                <button
                  disabled={users.current_page === 1}
                  onClick={() => router.get(`/admin/users?page=${users.current_page - 1}`)}
                  className="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  disabled={users.current_page === users.last_page}
                  onClick={() => router.get(`/admin/users?page=${users.current_page + 1}`)}
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
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users size={18} className="text-blue-500" />
                {editUser ? 'Edit User' : 'Create New User'}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="John Doe"
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-lg outline-none transition-colors dark:bg-gray-800 dark:text-white ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 dark:border-gray-600 focus:border-blue-400'}`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="john@example.com"
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-lg outline-none transition-colors dark:bg-gray-800 dark:text-white ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 dark:border-gray-600 focus:border-blue-400'}`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Password {editUser && <span className="text-gray-400 font-normal text-xs">(leave blank to keep current)</span>}
                  {!editUser && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder={editUser ? '••••••••' : 'Min. 8 characters'}
                    className={`w-full px-3.5 py-2.5 pr-10 text-sm border rounded-lg outline-none transition-colors dark:bg-gray-800 dark:text-white ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 dark:border-gray-600 focus:border-blue-400'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
                <select
                  value={form.role_id}
                  onChange={e => setForm(f => ({ ...f, role_id: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:border-blue-400 transition-colors dark:bg-gray-800 dark:text-white bg-white"
                >
                  <option value="">— No Role —</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                {errors.role_id && <p className="text-xs text-red-500 mt-1">{errors.role_id}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-2.5 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={processing} className="flex-1 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-60 transition-colors">
                  {processing ? 'Saving…' : editUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Delete User?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
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