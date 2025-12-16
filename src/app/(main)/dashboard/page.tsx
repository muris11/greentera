'use client';

import { LevelBadge, TreeStageBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
    ArrowRight,
    Calendar,
    Coins,
    Flame,
    Leaf,
    Loader2,
    Scale,
    Ticket,
    TreeDeciduous,
    TrendingUp,
    Trophy
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DashboardData {
  user: {
    id: string;
    name: string;
    points: number;
    level: string;
    totalWaste: number;
    treesGrown: number;
    streak: number;
    ecoXp: number;
    treeStage: string;
  };
  recentDeposits: Array<{
    id: string;
    wasteType: string;
    amount: number;
    pointsEarned: number;
    depositDate: string;
  }>;
  monthlyStats: {
    deposits: number;
    points: number;
  };
  voucherCount: number;
}

const wasteTypeConfig: Record<string, { emoji: string; label: string; color: string }> = {
  ORGANIC: { emoji: '🟢', label: 'Organik', color: 'text-green-600 bg-green-100' },
  PLASTIC: { emoji: '🔵', label: 'Plastik', color: 'text-blue-600 bg-blue-100' },
  METAL: { emoji: '🟡', label: 'Logam', color: 'text-amber-600 bg-amber-100' },
  PAPER: { emoji: '🟤', label: 'Kertas', color: 'text-brown-600 bg-orange-100' },
};

const treeEmoji: Record<string, string> = {
  SEED: '🌰',
  SPROUT: '🌱',
  SMALL: '🌿',
  MEDIUM: '🌲',
  LARGE: '🌳',
};

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Baru saja';
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return '1 hari lalu';
  return `${diffDays} hari lalu`;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const result = await res.json();
          setData(result);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err) {
        setError('Database connection error');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center glass-card p-8">
          <p className="text-foreground/60 mb-4">{error || 'No data available'}</p>
          <Button onClick={() => window.location.reload()} variant="secondary">
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  const userName = session?.user?.name || data.user.name;
  const userLevel = data.user.level as 'BRONZE' | 'SILVER' | 'GOLD';
  const treeStage = data.user.treeStage as keyof typeof treeEmoji;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Selamat Datang, <span className="text-gradient">{userName}</span>! 👋
          </h1>
          <p className="text-foreground/60 mt-2 text-lg">
            Siap untuk membuat dampak positif hari ini?
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card-static px-4 py-2 flex items-center gap-2">
             <LevelBadge level={userLevel} />
          </div>
          <div className="glass-card-static px-4 py-2 flex items-center gap-2 text-orange-500 font-bold">
            <Flame size={20} className="fill-orange-500" />
            <span>{data.user.streak} Hari Streak</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in-up delay-100">
        <Card className="hover:scale-105 transition-transform duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/60">Total Poin</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-2">
                  {data.user.points.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Coins className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-transform duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/60">Level</p>
                <div className="mt-2">
                  <LevelBadge level={userLevel} />
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-transform duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/60">Total Sampah</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-2">
                  {data.user.totalWaste} <span className="text-lg font-normal text-foreground/50">kg</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Scale className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-transform duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/60">Pohon Ditanam</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-2">
                  {data.user.treesGrown}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                <TreeDeciduous className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8 animate-fade-in-up delay-200">
        {/* Eco Tree Card */}
        <Card className="lg:col-span-1 h-full relative overflow-hidden group" padding="lg">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-green-500" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Leaf className="w-5 h-5 text-primary-500" />
              Eco Tree
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center">
              <div className={`text-8xl mb-6 transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl`}>
                {treeEmoji[treeStage] || '🌰'}
              </div>
              <TreeStageBadge stage={treeStage as any} className="mb-6 scale-110" />
              
              <div className="w-full bg-white/50 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                <div className="flex justify-between text-sm font-medium text-foreground/70 mb-2">
                  <span>Progress Level</span>
                  <span>{data.user.ecoXp}/1000 XP</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-400 to-green-500 transition-all duration-1000 ease-out"
                    style={{ width: `${(data.user.ecoXp / 1000) * 100}%` }}
                  />
                </div>
              </div>

              {data.user.ecoXp >= 1000 && (
                <Link href="/tree" className="w-full mt-6">
                  <Button className="w-full animate-pulse-glow shadow-lg shadow-primary-500/30">
                    🎁 Klaim Pohon (+200 pts)
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 h-full" padding="lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                Setoran Terakhir
              </CardTitle>
              <Link 
                href="/waste/history"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 group"
              >
                Lihat Semua
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentDeposits.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Scale className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-foreground/60 mb-4">Belum ada setoran sampah.</p>
                  <Link href="/waste">
                    <Button variant="primary">Mulai Setor Sampah</Button>
                  </Link>
                </div>
              ) : (
                data.recentDeposits.map((deposit) => {
                  const config = wasteTypeConfig[deposit.wasteType] || { emoji: '♻️', label: deposit.wasteType, color: 'bg-gray-100 text-gray-600' };
                  return (
                    <div 
                      key={deposit.id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-white/40 hover:bg-white/60 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${config.color.replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 ')}`}>
                          {config.emoji}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{config.label}</p>
                          <p className="text-sm text-foreground/60">{deposit.amount} kg</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-bold mb-1">
                          +{deposit.pointsEarned} pts
                        </div>
                        <p className="text-xs text-foreground/40 font-medium">{formatRelativeDate(deposit.depositDate)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 animate-fade-in-up delay-300">
        <Card className="flex items-center gap-4 p-5 hover:bg-white/60 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center shadow-sm">
            <Calendar className="w-7 h-7 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/60">Setoran Bulan Ini</p>
            <p className="text-2xl font-bold text-foreground">{data.monthlyStats.deposits}x</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5 hover:bg-white/60 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center shadow-sm">
            <TrendingUp className="w-7 h-7 text-teal-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/60">Poin Bulan Ini</p>
            <p className="text-2xl font-bold text-foreground">+{data.monthlyStats.points}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5 hover:bg-white/60 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center shadow-sm">
            <Ticket className="w-7 h-7 text-pink-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/60">Voucher Tersedia</p>
            <p className="text-2xl font-bold text-foreground">{data.voucherCount}</p>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in-up delay-300">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          ⚡ Aksi Cepat
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/waste" className="block group">
            <div className="glass-card p-6 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-300 border-primary-200/50 hover:border-primary-500/50">
              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-300 shadow-lg shadow-primary-500/20">
                <Trash2 className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <span className="font-semibold text-foreground group-hover:text-primary-600 transition-colors">Setor Sampah</span>
            </div>
          </Link>
          
          <Link href="/waste/scan" className="block group">
            <div className="glass-card p-6 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-300 border-blue-200/50 hover:border-blue-500/50">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300 shadow-lg shadow-blue-500/20">
                <Camera className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <span className="font-semibold text-foreground group-hover:text-blue-600 transition-colors">Scan AI</span>
            </div>
          </Link>

          <Link href="/voucher" className="block group">
            <div className="glass-card p-6 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-300 border-amber-200/50 hover:border-amber-500/50">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-500 transition-colors duration-300 shadow-lg shadow-amber-500/20">
                <Ticket className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors" />
              </div>
              <span className="font-semibold text-foreground group-hover:text-amber-600 transition-colors">Tukar Voucher</span>
            </div>
          </Link>

          <Link href="/education" className="block group">
            <div className="glass-card p-6 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-300 border-purple-200/50 hover:border-purple-500/50">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-500 transition-colors duration-300 shadow-lg shadow-purple-500/20">
                <BookOpen className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <span className="font-semibold text-foreground group-hover:text-purple-600 transition-colors">Kuis Edukasi</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Helper icons needed for the new design
import { BookOpen, Camera, Trash2 } from 'lucide-react';

