'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Check, Coins, History, Loader2, QrCode, Ticket } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { QRCodeSVG } from 'qrcode.react';
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
}

interface RedeemedVoucher {
  id: string;
  voucherType: string;
  voucherCode: string;
  nominal: number;
  pointsUsed: number;
  createdAt: string;
  template?: { name: string; icon: string };
}

export default function VoucherPage() {
  const { data: session } = useSession();
  const [userPoints, setUserPoints] = useState(0);
  const [voucherTemplates, setVoucherTemplates] = useState<VoucherTemplate[]>([]);
  const [redeemedVouchers, setRedeemedVouchers] = useState<RedeemedVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [success, setSuccess] = useState<{ code: string; nominal: number } | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherTemplate | null>(null);
  const [showQR, setShowQR] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile for points
        const profileRes = await fetch('/api/profile');
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setUserPoints(profile.points || 0);
        }

        // Fetch voucher templates (only active ones)
        const templatesRes = await fetch('/api/admin/voucher-templates');
        if (templatesRes.ok) {
          const templatesData = await templatesRes.json();
          setVoucherTemplates(templatesData.templates || []);
        }

        // Fetch redeemed vouchers
        const vouchersRes = await fetch('/api/voucher/history');
        if (vouchersRes.ok) {
          const data = await vouchersRes.json();
          setRedeemedVouchers(data.vouchers || []);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRedeem = async (template: VoucherTemplate) => {
    if (userPoints < template.pointsCost) return;
    if (template.stock === 0) return; // Out of stock

    setSelectedVoucher(template);
    setIsRedeeming(true);

    try {
      const res = await fetch('/api/voucher/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.id }),
      });

      const data = await res.json();

      if (res.ok) {
        setUserPoints(prev => prev - template.pointsCost);
        setSuccess({
          code: data.voucherCode,
          nominal: template.nominal,
        });
        // Add to redeemed list
        setRedeemedVouchers(prev => [{
          id: data.id || Date.now().toString(),
          voucherType: template.name,
          voucherCode: data.voucherCode,
          nominal: template.nominal,
          pointsUsed: template.pointsCost,
          createdAt: new Date().toISOString(),
          template: { name: template.name, icon: template.icon },
        }, ...prev]);
      } else {
        alert(data.error || 'Failed to redeem');
      }
    } catch (error) {
      console.error('Redeem error:', error);
    } finally {
      setIsRedeeming(false);
      setSelectedVoucher(null);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Ticket className="w-8 h-8 text-primary-500" />
            Tukar Voucher
          </h1>
          <p className="text-foreground/60 mt-1">
            Tukarkan poin Anda dengan voucher menarik
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-100">
          <Coins className="w-5 h-5 text-primary-600" />
          <span className="font-bold text-primary-700">{userPoints.toLocaleString()} pts</span>
        </div>
      </div>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card padding="lg" className="max-w-sm w-full text-center animate-fade-in">
            <CardContent>
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold mb-2">Penukaran Berhasil!</h3>
              <p className="text-foreground/60 mb-4">
                Voucher senilai Rp {success.nominal.toLocaleString()}
              </p>
              
              <div className="p-4 bg-foreground/5 rounded-xl mb-4">
                <p className="text-sm text-foreground/60 mb-2">Kode Voucher</p>
                <p className="text-2xl font-mono font-bold tracking-wider">
                  {success.code}
                </p>
              </div>

              <div className="flex justify-center mb-4">
                <QRCodeSVG value={success.code} size={150} />
              </div>

              <Button onClick={() => setSuccess(null)} className="w-full">
                Tutup
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card padding="lg" className="max-w-sm w-full text-center animate-fade-in">
            <CardContent>
              <h3 className="text-lg font-bold mb-4">QR Code Voucher</h3>
              <div className="flex justify-center mb-4">
                <QRCodeSVG value={showQR} size={200} />
              </div>
              <p className="font-mono font-bold text-lg mb-4">{showQR}</p>
              <Button onClick={() => setShowQR(null)} className="w-full">
                Tutup
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Voucher Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {voucherTemplates.length === 0 ? (
          <div className="col-span-full text-center py-8 text-foreground/60">
            Belum ada voucher tersedia
          </div>
        ) : voucherTemplates.map((template) => {
          const canAfford = userPoints >= template.pointsCost;
          const isThisRedeeming = isRedeeming && selectedVoucher?.id === template.id;
          const outOfStock = template.stock === 0;

          return (
            <Card 
              key={template.id} 
              padding="lg"
              className={`relative ${!canAfford || outOfStock ? 'opacity-60' : ''}`}
            >
              <CardContent className="text-center">
                <div className="text-5xl mb-3">{template.icon}</div>
                <h3 className="text-lg font-semibold mb-1">{template.name}</h3>
                <p className="text-2xl font-bold text-primary-600 mb-1">
                  Rp {template.nominal.toLocaleString()}
                </p>
                <p className="text-sm text-foreground/60 mb-4">
                  <Coins className="inline w-4 h-4 mr-1" />
                  {template.pointsCost} poin
                </p>
                <Button
                  className="w-full"
                  disabled={!canAfford || outOfStock}
                  isLoading={isThisRedeeming}
                  onClick={() => handleRedeem(template)}
                >
                  {outOfStock ? 'Habis' : canAfford ? 'Tukar Sekarang' : 'Poin Tidak Cukup'}
                </Button>
              </CardContent>
              {!canAfford && !outOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 rounded-2xl">
                  <span className="text-sm font-medium text-foreground/60">
                    Butuh {template.pointsCost - userPoints} poin lagi
                  </span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Redeemed Vouchers */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History size={20} />
            Riwayat Penukaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          {redeemedVouchers.length === 0 ? (
            <p className="text-center text-foreground/60 py-8">
              Belum ada voucher yang ditukar
            </p>
          ) : (
            <div className="space-y-3">
              {redeemedVouchers.slice(0, 5).map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-foreground/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {v.template?.name || v.voucherType}
                      </p>
                      <p className="text-sm text-foreground/60">
                        {new Date(v.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold">Rp {v.nominal.toLocaleString()}</p>
                      <p className="text-xs font-mono text-foreground/60">{v.voucherCode}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowQR(v.voucherCode)}
                    >
                      <QrCode size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
