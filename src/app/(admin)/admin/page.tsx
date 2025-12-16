'use client';

import { StatsCard } from '@/components/admin/StatsCard';
import { Calendar, Loader2, Trash2, TreeDeciduous, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DashboardStats {
  overview: {
    totalUsers: number;
    totalDeposits: number;
    totalWaste: number;
    totalPoints: number;
    totalVouchers: number;
    todayDeposits: number;
  };
  wasteByType: Array<{
    wasteType: string;
    _sum: { amount: number };
    _count: { id: number };
  }>;
  usersByLevel: Array<{
    level: string;
    _count: { id: number };
  }>;
  recentDeposits: Array<{
    id: string;
    user: { name: string };
    wasteType: string;
    amount: number;
    pointsEarned: number;
    depositDate: string;
  }>;
}

const wasteTypeColors: Record<string, string> = {
  PLASTIC: 'bg-blue-500',
  PAPER: 'bg-amber-500',
  ORGANIC: 'bg-green-500',
  METAL: 'bg-slate-400',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          setError('Failed to load stats. Database not configured.');
        }
      } catch (err) {
        setError('Database connection error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-foreground/60 mb-4">{error || 'No data available'}</p>
          <p className="text-sm text-foreground/40">Run `npm run db:push` and `npm run db:seed` to setup database</p>
        </div>
      </div>
    );
  }

  const formatRelativeTime = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    return `${Math.floor(hours / 24)} hari lalu`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-foreground/60 mt-1">Monitor aktivitas dan statistik aplikasi</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-xl border border-black/10">
          <Calendar className="w-4 h-4 text-foreground/60" />
          <span className="text-sm text-foreground/60">
            {new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={stats.overview.totalUsers}
          icon={Users}
          color="emerald"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Deposits"
          value={stats.overview.totalDeposits}
          icon={Trash2}
          color="blue"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total Waste (kg)"
          value={stats.overview.totalWaste.toFixed(1)}
          icon={TrendingUp}
          color="amber"
        />
        <StatsCard
          title="Trees Planted"
          value={Math.floor(stats.overview.totalPoints / 1000)}
          icon={TreeDeciduous}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Waste by Type */}
        <div className="bg-white/60 border border-black/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Waste by Type</h3>
          <div className="space-y-4">
            {stats.wasteByType.length === 0 ? (
              <p className="text-foreground/40 text-center py-4">No data yet</p>
            ) : (
              stats.wasteByType.map((item) => {
                const total = stats.wasteByType.reduce((acc, i) => acc + (i._sum.amount || 0), 0);
                const percentage = total > 0 ? ((item._sum.amount || 0) / total) * 100 : 0;
                
                return (
                  <div key={item.wasteType}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground/80">{item.wasteType}</span>
                      <span className="text-foreground/60">{(item._sum.amount || 0).toFixed(1)} kg ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${wasteTypeColors[item.wasteType] || 'bg-gray-500'} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Users by Level */}
        <div className="bg-white/60 border border-black/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Users by Level</h3>
          <div className="flex items-end justify-around h-48">
            {stats.usersByLevel.length === 0 ? (
              <p className="text-foreground/40 text-center py-4">No users yet</p>
            ) : (
              stats.usersByLevel.map((item) => {
                const maxCount = Math.max(...stats.usersByLevel.map(u => u._count.id));
                const height = maxCount > 0 ? (item._count.id / maxCount) * 100 : 0;
                
                const levelColors: Record<string, string> = {
                  BRONZE: 'from-amber-700 to-amber-600',
                  SILVER: 'from-slate-400 to-slate-300',
                  GOLD: 'from-yellow-500 to-amber-400',
                };
                
                return (
                  <div key={item.level} className="flex flex-col items-center gap-2">
                    <span className="text-foreground font-semibold">{item._count.id}</span>
                    <div
                      className={`w-16 bg-gradient-to-t ${levelColors[item.level] || 'from-gray-500 to-gray-400'} rounded-t-lg transition-all duration-500`}
                      style={{ height: `${height}%`, minHeight: '20px' }}
                    />
                    <span className="text-sm text-foreground/60">{item.level}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/60 border border-black/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-black/10">
          <h3 className="text-lg font-semibold text-foreground">Recent Deposits</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/60">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {(!stats.recentDeposits || stats.recentDeposits.length === 0) ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-foreground/40">
                    No deposits yet
                  </td>
                </tr>
              ) : (
                stats.recentDeposits.map((deposit) => (
                  <tr key={deposit.id} className="hover:bg-white/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-foreground font-medium">{deposit.user?.name || 'Unknown'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg ${
                        deposit.wasteType === 'PLASTIC' ? 'bg-blue-500/20 text-blue-400' :
                        deposit.wasteType === 'PAPER' ? 'bg-amber-500/20 text-amber-400' :
                        deposit.wasteType === 'ORGANIC' ? 'bg-green-500/20 text-green-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {deposit.wasteType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-foreground/80">{deposit.amount} kg</td>
                    <td className="px-6 py-4 whitespace-nowrap text-emerald-400 font-medium">+{deposit.pointsEarned}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-foreground/60">{formatRelativeTime(deposit.depositDate)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
