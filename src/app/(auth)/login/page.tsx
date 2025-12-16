'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const callbackUrl = searchParams.get('callbackUrl');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Redirect based on role after session is loaded
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const redirectUrl = callbackUrl || (session.user.role === 'ADMIN' ? '/admin' : '/dashboard');
      router.push(redirectUrl);
      router.refresh();
    }
  }, [session, status, callbackUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      }
      // Redirect will be handled by useEffect after session updates
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: callbackUrl || '/dashboard' });
    } catch (err) {
      setError('Gagal login dengan Google');
      setIsGoogleLoading(false);
    }
  };

  // If already authenticated, show loading while redirecting
  if (status === 'authenticated') {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-foreground/60">Mengalihkan...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">{t.auth.loginTitle}</h2>
        <p className="text-foreground/60 mt-2">
          {t.auth.loginSubtitle}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label={t.auth.email}
          type="email"
          placeholder="nama@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          leftIcon={<Mail size={18} />}
          required
        />

        <Input
          label={t.auth.password}
          type={showPassword ? 'text' : 'password'}
          placeholder="Masukkan password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          leftIcon={<Lock size={18} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
          required
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-foreground/70">Ingat saya</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {t.auth.forgotPassword}
          </Link>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          {isLoading ? 'Memproses...' : t.auth.loginTitle}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-foreground/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-foreground/50">
            {t.auth.orLoginWith}
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        onClick={handleGoogleLogin}
        isLoading={isGoogleLoading}
        className="w-full"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {t.auth.continueWithGoogle}
      </Button>

      <p className="text-center mt-6 text-foreground/60">
        {t.auth.noAccount}{' '}
        <Link
          href="/register"
          className="text-primary-600 hover:text-primary-700 font-semibold"
        >
          {t.auth.registerTitle}
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
