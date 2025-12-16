'use client';

import { WasteBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowLeft, Calendar, Coins, Loader2, Weight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Deposit {
  id: string;
  wasteType: string;
  amount: number;
  pointsEarned: number;
  ecoXpEarned: number;
  scanMethod: string;
  depositDate: string;
}


function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMins = Math.floor(diffTime / (1000 * 60));
      return `${diffMins} menit lalu`;
    }
    return `${diffHours} jam lalu`;
  } else if (diffDays === 1) {
    return 'Kemarin';
  } else if (diffDays < 7) {
    return `${diffDays} hari lalu`;
  } else {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}

export default function WasteHistoryPage() {
  const [history, setHistory] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/waste/history');
        if (res.ok) {
          const data = await res.json();
          setHistory(data.deposits || []);
        } else {
          setError('Failed to load history');
        }
      } catch (err) {
        setError('Database connection error');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const totalWeight = history.reduce((sum, item) => sum + item.amount, 0);
  const totalPoints = history.reduce((sum, item) => sum + item.pointsEarned, 0);
  const totalDeposits = history.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/waste">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">📜 Riwayat Setoran</h1>
          <p className="text-foreground/60 mt-1">
            Daftar semua setoran sampah Anda
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center p-4">
          <div className="flex items-center justify-center gap-2 text-foreground/60 mb-1">
            <Calendar size={16} />
            <span className="text-sm">Total Setoran</span>
          </div>
          <p className="text-2xl font-bold">{totalDeposits}x</p>
        </Card>
        <Card className="text-center p-4">
          <div className="flex items-center justify-center gap-2 text-foreground/60 mb-1">
            <Weight size={16} />
            <span className="text-sm">Total Berat</span>
          </div>
          <p className="text-2xl font-bold">{totalWeight.toFixed(1)} kg</p>
        </Card>
        <Card className="text-center p-4">
          <div className="flex items-center justify-center gap-2 text-foreground/60 mb-1">
            <Coins size={16} />
            <span className="text-sm">Total Poin</span>
          </div>
          <p className="text-2xl font-bold text-primary-600">{totalPoints}</p>
        </Card>
      </div>

      {/* History List */}
      <Card padding="none">
        <CardHeader className="p-4 border-b border-foreground/10">
          <CardTitle>Riwayat Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-foreground/10">
            {history.length === 0 ? (
              <div className="p-8 text-center text-foreground/60">
                Belum ada riwayat setoran. <Link href="/waste" className="text-primary-600">Setor sampah sekarang!</Link>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 hover:bg-foreground/5 transition"
                >
                  <div className="flex items-center gap-4">
                    <WasteBadge type={item.wasteType as 'ORGANIC' | 'PLASTIC' | 'METAL' | 'PAPER'} />
                    <div>
                      <p className="font-medium">{item.amount} kg</p>
                      <p className="text-sm text-foreground/60">
                        {item.scanMethod === 'AI_SCAN' ? '📷 AI Scan' : '✏️ Manual'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">+{item.pointsEarned} pts</p>
                    <p className="text-sm text-foreground/60">{formatDate(item.depositDate)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
