'use client';

import { CheckCircle, Clock, Edit2, Filter, Loader2, Plus, Search, Ticket, Trash2, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  points: number;
}

interface Voucher {
  id: string;
  user: { id: string; name: string; email: string };
  voucherType: string;
  voucherCode: string;
  pointsUsed: number;
  nominal: number;
  isRedeemed: boolean;
  createdAt: string;
  expiresAt: string;
}

interface Stats {
  totalVouchers: number;
  totalValue: number;
  totalPointsUsed: number;
  redeemedCount: number;
}

const voucherTypeLabels: Record<string, string> = {
  PULSA_10K: 'Pulsa 10K',
  PULSA_20K: 'Pulsa 20K',
  PULSA_50K: 'Pulsa 50K',
  DISCOUNT_10: 'Diskon 10%',
  DISCOUNT_25: 'Diskon 25%',
  DISCOUNT_50: 'Diskon 50%',
};

const voucherTypes = [
  { value: 'PULSA_10K', label: 'Pulsa 10K', nominal: 10000, points: 100 },
  { value: 'PULSA_20K', label: 'Pulsa 20K', nominal: 20000, points: 200 },
  { value: 'PULSA_50K', label: 'Pulsa 50K', nominal: 50000, points: 500 },
  { value: 'DISCOUNT_10', label: 'Diskon 10%', nominal: 5000, points: 50 },
  { value: 'DISCOUNT_25', label: 'Diskon 25%', nominal: 12500, points: 125 },
  { value: 'DISCOUNT_50', label: 'Diskon 50%', nominal: 25000, points: 250 },
];

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({ totalVouchers: 0, totalValue: 0, totalPointsUsed: 0, redeemedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [formData, setFormData] = useState({
    userId: '',
    voucherType: 'PULSA_10K',
    nominal: 10000,
    pointsUsed: 100,
    expiresAt: '',
    isRedeemed: false,
    deductPoints: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      
      const res = await fetch(`/api/admin/vouchers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setVouchers(data.vouchers || []);
        setUsers(data.users || []);
        setStats(data.stats || { totalVouchers: 0, totalValue: 0, totalPointsUsed: 0, redeemedCount: 0 });
      }
    } catch (error) {
      console.error('Fetch vouchers error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [filterStatus]);

  const openCreateModal = () => {
    setEditingVoucher(null);
    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + 30);
    setFormData({
      userId: users[0]?.id || '',
      voucherType: 'PULSA_10K',
      nominal: 10000,
      pointsUsed: 100,
      expiresAt: defaultExpiry.toISOString().split('T')[0],
      isRedeemed: false,
      deductPoints: false,
    });
    setShowModal(true);
  };

  const openEditModal = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      userId: voucher.user.id,
      voucherType: voucher.voucherType,
      nominal: voucher.nominal,
      pointsUsed: voucher.pointsUsed,
      expiresAt: new Date(voucher.expiresAt).toISOString().split('T')[0],
      isRedeemed: voucher.isRedeemed,
      deductPoints: false,
    });
    setShowModal(true);
  };

  const handleVoucherTypeChange = (type: string) => {
    const selected = voucherTypes.find(v => v.value === type);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        voucherType: type,
        nominal: selected.nominal,
        pointsUsed: selected.points,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingVoucher) {
        // Update voucher
        const res = await fetch('/api/admin/vouchers', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            voucherId: editingVoucher.id,
            voucherType: formData.voucherType,
            nominal: formData.nominal,
            pointsUsed: formData.pointsUsed,
            expiresAt: formData.expiresAt,
            isRedeemed: formData.isRedeemed,
          }),
        });
        if (res.ok) {
          setShowModal(false);
          fetchVouchers();
        }
      } else {
        // Create voucher
        const res = await fetch('/api/admin/vouchers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: formData.userId,
            voucherType: formData.voucherType,
            nominal: formData.nominal,
            pointsUsed: formData.pointsUsed,
            expiresAt: formData.expiresAt,
            deductPoints: formData.deductPoints,
          }),
        });
        if (res.ok) {
          setShowModal(false);
          fetchVouchers();
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (voucherId: string) => {
    if (!confirm('Hapus voucher ini? Poin akan dikembalikan ke user jika belum di-redeem.')) return;

    try {
      const res = await fetch(`/api/admin/vouchers?id=${voucherId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchVouchers();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const now = new Date();
  const filteredVouchers = vouchers.filter(v =>
    v.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.voucherCode?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
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
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Voucher Management</h1>
          <p className="text-foreground/60 mt-1">Kelola semua voucher</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
        >
          <Plus size={20} />
          Tambah Voucher
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/60 border border-black/10 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Ticket className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-foreground/60 text-sm">Total Vouchers</p>
            <p className="text-2xl font-bold text-foreground">{stats.totalVouchers}</p>
          </div>
        </div>
        <div className="bg-white/60 border border-black/10 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-foreground/60 text-sm">Redeemed</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.redeemedCount}</p>
          </div>
        </div>
        <div className="bg-white/60 border border-black/10 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl">
            <Clock className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-foreground/60 text-sm">Pending</p>
            <p className="text-2xl font-bold text-amber-400">{stats.totalVouchers - stats.redeemedCount}</p>
          </div>
        </div>
        <div className="bg-white/60 border border-black/10 rounded-xl p-4">
          <p className="text-foreground/60 text-sm">Total Value</p>
          <p className="text-2xl font-bold text-foreground">Rp {stats.totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau kode voucher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/60 border border-black/10 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-foreground/60" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white/60 border border-black/10 rounded-xl text-foreground focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="redeemed">Redeemed</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white/60 border border-black/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/60">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Voucher</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Points</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Expires</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {filteredVouchers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-foreground/60">
                    No vouchers found
                  </td>
                </tr>
              ) : (
                filteredVouchers.map((voucher) => {
                  const isExpired = new Date(voucher.expiresAt) < now;
                  
                  return (
                    <tr key={voucher.id} className="hover:bg-white/60 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-foreground">{voucher.user?.name}</p>
                          <p className="text-sm text-foreground/60">{voucher.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-foreground font-medium">
                          {voucherTypeLabels[voucher.voucherType] || voucher.voucherType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="px-2 py-1 bg-white/50 rounded text-emerald-400 text-sm">
                          {voucher.voucherCode}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-amber-400 font-semibold">
                        {voucher.pointsUsed.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {voucher.isRedeemed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs">
                            <CheckCircle size={14} /> Redeemed
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs">
                            <XCircle size={14} /> Expired
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs">
                            <Clock size={14} /> Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-foreground/60">
                        {new Date(voucher.expiresAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(voucher)}
                            className="p-2 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(voucher.id)}
                            className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {editingVoucher ? 'Edit Voucher' : 'Tambah Voucher'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingVoucher && (
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">User</label>
                  <select
                    value={formData.userId}
                    onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    required
                  >
                    <option value="">Pilih user...</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email}) - {user.points} pts
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Jenis Voucher</label>
                <select
                  value={formData.voucherType}
                  onChange={(e) => handleVoucherTypeChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  required
                >
                  {voucherTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} - Rp {type.nominal.toLocaleString()} ({type.points} pts)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    value={formData.nominal}
                    onChange={(e) => setFormData(prev => ({ ...prev, nominal: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Points Used</label>
                  <input
                    type="number"
                    value={formData.pointsUsed}
                    onChange={(e) => setFormData(prev => ({ ...prev, pointsUsed: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Tanggal Expired</label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {!editingVoucher && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="deductPoints"
                    checked={formData.deductPoints}
                    onChange={(e) => setFormData(prev => ({ ...prev, deductPoints: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="deductPoints" className="text-sm text-foreground/70">
                    Kurangi poin dari user
                  </label>
                </div>
              )}

              {editingVoucher && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isRedeemed"
                    checked={formData.isRedeemed}
                    onChange={(e) => setFormData(prev => ({ ...prev, isRedeemed: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="isRedeemed" className="text-sm text-foreground/70">
                    Mark as redeemed
                  </label>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {editingVoucher ? 'Update' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
