'use client';

import { ChevronLeft, ChevronRight, Edit, Loader2, Save, Search, Trash2, UserPlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  level: string;
  points: number;
  totalWaste: number;
  role: string;
  createdAt: string;
}

const levelColors: Record<string, string> = {
  BRONZE: 'bg-amber-700/20 text-amber-500 border-amber-700/30',
  SILVER: 'bg-slate-400/20 text-slate-300 border-slate-400/30',
  GOLD: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Edit modal
  const [editUser, setEditUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '', points: 0 });
  
  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: 'USER' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?search=${search}&limit=10&offset=${(page - 1) * 10}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounce);
  }, [search, page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return;
    
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
        setTotal(t => t - 1);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      points: user.points,
    });
  };

  const handleSaveEdit = async () => {
    if (!editUser) return;
    setSaving(true);
    
    try {
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      
      if (res.ok) {
        await fetchUsers();
        setEditUser(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update');
      }
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    if (!addForm.name || !addForm.email || !addForm.password) {
      alert('Please fill all fields');
      return;
    }
    setSaving(true);
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      
      if (res.ok) {
        await fetchUsers();
        setShowAddModal(false);
        setAddForm({ name: '', email: '', password: '', role: 'USER' });
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Create failed:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-foreground/60 mt-1">Kelola semua pengguna aplikasi ({total} total)</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
        >
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
        <input
          type="text"
          placeholder="Cari user berdasarkan nama atau email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-12 pr-4 py-3 bg-white/60 border border-black/10 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-emerald-500/50"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white/60 border border-black/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/60">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Level</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Points</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-foreground/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-foreground/60">
                    {loading ? 'Loading...' : 'No users found'}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-foreground font-semibold">
                          {user.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-foreground/60">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${levelColors[user.level] || levelColors.BRONZE}`}>
                        {user.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-emerald-400 font-semibold">{user.points?.toLocaleString() || 0}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs px-2 py-1 rounded ${user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/50 text-foreground/60'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-foreground/60">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(user)}
                          className="p-2 text-foreground/60 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-foreground/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
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
        <div className="px-6 py-4 border-t border-black/10 flex items-center justify-between">
          <p className="text-sm text-foreground/60">
            Showing {users.length} of {total} users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-white/60 text-foreground/60 hover:bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-4 py-2 text-foreground/80">Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={users.length < 10}
              className="p-2 rounded-lg bg-white/60 text-foreground/60 hover:bg-white/50 disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="glass-card border border-black/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Edit User</h3>
              <button onClick={() => setEditUser(null)} className="text-foreground/60 hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-foreground/60 mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/60 border border-black/10 rounded-lg text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm text-foreground/60 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white/60 border border-black/10 rounded-lg text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm text-foreground/60 mb-1">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full px-4 py-2 bg-white/60 border border-black/10 rounded-lg text-foreground"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-foreground/60 mb-1">Points</label>
                <input
                  type="number"
                  value={editForm.points}
                  onChange={(e) => setEditForm({ ...editForm, points: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-white/60 border border-black/10 rounded-lg text-foreground"
                />
              </div>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-foreground rounded-lg"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="glass-card border border-black/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Add New User</h3>
              <button onClick={() => setShowAddModal(false)} className="text-foreground/60 hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-foreground/60 mb-1">Name *</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="Enter name"
                  className="w-full px-4 py-2 bg-white/60 border border-black/10 rounded-lg text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm text-foreground/60 mb-1">Email *</label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="Enter email"
                  className="w-full px-4 py-2 bg-white/60 border border-black/10 rounded-lg text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm text-foreground/60 mb-1">Password *</label>
                <input
                  type="password"
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  placeholder="Enter password"
                  className="w-full px-4 py-2 bg-white/60 border border-black/10 rounded-lg text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm text-foreground/60 mb-1">Role</label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                  className="w-full px-4 py-2 bg-white/60 border border-black/10 rounded-lg text-foreground"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <button
                onClick={handleAdd}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-foreground rounded-lg"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
