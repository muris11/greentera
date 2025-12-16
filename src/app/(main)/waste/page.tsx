'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ArrowRight, Camera, Minus, PenLine, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const wasteTypes = [
  { id: 'ORGANIC', label: 'Organik', emoji: '🟢', points: 5, desc: 'Sisa makanan, daun, bunga' },
  { id: 'PLASTIC', label: 'Plastik', emoji: '🔵', points: 10, desc: 'Botol, tas, wadah' },
  { id: 'METAL', label: 'Logam', emoji: '🟡', points: 15, desc: 'Kaleng, aluminium' },
  { id: 'PAPER', label: 'Kertas', emoji: '🟤', points: 8, desc: 'Kertas, kardus, majalah' },
];

export default function WastePage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [weight, setWeight] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const selectedWaste = wasteTypes.find((w) => w.id === selectedType);
  const estimatedPoints = selectedWaste ? Math.round(weight * selectedWaste.points) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || weight <= 0) return;

    setIsLoading(true);

    try {
      const res = await fetch('/api/waste/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wasteType: selectedType,
          amount: weight,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setEarnedPoints(data.pointsEarned || estimatedPoints);
        setSuccess(true);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedType(null);
    setWeight(1);
    setSuccess(false);
    setEarnedPoints(0);
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto">
        <Card padding="lg" className="text-center">
          <CardContent>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Setoran Berhasil!</h2>
            <p className="text-foreground/60 mb-4">
              Terima kasih telah berkontribusi untuk lingkungan
            </p>
            <div className="p-4 rounded-xl bg-primary-50 mb-6">
              <p className="text-sm text-primary-600">Poin yang didapat</p>
              <p className="text-3xl font-bold text-primary-700">+{earnedPoints} pts</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={resetForm} className="flex-1">
                Setor Lagi
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full">
                  Ke Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">🗑️ Setoran Sampah</h1>
        <p className="text-foreground/60 mt-1">
          Setor sampah dan dapatkan poin untuk setiap kontribusi Anda
        </p>
      </div>

      {/* Method Selection */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/waste/scan">
          <Card className="h-full hover:border-primary-400 transition-colors cursor-pointer group">
            <CardContent className="flex flex-col items-center text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Scan dengan AI</h3>
              <p className="text-sm text-foreground/60 mb-4">
                Gunakan kamera untuk mendeteksi jenis sampah secara otomatis
              </p>
              <span className="text-primary-600 font-medium inline-flex items-center gap-1">
                Mulai Scan <ArrowRight size={16} />
              </span>
            </CardContent>
          </Card>
        </Link>

        <Card className="h-full border-primary-400 bg-primary-50/50">
          <CardContent className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
              <PenLine className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Input Manual</h3>
            <p className="text-sm text-foreground/60 mb-4">
              Pilih jenis sampah dan masukkan berat secara manual
            </p>
            <span className="text-primary-600 font-medium">
              ✓ Sedang Dipilih
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Manual Form */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle>📝 Form Setoran Manual</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Waste Type Selection */}
            <div>
              <label className="input-label">Pilih Jenis Sampah</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {wasteTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      selectedType === type.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-foreground/10 hover:border-primary-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.emoji}</div>
                    <p className="font-medium">{type.label}</p>
                    <p className="text-xs text-foreground/60 mt-1">{type.points} pts/kg</p>
                  </button>
                ))}
              </div>
              {selectedType && (
                <p className="mt-2 text-sm text-foreground/60">
                  {selectedWaste?.desc}
                </p>
              )}
            </div>

            {/* Weight Input */}
            <div>
              <label className="input-label">Berat (kg)</label>
              <div className="flex items-center gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setWeight(Math.max(0.1, weight - 0.5))}
                  className="w-12 h-12 rounded-xl bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition"
                >
                  <Minus size={20} />
                </button>
                <div className="flex-1">
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Math.max(0.1, parseFloat(e.target.value) || 0))}
                    min="0.1"
                    step="0.1"
                    className="text-center text-xl font-bold"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setWeight(weight + 0.5)}
                  className="w-12 h-12 rounded-xl bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Estimated Points */}
            {selectedType && (
              <div className="p-4 rounded-xl bg-primary-50 border border-primary-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary-600">Estimasi Poin</p>
                    <p className="text-2xl font-bold text-primary-700">
                      +{estimatedPoints} pts
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-primary-600">Eco XP</p>
                    <p className="text-lg font-semibold text-primary-700">
                      +{estimatedPoints * 2}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={!selectedType || weight <= 0}
              isLoading={isLoading}
            >
              ✓ Setor Sampah
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
