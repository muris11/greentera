'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CheckCircle2, HelpCircle, Loader2, Trophy, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Quiz {
  id: string;
  question: string;
  options: string[];
  pointsReward: number;
  category: string;
}

export default function QuizPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<{ correct: boolean; pointsEarned: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchQuiz = async () => {
    setLoading(true);
    setResult(null);
    setSelectedOption(null);
    setError(null);
    
    try {
      const res = await fetch('/api/education/quiz?limit=1');
      if (res.ok) {
        const data = await res.json();
        // API returns { quizzes: Quiz[], totalAvailable: number }
        if (data.quizzes && data.quizzes.length > 0) {
          setQuiz(data.quizzes[0]);
        } else {
          setError('Tidak ada kuis tersedia. Anda mungkin sudah menjawab semua kuis.');
        }
      } else {
        if (res.status === 404) {
          setError('Tidak ada kuis tersedia saat ini.');
        } else {
          setError('Gagal memuat kuis.');
        }
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  const handleSubmit = async () => {
    if (!quiz || selectedOption === null) return;
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/education/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz.id,
          answer: quiz.options[selectedOption],
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setResult({
          correct: data.isCorrect,
          pointsEarned: data.pointsEarned,
        });
      } else {
        alert(data.error || 'Gagal mengirim jawaban');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Terjadi kesalahan saat mengirim jawaban');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mb-6">
          <HelpCircle className="w-10 h-10 text-foreground/40" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Belum Ada Kuis</h2>
        <p className="text-foreground/60 mb-6">
          {error || 'Saat ini belum ada kuis yang tersedia. Silakan cek kembali nanti!'}
        </p>
        <Link href="/education">
          <Button variant="secondary">Kembali ke Edukasi</Button>
        </Link>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-md mx-auto pt-10">
        <Card className={`text-center overflow-hidden ${result.correct ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
          <CardContent className="pt-10 pb-8">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${result.correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {result.correct ? <Trophy size={48} /> : <XCircle size={48} />}
            </div>
            
            <h2 className={`text-2xl font-bold mb-2 ${result.correct ? 'text-green-800' : 'text-red-800'}`}>
              {result.correct ? 'Jawaban Benar!' : 'Jawaban Salah'}
            </h2>
            
            <p className="text-foreground/60 mb-6">
              {result.correct 
                ? `Selamat! Kamu mendapatkan +${result.pointsEarned} poin.` 
                : 'Jangan menyerah, coba lagi di kuis berikutnya!'}
            </p>

            <div className="flex gap-3 justify-center">
              <Link href="/education">
                <Button variant="secondary">Selesai</Button>
              </Link>
              <Button onClick={fetchQuiz}>Coba Kuis Lain</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <HelpCircle className="text-primary-500" />
          Kuis Harian
        </h1>
        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
          +{quiz.pointsReward} Poin
        </span>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <CardTitle className="text-xl leading-relaxed">
              {quiz.question}
            </CardTitle>
            <span className="text-xs font-medium px-2 py-1 bg-foreground/5 rounded text-foreground/60 whitespace-nowrap">
              {quiz.category}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {quiz.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between group ${
                  selectedOption === index
                    ? 'border-primary-500 bg-primary-50 text-primary-900'
                    : 'border-foreground/10 hover:border-primary-200 hover:bg-foreground/5'
                }`}
              >
                <span className="font-medium">{option}</span>
                {selectedOption === index && (
                  <CheckCircle2 className="text-primary-600 w-5 h-5" />
                )}
              </button>
            ))}
          </div>

          <div className="pt-4">
            <Button 
              className="w-full" 
              size="lg"
              disabled={selectedOption === null || submitting}
              isLoading={submitting}
              onClick={handleSubmit}
            >
              Kirim Jawaban
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
