'use client';

import { TreeStageBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Gift, Info, Leaf, Loader2, Sparkles, TreeDeciduous } from 'lucide-react';
import { useEffect, useState } from 'react';

const treeStages = [
  { stage: 'SEED', emoji: '🌰', label: 'Biji', minXp: 0, maxXp: 199, description: 'Awal mula kehidupan baru.' },
  { stage: 'SPROUT', emoji: '🌱', label: 'Kecambah', minXp: 200, maxXp: 399, description: 'Mulai tumbuh mencari cahaya.' },
  { stage: 'SMALL', emoji: '🌿', label: 'Tunas', minXp: 400, maxXp: 599, description: 'Tumbuh kuat dan berdaun.' },
  { stage: 'MEDIUM', emoji: '🌲', label: 'Pohon Muda', minXp: 600, maxXp: 799, description: 'Semakin tinggi dan kokoh.' },
  { stage: 'LARGE', emoji: '🌳', label: 'Pohon Dewasa', minXp: 800, maxXp: Infinity, description: 'Siap memberikan manfaat.' },
];

type TreeStage = 'SEED' | 'SPROUT' | 'SMALL' | 'MEDIUM' | 'LARGE';

interface TreeData {
  ecoXp: number;
  treeStage: TreeStage;
  treesGrown: number;
  canClaim: boolean;
}

export default function TreePage() {
  const [treeData, setTreeData] = useState<TreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        const res = await fetch('/api/eco-tree');
        if (res.ok) {
          const data = await res.json();
          setTreeData(data);
        } else {
          setError('Failed to load tree data');
        }
      } catch (err) {
        setError('Database connection error');
      } finally {
        setLoading(false);
      }
    };
    fetchTreeData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !treeData) {
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

  const currentStage = treeStages.find(
    (s) => treeData.ecoXp >= s.minXp && treeData.ecoXp <= s.maxXp
  ) || treeStages[0];

  const progress = ((treeData.ecoXp % 200) / 200) * 100;
  const canClaim = treeData.ecoXp >= 1000;

  const handleClaim = async () => {
    setIsClaimLoading(true);
    try {
      const res = await fetch('/api/eco-tree/claim', { method: 'POST' });
      
      if (res.ok) {
        setTreeData({
          ...treeData,
          ecoXp: 0,
          treeStage: 'SEED' as TreeStage,
          treesGrown: treeData.treesGrown + 1,
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Claim error:', err);
    } finally {
      setIsClaimLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 text-foreground tracking-tight">
            <div className="p-2 bg-primary-100 rounded-xl">
              <TreeDeciduous className="w-8 h-8 text-primary-600" />
            </div>
            Eco Tree
          </h1>
          <p className="text-foreground/60 mt-2 text-lg">
            Rawat pohon virtualmu dan dapatkan reward nyata! 🌍
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card-static px-4 py-2 flex items-center gap-2">
            <span className="text-2xl">🌳</span>
            <div>
              <p className="text-xs font-medium text-foreground/50 uppercase tracking-wider">Total Pohon</p>
              <p className="text-lg font-bold text-primary-600">{treeData.treesGrown} Ditanam</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-green-800 animate-fade-in flex items-center gap-4 shadow-lg shadow-green-500/10">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h4 className="font-bold text-lg">Selamat! Pohon Berhasil Ditanam! 🎉</h4>
            <p className="text-green-700">Anda mendapatkan +200 poin bonus. Teruslah berkontribusi untuk bumi!</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Tree Card */}
        <Card padding="lg" className="lg:col-span-2 text-center relative overflow-hidden group border-primary-100">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary-50/50 to-transparent -z-10" />
          <CardContent className="pt-12 pb-8">
            {/* Tree Visualization */}
            <div className="relative mb-12">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl -z-10 animate-pulse-slow" />
              <div 
                className={`text-[12rem] leading-none mb-6 transition-all duration-700 transform hover:scale-110 cursor-pointer drop-shadow-2xl ${
                  canClaim ? 'animate-bounce-slow' : ''
                }`}
                style={{ 
                  filter: canClaim ? 'drop-shadow(0 0 30px rgba(16, 185, 129, 0.6))' : 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))'
                }}
              >
                {currentStage.emoji}
              </div>
              <TreeStageBadge stage={treeData.treeStage} className="scale-125 shadow-lg" />
            </div>

            {/* XP Progress */}
            <div className="max-w-lg mx-auto mb-8 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm">
              <div className="flex justify-between items-end mb-3">
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-1">Current Progress</p>
                  <p className="text-2xl font-bold text-primary-700">{treeData.ecoXp} <span className="text-base font-normal text-foreground/40">/ 1000 XP</span></p>
                </div>
                <div className="text-right">
                   {canClaim ? (
                      <span className="inline-flex items-center gap-1 text-green-600 font-bold animate-pulse">
                        <Sparkles size={16} /> Ready!
                      </span>
                   ) : (
                      <span className="text-sm font-medium text-foreground/60">
                        {1000 - treeData.ecoXp} XP lagi menuju panen
                      </span>
                   )}
                </div>
              </div>
              
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
                    canClaim ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-primary-400 to-primary-600'
                  }`}
                  style={{ width: `${(treeData.ecoXp / 1000) * 100}%` }}
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-shimmer" />
                </div>
              </div>
            </div>

            {/* Claim Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                disabled={!canClaim}
                isLoading={isClaimLoading}
                onClick={handleClaim}
                className={`min-w-[200px] h-14 text-lg shadow-xl transition-all duration-300 ${
                  canClaim 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 hover:shadow-green-500/30 animate-pulse-glow' 
                    : 'opacity-80'
                }`}
              >
                {canClaim ? (
                  <>
                    <Gift className="mr-2 h-6 w-6" />
                    Klaim Pohon (+200 pts)
                  </>
                ) : (
                  <>
                    <Leaf className="mr-2 h-5 w-5" />
                    Kumpulkan XP
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Stats Card */}
          <Card padding="lg" className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
            <CardContent>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-amber-800">
                <Sparkles className="w-5 h-5" />
                Statistik Eco
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-amber-100/50">
                  <span className="text-foreground/60">Total Pohon</span>
                  <span className="font-bold text-xl text-foreground">{treeData.treesGrown} 🌳</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-amber-100/50">
                  <span className="text-foreground/60">XP Saat Ini</span>
                  <span className="font-bold text-xl text-amber-600">{treeData.ecoXp} ✨</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-amber-100/50">
                  <span className="text-foreground/60">Tahap</span>
                  <span className="font-bold text-foreground">{currentStage.label}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Growth Stages Info */}
          <Card padding="lg" className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info size={20} className="text-primary-500" />
                Tahap Pertumbuhan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {treeStages.map((stage) => {
                  const isActive = treeData.ecoXp >= stage.minXp;
                  const isCurrent = currentStage.stage === stage.stage;
                  
                  return (
                    <div
                      key={stage.stage}
                      className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                        isCurrent
                          ? 'bg-primary-50 border border-primary-200 shadow-sm scale-105'
                          : isActive
                          ? 'bg-gray-50 opacity-70'
                          : 'opacity-40 grayscale'
                      }`}
                    >
                      <div className="text-3xl w-12 text-center">{stage.emoji}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className={`font-semibold ${isCurrent ? 'text-primary-700' : 'text-foreground'}`}>
                            {stage.label}
                          </p>
                          {isActive && <span className="text-xs font-bold text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full">✓</span>}
                        </div>
                        <p className="text-xs text-foreground/60">{stage.minXp} - {stage.maxXp} XP</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <Card padding="lg" className="overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10" />
        <CardHeader>
          <CardTitle className="text-center text-2xl">Cara Kerja Eco Tree 🌿</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-8 mt-4">
            {[
              { 
                icon: "♻️", 
                title: "Setor Sampah", 
                desc: "Dapatkan Eco XP sebesar 2x poin dari setiap setoran sampah yang Anda lakukan." 
              },
              { 
                icon: "🌱", 
                title: "Kembangkan Pohon", 
                desc: "Pohon akan tumbuh dari biji hingga dewasa seiring Eco XP Anda bertambah." 
              },
              { 
                icon: "🎁", 
                title: "Klaim Bonus", 
                desc: "Klaim pohon dewasa untuk dapat +200 poin bonus dan mulai menanam pohon baru." 
              }
            ].map((step, idx) => (
              <div key={idx} className="text-center group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-20 h-20 rounded-2xl bg-white shadow-lg shadow-primary-500/10 flex items-center justify-center mx-auto mb-6 text-4xl group-hover:scale-110 transition-transform duration-300 border border-primary-100">
                  {step.icon}
                </div>
                <h4 className="font-bold text-lg mb-2 text-foreground">{step.title}</h4>
                <p className="text-sm text-foreground/60 leading-relaxed px-4">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
