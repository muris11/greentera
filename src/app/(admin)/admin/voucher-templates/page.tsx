'use client';

import { Edit2, Gift, Loader2, Plus, ToggleLeft, ToggleRight, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface VoucherTemplate {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  category: string;
  nominal: number;
  pointsCost: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

const categories = [
  { value: 'PULSA', label: 'Pulsa' },
  { value: 'EWALLET', label: 'E-Wallet' },
  { value: 'DISCOUNT', label: 'Diskon' },
  { value: 'OTHER', label: 'Lainnya' },
];

const defaultIcons = ['🎁', '📱', '💳', '🛒', '💰', '🎫', '🎟️', '💎'];

export default function VoucherTemplatesPage() {
  const [templates, setTemplates] = useState<VoucherTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<VoucherTemplate | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🎁',
    category: 'PULSA',
    nominal: 10000,
    pointsCost: 100,
    stock: -1,
    isActive: true,
  });

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/admin/voucher-templates');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const openCreateModal = () => {
    setEditing(null);
    setFormData({
      name: '',
      description: '',
      icon: '🎁',
      category: 'PULSA',
      nominal: 10000,
      pointsCost: 100,
      stock: -1,
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (template: VoucherTemplate) => {
    setEditing(template);
    setFormData({
      name: template.name,
      description: template.description || '',
      icon: template.icon,
      category: template.category,
      nominal: template.nominal,
      pointsCost: template.pointsCost,
      stock: template.stock,
      isActive: template.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Debug: log the editing state
      console.log('Editing state:', editing);
      console.log('Using method:', editing ? 'PUT' : 'POST');
      
      const payload = editing 
        ? { ...formData, id: editing.id }
        : formData;
      
      console.log('Payload:', payload);

      const res = await fetch('/api/admin/voucher-templates', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        fetchTemplates();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus template voucher ini?')) return;

    try {
      const res = await fetch(`/api/admin/voucher-templates?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTemplates();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const toggleActive = async (template: VoucherTemplate) => {
    try {
      const res = await fetch('/api/admin/voucher-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: template.id, isActive: !template.isActive }),
      });
      if (res.ok) {
        fetchTemplates();
      }
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

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
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Template Voucher</h1>
          <p className="text-foreground/60 mt-1">Kelola jenis-jenis voucher yang bisa ditukar user</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
        >
          <Plus size={20} />
          Tambah Template
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.length === 0 ? (
          <div className="col-span-full text-center py-12 text-foreground/60">
            <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada template voucher</p>
            <p className="text-sm">Klik &ldquo;Tambah Template&rdquo; untuk membuat</p>
          </div>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className={`bg-white/60 border border-black/10 rounded-2xl p-6 ${!template.isActive ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{template.icon}</div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleActive(template)}
                    className={`p-1.5 rounded-lg transition-colors ${template.isActive ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-gray-400 hover:bg-gray-500/10'}`}
                    title={template.isActive ? 'Active' : 'Inactive'}
                  >
                    {template.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>
                  <button
                    onClick={() => openEditModal(template)}
                    className="p-1.5 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-1">{template.name}</h3>
              {template.description && (
                <p className="text-sm text-foreground/60 mb-3">{template.description}</p>
              )}
              
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-foreground/60">Nominal</span>
                <span className="font-semibold text-foreground">Rp {template.nominal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-foreground/60">Poin</span>
                <span className="font-semibold text-amber-600">{template.pointsCost} pts</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground/60">Stock</span>
                <span className={template.stock === -1 ? 'text-emerald-600' : template.stock === 0 ? 'text-red-600' : 'text-foreground'}>
                  {template.stock === -1 ? '∞ Unlimited' : template.stock}
                </span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-black/10">
                <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs ${
                  template.category === 'PULSA' ? 'bg-blue-500/20 text-blue-600' :
                  template.category === 'EWALLET' ? 'bg-purple-500/20 text-purple-600' :
                  template.category === 'DISCOUNT' ? 'bg-amber-500/20 text-amber-600' :
                  'bg-gray-500/20 text-gray-600'
                }`}>
                  {categories.find(c => c.value === template.category)?.label || template.category}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {editing ? 'Edit Template' : 'Tambah Template'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Nama Voucher</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Pulsa 10K, E-Wallet 50K, dll"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Deskripsi (Opsional)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Deskripsi singkat voucher"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {defaultIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                      className={`w-10 h-10 text-xl rounded-lg border transition-all ${
                        formData.icon === icon 
                          ? 'border-emerald-500 bg-emerald-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    value={formData.nominal}
                    onChange={(e) => setFormData(prev => ({ ...prev, nominal: parseInt(e.target.value) || 0 }))}
                    min="0"
                    step="1000"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Poin Tukar</label>
                  <input
                    type="number"
                    value={formData.pointsCost}
                    onChange={(e) => setFormData(prev => ({ ...prev, pointsCost: parseInt(e.target.value) || 0 }))}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">
                  Stock <span className="text-foreground/50">(-1 = unlimited)</span>
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value === '' ? -1 : parseInt(e.target.value) || -1 }))}
                  min="-1"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isActive" className="text-sm text-foreground/70">
                  Aktif (bisa ditukar user)
                </label>
              </div>

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
                  {editing ? 'Update' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
