'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowLeft, Camera, Check, Loader2, RefreshCw, RotateCcw, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

const wasteTypeMapping: Record<string, { type: string; label: string; emoji: string; points: number }> = {
  ORGANIC: { type: 'ORGANIC', label: 'Organik', emoji: '🟢', points: 5 },
  PLASTIC: { type: 'PLASTIC', label: 'Plastik', emoji: '🔵', points: 10 },
  METAL: { type: 'METAL', label: 'Logam', emoji: '🟡', points: 15 },
  PAPER: { type: 'PAPER', label: 'Kertas', emoji: '🟤', points: 8 },
};

export default function WasteScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [result, setResult] = useState<{
    type: string;
    label: string;
    emoji: string;
    points: number;
    weight: number;
    confidence: number;
  } | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const startCamera = useCallback(async (mode: 'user' | 'environment' = facingMode) => {
    try {
      setError('');
      // Stop existing stream first
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
      });
      setStream(mediaStream);
      setIsScanning(true);
      setFacingMode(mode);
    } catch (err) {
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.');
      console.error('Camera error:', err);
    }
  }, [facingMode, stream]);

  const switchCamera = useCallback(async () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    await startCamera(newMode);
  }, [facingMode, startCamera]);

  // Callback ref to bind stream when video element is mounted
  const videoCallbackRef = useCallback((videoElement: HTMLVideoElement | null) => {
    if (videoElement && stream) {
      videoElement.srcObject = stream;
      videoElement.onloadedmetadata = () => {
        videoElement.play().catch(console.error);
      };
    }
  }, [stream]);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  }, [stream]);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);

    setIsAnalyzing(true);
    stopCamera();

    try {
      // Call Gemini API for analysis
      const res = await fetch('/api/waste/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await res.json();

      if (res.ok && data.wasteType) {
        const wasteInfo = wasteTypeMapping[data.wasteType] || wasteTypeMapping.ORGANIC;
        setResult({
          ...wasteInfo,
          weight: data.estimatedWeight || Math.round((Math.random() * 2 + 0.5) * 10) / 10,
          confidence: data.confidence || 85,
        });
      } else {
        throw new Error(data.error || 'Gagal menganalisis gambar');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menganalisis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const confirmDeposit = async () => {
    if (!result) return;

    try {
      setIsAnalyzing(true);
      const res = await fetch('/api/waste/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wasteType: result.type,
          amount: result.weight,
          scanMethod: 'AI_SCAN',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setEarnedPoints(data.pointsEarned || Math.round(result.weight * result.points));
        setSuccess(true);
      }
    } catch (err) {
      setError('Gagal menyimpan setoran');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScan = () => {
    setResult(null);
    setError('');
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
              AI berhasil mendeteksi dan mencatat sampah Anda
            </p>
            <div className="p-4 rounded-xl bg-primary-50 mb-6">
              <p className="text-sm text-primary-600">Poin yang didapat</p>
              <p className="text-3xl font-bold text-primary-700">+{earnedPoints} pts</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={resetScan} className="flex-1">
                Scan Lagi
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full">Ke Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
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
          <h1 className="text-2xl font-bold">📷 Scan Sampah dengan AI</h1>
          <p className="text-foreground/60 mt-1">
            Arahkan kamera ke sampah untuk deteksi otomatis menggunakan Gemini AI
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
          {error}
        </div>
      )}

      {/* Camera View */}
      <Card padding="none" className="overflow-hidden">
        <div className="relative aspect-[4/3] bg-black">
          {isScanning ? (
            <>
              <video
                ref={(el) => {
                  videoRef.current = el;
                  videoCallbackRef(el);
                }}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-primary-400 rounded-2xl animate-pulse" />
              </div>
            </>
          ) : result ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-primary-900 to-primary-700">
              <div className="text-center text-white">
                <div className="text-8xl mb-4">{result.emoji}</div>
                <h3 className="text-2xl font-bold">{result.label}</h3>
                <p className="text-white/80 mt-2">
                  Kepercayaan: {result.confidence}%
                </p>
              </div>
            </div>
          ) : isAnalyzing ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-primary-900">
              <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
              <p className="text-white">Gemini AI sedang menganalisis...</p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-foreground/5">
              <Camera className="w-16 h-16 text-foreground/30 mb-4" />
              <p className="text-foreground/60">Kamera belum aktif</p>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </Card>

      {/* Actions */}
      <div className="space-y-4">
        {!isScanning && !result && !isAnalyzing && (
          <Button onClick={() => startCamera()} className="w-full" size="lg">
            <Camera size={20} />
            Mulai Kamera
          </Button>
        )}

        {isScanning && (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={stopCamera} className="flex-shrink-0">
              <X size={20} />
            </Button>
            <Button variant="secondary" onClick={switchCamera} className="flex-shrink-0">
              <RefreshCw size={20} />
            </Button>
            <Button onClick={captureAndAnalyze} className="flex-1">
              <Camera size={20} />
              Capture & Analisis
            </Button>
          </div>
        )}

        {result && (
          <>
            {/* Result Details */}
            <Card padding="md">
              <CardHeader>
                <CardTitle>Hasil Deteksi AI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-foreground/5">
                    <p className="text-sm text-foreground/60">Jenis Sampah</p>
                    <p className="font-semibold flex items-center gap-2">
                      {result.emoji} {result.label}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-foreground/5">
                    <p className="text-sm text-foreground/60">Estimasi Berat</p>
                    <p className="font-semibold">{result.weight} kg</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary-50">
                    <p className="text-sm text-primary-600">Estimasi Poin</p>
                    <p className="font-bold text-primary-700">
                      +{Math.round(result.weight * result.points)} pts
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50">
                    <p className="text-sm text-green-600">Eco XP</p>
                    <p className="font-bold text-green-700">
                      +{Math.round(result.weight * result.points * 2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Confirm/Retry Buttons */}
            <div className="flex gap-3">
              <Button variant="secondary" onClick={resetScan} className="flex-1">
                <RotateCcw size={18} />
                Scan Ulang
              </Button>
              <Button onClick={confirmDeposit} className="flex-1" isLoading={isAnalyzing}>
                <Check size={18} />
                Konfirmasi
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
