'use client';

import { LevelBadge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Filter, Loader2, Medal, Search, Trophy } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  level: string;
  totalWaste: number;
  image: string | null;
}

const periodsConfig = [
  { id: 'weekly', label: 'Minggu Ini' },
  { id: 'monthly', label: 'Bulan Ini' },
  { id: 'all', label: 'Semua Waktu' },
];

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const currentUserId = session?.user?.id;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/leaderboard?period=${period}&limit=50`);
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data.leaderboard || []);
        } else {
          setError('Failed to load leaderboard');
        }
      } catch (err) {
        setError('Database connection error');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [period]);

  const filteredLeaderboard = leaderboard.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const myRank = leaderboard.findIndex(u => u.id === currentUserId) + 1;
  const myData = leaderboard.find(u => u.id === currentUserId);

  if (loading && leaderboard.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-foreground/60">{error}</p>
      </div>
    );
  }

  const top3 = filteredLeaderboard.slice(0, 3);
  const rest = filteredLeaderboard.slice(3);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 text-foreground tracking-tight">
            <div className="p-2 bg-amber-100 rounded-xl">
              <Trophy className="w-8 h-8 text-amber-600" />
            </div>
            Leaderboard
          </h1>
          <p className="text-foreground/60 mt-2 text-lg">
            Peringkat pahlawan lingkungan terbaik 🏆
          </p>
        </div>
        
        <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-xl border border-white/20 shadow-sm">
          {periodsConfig.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                period === p.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-foreground/60 hover:text-foreground hover:bg-white/50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* My Rank Card */}
      {myData && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-teal-600 text-white shadow-lg shadow-primary-500/20 p-6 animate-fade-in">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative flex items-center justify-between z-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-2xl border-2 border-white/30">
                #{myRank || '?'}
              </div>
              <div>
                <p className="text-sm text-white/80 font-medium mb-1">Peringkat Anda</p>
                <p className="font-bold text-xl">{myData.name || session?.user?.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm bg-white/20 px-2 py-0.5 rounded text-white/90">
                    {myData.points.toLocaleString()} pts
                  </span>
                  <span className="text-sm text-white/70">•</span>
                  <span className="text-sm text-white/80">{myData.totalWaste.toFixed(1)} kg sampah</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block text-right">
              <LevelBadge level={(myData.level || 'BRONZE') as any} className="scale-110" />
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      {top3.length > 0 && (
        <div className="grid grid-cols-3 gap-4 items-end mb-8 pt-8">
          {/* #2 */}
          <div className="order-1 animate-fade-in-up delay-100">
            <div className="relative flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-slate-300 shadow-xl overflow-hidden mb-[-20px] z-10 bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400">
                {top3[1]?.image ? (
                  <img src={top3[1].image} alt={top3[1].name} className="w-full h-full object-cover" />
                ) : (
                  top3[1]?.name?.charAt(0) || '?'
                )}
              </div>
              <div className="w-full bg-gradient-to-b from-slate-50 to-white glass-card-static pt-10 pb-6 px-2 rounded-t-2xl border-t-4 border-slate-300 text-center shadow-lg">
                <Medal className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="font-bold text-foreground truncate px-2">{top3[1]?.name || '-'}</p>
                <p className="text-sm text-primary-600 font-bold mt-1">{top3[1]?.points?.toLocaleString() || 0} pts</p>
                <div className="mt-3 flex justify-center">
                   <LevelBadge level={(top3[1]?.level || 'BRONZE') as any} />
                </div>
              </div>
            </div>
          </div>

          {/* #1 */}
          <div className="order-0 md:order-1 animate-fade-in-up">
            <div className="relative flex flex-col items-center">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-5xl animate-bounce-slow">👑</div>
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-amber-400 shadow-2xl overflow-hidden mb-[-30px] z-10 bg-amber-100 flex items-center justify-center text-4xl font-bold text-amber-600">
                 {top3[0]?.image ? (
                  <img src={top3[0].image} alt={top3[0].name} className="w-full h-full object-cover" />
                ) : (
                  top3[0]?.name?.charAt(0) || '?'
                )}
              </div>
              <div className="w-full bg-gradient-to-b from-amber-50 to-white glass-card-static pt-12 pb-8 px-2 rounded-t-2xl border-t-4 border-amber-400 text-center shadow-xl z-0 relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-amber-400/10 to-transparent opacity-50" />
                <p className="font-bold text-lg text-foreground truncate px-2 relative z-10">{top3[0]?.name || '-'}</p>
                <p className="text-base text-amber-600 font-bold mt-1 relative z-10">{top3[0]?.points?.toLocaleString() || 0} pts</p>
                <div className="mt-3 flex justify-center relative z-10">
                   <LevelBadge level={(top3[0]?.level || 'GOLD') as any} />
                </div>
              </div>
            </div>
          </div>

          {/* #3 */}
          <div className="order-2 animate-fade-in-up delay-200">
            <div className="relative flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-amber-700 shadow-xl overflow-hidden mb-[-20px] z-10 bg-amber-100 flex items-center justify-center text-3xl font-bold text-amber-800">
                {top3[2]?.image ? (
                  <img src={top3[2].image} alt={top3[2].name} className="w-full h-full object-cover" />
                ) : (
                  top3[2]?.name?.charAt(0) || '?'
                )}
              </div>
              <div className="w-full bg-gradient-to-b from-orange-50 to-white glass-card-static pt-10 pb-6 px-2 rounded-t-2xl border-t-4 border-amber-700 text-center shadow-lg">
                <Medal className="w-8 h-8 mx-auto text-amber-700 mb-2" />
                <p className="font-bold text-foreground truncate px-2">{top3[2]?.name || '-'}</p>
                <p className="text-sm text-primary-600 font-bold mt-1">{top3[2]?.points?.toLocaleString() || 0} pts</p>
                <div className="mt-3 flex justify-center">
                   <LevelBadge level={(top3[2]?.level || 'BRONZE') as any} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Full Rankings */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Filter size={18} className="text-primary-500" />
            Peringkat Lengkap
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
            <input 
              type="text" 
              placeholder="Cari pengguna..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border/50 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm transition-all"
            />
          </div>
        </div>
        
        <div className="divide-y divide-border/40">
          {rest.length === 0 ? (
            <div className="p-8 text-center text-foreground/50">
              Tidak ada pengguna ditemukan
            </div>
          ) : (
            rest.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-4 hover:bg-primary-50/30 transition-colors duration-200 ${
                  user.id === currentUserId ? 'bg-primary-50/50' : ''
                }`}
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-8 text-center font-bold text-foreground/50">
                    #{index + 4}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-foreground/70 font-bold shadow-sm border border-white">
                      {user.image ? (
                        <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.name?.charAt(0).toUpperCase() || '?'
                      )}
                    </div>
                    <div>
                      <p className={`font-semibold ${user.id === currentUserId ? 'text-primary-700' : 'text-foreground'}`}>
                        {user.name}
                        {user.id === currentUserId && <span className="ml-2 text-xs bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded font-bold">YOU</span>}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <LevelBadge level={user.level as any} />
                        <span className="text-xs text-foreground/40">• {user.totalWaste.toFixed(1)} kg</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">{user.points.toLocaleString()}</p>
                  <p className="text-xs text-foreground/50 font-medium">POIN</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
