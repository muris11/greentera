'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowLeft, Calendar, Loader2, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
  author?: string;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/education/articles/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setArticle(data);
        } else {
          setError('Artikel tidak ditemukan');
        }
      } catch (err) {
        setError('Terjadi kesalahan saat memuat artikel');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-2">Oops!</h2>
        <p className="text-foreground/60 mb-6">{error || 'Artikel tidak ditemukan'}</p>
        <Link href="/education">
          <Button>
            <ArrowLeft size={18} className="mr-2" />
            Kembali ke Edukasi
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/education" className="inline-flex items-center text-foreground/60 hover:text-primary-600 mb-6 transition">
        <ArrowLeft size={18} className="mr-2" />
        Kembali ke Daftar Artikel
      </Link>

      <article className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
              {article.category}
            </span>
            <span className="text-foreground/40 text-sm flex items-center gap-1">
              <Calendar size={14} />
              {new Date(article.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            {article.title}
          </h1>
        </div>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-foreground/5 shadow-lg">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0 prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary-600">
                <div className="whitespace-pre-wrap leading-relaxed text-foreground/80">
                  {article.content}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-4 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-lg">Bagikan Artikel</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Share2 size={18} />
                  </Button>
                  {/* Add more social share buttons here if needed */}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary-50 border-primary-100">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-primary-900 mb-2">Tahukah Anda?</h3>
                <p className="text-primary-800/80 text-sm">
                  Membaca artikel edukasi dapat meningkatkan kesadaran lingkungan dan membantu Anda mengumpulkan lebih banyak poin di Greentera!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </article>
    </div>
  );
}
