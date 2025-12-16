'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowRight, BookOpen, HelpCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
}

interface QuizStats {
  availableQuizzes: number;
  totalAnswered: number;
  correctAnswers: number;
  pointsEarned: number;
}

export default function EducationPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [quizStats, setQuizStats] = useState<QuizStats>({
    availableQuizzes: 0,
    totalAnswered: 0,
    correctAnswers: 0,
    pointsEarned: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch articles
        const articlesRes = await fetch('/api/education/articles');
        if (articlesRes.ok) {
          const data = await articlesRes.json();
          setArticles(data.articles || []);
        }

        // Fetch quiz stats
        const quizRes = await fetch('/api/education/quiz');
        if (quizRes.ok) {
          const data = await quizRes.json();
          if (data.quizzes) {
            setQuizStats(prev => ({
              ...prev,
              availableQuizzes: data.quizzes.length,
            }));
          }
          if (data.stats) {
            setQuizStats(data.stats);
          }
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary-500" />
          Edukasi Lingkungan
        </h1>
        <p className="text-foreground/60 mt-1">
          Pelajari tentang daur ulang dan lingkungan, dapatkan poin!
        </p>
      </div>

      {/* Quiz Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6">
          <div className="w-20 h-20 rounded-2xl bg-purple-100 flex items-center justify-center">
            <HelpCircle className="w-10 h-10 text-purple-600" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-purple-900">Kuis Edukasi</h2>
            <p className="text-purple-700/80 mt-1">
              Jawab kuis dan dapatkan poin! {quizStats.availableQuizzes > 0 ? `${quizStats.availableQuizzes} kuis tersedia` : 'Segera hadir'}
            </p>
          </div>
          <Link href="/education/quiz">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Mulai Kuis <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quiz Stats */}
      {quizStats.totalAnswered > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <p className="text-sm text-foreground/60">Total Dijawab</p>
            <p className="text-2xl font-bold">{quizStats.totalAnswered}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-foreground/60">Benar</p>
            <p className="text-2xl font-bold text-green-700">{quizStats.correctAnswers}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-foreground/60">Poin Didapat</p>
            <p className="text-2xl font-bold text-primary-700">{quizStats.pointsEarned}</p>
          </Card>
          <Card className="p-4 text-center bg-primary-50">
            <p className="text-sm text-primary-600">Akurasi</p>
            <p className="text-2xl font-bold text-primary-700">
              {quizStats.totalAnswered > 0 
                ? Math.round((quizStats.correctAnswers / quizStats.totalAnswered) * 100) 
                : 0}%
            </p>
          </Card>
        </div>
      )}

      {/* Articles Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} />
            Artikel Edukasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {articles.length === 0 ? (
            <div className="text-center py-12 text-foreground/60">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada artikel. Admin dapat menambah artikel dari panel admin.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article) => (
                <Link key={article.id} href={`/education/${article.id}`}>
                  <Card className="h-full hover:border-primary-400 transition-colors cursor-pointer group">
                    <CardContent className="p-4">
                      {article.imageUrl && (
                        <div className="h-32 rounded-xl bg-foreground/5 mb-4 overflow-hidden">
                          <img 
                            src={article.imageUrl} 
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                      )}
                      <span className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-full">
                        {article.category}
                      </span>
                      <h3 className="font-semibold mt-2 group-hover:text-primary-600 transition">
                        {article.title}
                      </h3>
                      <p className="text-sm text-foreground/60 mt-1 line-clamp-2">
                        {article.content.substring(0, 100)}...
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
