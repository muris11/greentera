'use client';

import { Download, Filter, Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Deposit {
  id: string;
  user: { name: string; email: string };
  wasteType: string;
  amount: number;
  pointsEarned: number;
  scanMethod: string;
  depositDate: string;
}

interface Stats {
  totalDeposits: number;
  totalWeight: number;
  totalPoints: number;
}

const wasteTypeColors: Record<string, string> = {
  PLASTIC: 'bg-blue-500/20 text-blue-400',
  PAPER: 'bg-amber-500/20 text-amber-400',
  ORGANIC: 'bg-green-500/20 text-green-400',
  METAL: 'bg-slate-500/20 text-slate-400',
};

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [stats, setStats] = useState<Stats>({ totalDeposits: 0, totalWeight: 0, totalPoints: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchDeposits = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filterType !== 'all') params.append('wasteType', filterType);
        
        const res = await fetch(`/api/admin/deposits?${params}`);
        if (res.ok) {
          const data = await res.json();
          setDeposits(data.deposits || []);
          setStats(data.stats || { totalDeposits: 0, totalWeight: 0, totalPoints: 0 });
        }
      } catch (error) {
        console.error('Fetch deposits error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeposits();
  }, [filterType]);

  const filteredDeposits = deposits.filter(d => 
    d.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.user?.email?.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Waste Deposits</h1>
          <p className="text-foreground/60 mt-1">Semua setoran sampah pengguna</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/60 border border-black/10 rounded-xl p-4">
          <p className="text-foreground/60 text-sm">Total Deposits</p>
          <p className="text-2xl font-bold text-foreground">{stats.totalDeposits}</p>
        </div>
        <div className="bg-white/60 border border-black/10 rounded-xl p-4">
          <p className="text-foreground/60 text-sm">Total Weight</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.totalWeight.toFixed(1)} kg</p>
        </div>
        <div className="bg-white/60 border border-black/10 rounded-xl p-4">
          <p className="text-foreground/60 text-sm">Total Points Earned</p>
          <p className="text-2xl font-bold text-amber-400">{stats.totalPoints.toLocaleString()}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/60 border border-black/10 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-foreground/60" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-white/60 border border-black/10 rounded-xl text-foreground focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">All Types</option>
            <option value="PLASTIC">Plastic</option>
            <option value="PAPER">Paper</option>
            <option value="ORGANIC">Organic</option>
            <option value="METAL">Metal</option>
          </select>
        </div>
      </div>

      {/* Deposits Table */}
      <div className="bg-white/60 border border-black/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/60">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Points</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-foreground/60">
                    No deposits found
                  </td>
                </tr>
              ) : (
                filteredDeposits.map((deposit) => (
                  <tr key={deposit.id} className="hover:bg-white/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-foreground">{deposit.user?.name}</p>
                        <p className="text-sm text-foreground/60">{deposit.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-lg ${wasteTypeColors[deposit.wasteType] || 'bg-gray-500/20 text-gray-400'}`}>
                        {deposit.wasteType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-foreground/80">{deposit.amount} kg</td>
                    <td className="px-6 py-4 whitespace-nowrap text-emerald-400 font-semibold">+{deposit.pointsEarned}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs ${deposit.scanMethod === 'AI_SCAN' ? 'text-purple-400' : 'text-foreground/60'}`}>
                        {deposit.scanMethod === 'AI_SCAN' ? '🤖 AI Scan' : '✏️ Manual'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-foreground/60">
                      {new Date(deposit.depositDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
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
