'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Bell, Loader2, LogOut, Save, Settings, Shield, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    role: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || '',
            email: data.email || '',
            location: data.location || '',
            role: data.role || 'USER',
          });
        }
      } catch (error) {
        console.error('Fetch profile error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
        }),
      });

      if (res.ok) {
        await update({ name: formData.name });
        alert('Profil berhasil diperbarui!');
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal memperbarui profil');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary-500" />
          Pengaturan Akun
        </h1>
        <p className="text-foreground/60 mt-1">
          Kelola informasi profil dan preferensi akun Anda
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Sidebar Navigation */}
        <div className="space-y-4">
          <Card padding="sm">
            <CardContent className="p-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-700 rounded-lg font-medium transition-colors">
                <User size={20} />
                Profil Saya
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-foreground/60 hover:bg-foreground/5 rounded-lg font-medium transition-colors">
                <Bell size={20} />
                Notifikasi
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-foreground/60 hover:bg-foreground/5 rounded-lg font-medium transition-colors">
                <Shield size={20} />
                Keamanan
              </button>
            </CardContent>
          </Card>

          <Card padding="sm" className="border-red-200 bg-red-50/50">
            <CardContent className="p-2">
              <button 
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors"
              >
                <LogOut size={20} />
                Keluar Aplikasi
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Information */}
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Informasi Profil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-teal-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {formData.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{formData.name}</h3>
                    <p className="text-foreground/60">{formData.role}</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="input-label">Nama Lengkap</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div>
                    <label className="input-label">Email</label>
                    <Input
                      value={formData.email}
                      disabled
                      className="bg-foreground/5 text-foreground/60 cursor-not-allowed"
                    />
                    <p className="text-xs text-foreground/40 mt-1">Email tidak dapat diubah</p>
                  </div>

                  <div>
                    <label className="input-label">Lokasi</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Contoh: Jakarta Selatan"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={saving} isLoading={saving}>
                    <Save size={18} className="mr-2" />
                    Simpan Perubahan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>

          {/* Change Password Section */}
          <Card>
            <CardHeader>
              <CardTitle>Ganti Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label className="input-label">Password Saat Ini</label>
                  <Input type="password" placeholder="Masukkan password saat ini" />
                </div>
                <div>
                  <label className="input-label">Password Baru</label>
                  <Input type="password" placeholder="Masukkan password baru" />
                </div>
                <div>
                  <label className="input-label">Konfirmasi Password Baru</label>
                  <Input type="password" placeholder="Ulangi password baru" />
                </div>
                <div className="pt-2 flex justify-end">
                  <Button type="button" variant="secondary">
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferensi Notifikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-foreground/5 transition">
                  <div>
                    <p className="font-medium">Notifikasi Email</p>
                    <p className="text-sm text-foreground/60">Terima update via email</p>
                  </div>
                  <div className="w-11 h-6 bg-primary-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-foreground/5 transition">
                  <div>
                    <p className="font-medium">Notifikasi Aplikasi</p>
                    <p className="text-sm text-foreground/60">Notifikasi pop-up di dashboard</p>
                  </div>
                  <div className="w-11 h-6 bg-primary-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
