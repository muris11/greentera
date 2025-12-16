'use client';

import { Loader2, RefreshCw, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Settings {
  pointsPerKg: {
    PLASTIC: number;
    PAPER: number;
    ORGANIC: number;
    METAL: number;
  };
  levelThresholds: {
    SILVER: number;
    GOLD: number;
  };
  ecoTreeConfig: {
    claimXpThreshold: number;
    bonusPoints: number;
  };
  voucherConfig: {
    expiryDays: number;
  };
}

const defaultSettings: Settings = {
  pointsPerKg: { PLASTIC: 10, PAPER: 8, ORGANIC: 5, METAL: 15 },
  levelThresholds: { SILVER: 500, GOLD: 1000 },
  ecoTreeConfig: { claimXpThreshold: 1000, bonusPoints: 200 },
  voucherConfig: { expiryDays: 30 },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setSettings({ ...defaultSettings, ...data.settings });
          }
        }
      } catch (error) {
        console.error('Fetch settings error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving settings' });
    } finally {
      setSaving(false);
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
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-foreground/60 mt-1">Konfigurasi sistem aplikasi (tersimpan di database)</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-foreground rounded-xl transition-colors"
        >
          {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {/* Points per KG */}
      <div className="bg-white/60 border border-black/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Points per KG</h3>
        <p className="text-foreground/60 text-sm mb-4">Jumlah poin yang diberikan per kilogram untuk setiap jenis sampah. Perubahan akan berlaku untuk setoran baru.</p>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(settings.pointsPerKg).map(([type, value]) => (
            <div key={type}>
              <label className="block text-sm text-foreground/60 mb-1">{type}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setSettings({
                  ...settings,
                  pointsPerKg: { ...settings.pointsPerKg, [type]: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-4 py-2 bg-white/60 border border-black/10 rounded-xl text-foreground focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Level Thresholds */}
      <div className="bg-white/60 border border-black/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Level Thresholds</h3>
        <p className="text-foreground/60 text-sm mb-4">Batas poin minimum untuk naik level. User akan otomatis naik level saat mencapai threshold.</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-foreground/60 mb-1">SILVER (min points)</label>
            <input
              type="number"
              value={settings.levelThresholds.SILVER}
              onChange={(e) => setSettings({
                ...settings,
                levelThresholds: { ...settings.levelThresholds, SILVER: parseInt(e.target.value) || 0 }
              })}
              className="w-full px-4 py-2 bg-white/60 border border-black/10 rounded-xl text-foreground focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground/60 mb-1">GOLD (min points)</label>
            <input
              type="number"
              value={settings.levelThresholds.GOLD}
              onChange={(e) => setSettings({
                ...settings,
                levelThresholds: { ...settings.levelThresholds, GOLD: parseInt(e.target.value) || 0 }
              })}
              className="w-full px-4 py-2 bg-white/60 border border-black/10 rounded-xl text-foreground focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>
      </div>

      {/* Eco Tree Config */}
      <div className="bg-white/60 border border-black/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Eco Tree Configuration</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-foreground/60 mb-1">Claim XP Threshold</label>
            <input
              type="number"
              value={settings.ecoTreeConfig.claimXpThreshold}
              onChange={(e) => setSettings({
                ...settings,
                ecoTreeConfig: { ...settings.ecoTreeConfig, claimXpThreshold: parseInt(e.target.value) || 0 }
              })}
              className="w-full px-4 py-2 bg-white/60 border border-black/10 rounded-xl text-foreground focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground/60 mb-1">Bonus Points</label>
            <input
              type="number"
              value={settings.ecoTreeConfig.bonusPoints}
              onChange={(e) => setSettings({
                ...settings,
                ecoTreeConfig: { ...settings.ecoTreeConfig, bonusPoints: parseInt(e.target.value) || 0 }
              })}
              className="w-full px-4 py-2 bg-white/60 border border-black/10 rounded-xl text-foreground focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>
      </div>

      {/* Voucher Config */}
      <div className="bg-white/60 border border-black/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Voucher Configuration</h3>
        <div>
          <label className="block text-sm text-foreground/60 mb-1">Expiry Days</label>
          <input
            type="number"
            value={settings.voucherConfig.expiryDays}
            onChange={(e) => setSettings({
              ...settings,
              voucherConfig: { ...settings.voucherConfig, expiryDays: parseInt(e.target.value) || 0 }
            })}
            className="w-full max-w-xs px-4 py-2 bg-white/60 border border-black/10 rounded-xl text-foreground focus:outline-none focus:border-emerald-500/50"
          />
          <p className="text-foreground/40 text-sm mt-1">Jumlah hari sampai voucher expired setelah ditukarkan</p>
        </div>
      </div>
    </div>
  );
}
