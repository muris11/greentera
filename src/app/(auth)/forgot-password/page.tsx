'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Cek Email Anda</h2>
        <p className="text-foreground/60 mb-8">
          Kami telah mengirimkan instruksi reset password ke <strong>{email}</strong>
        </p>
        <Link href="/login">
          <Button variant="secondary" className="w-full">
            <ArrowLeft size={18} className="mr-2" />
            {t.auth.backToLogin}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">{t.auth.forgotTitle}</h2>
        <p className="text-foreground/60 mt-2">
          {t.auth.forgotSubtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label={t.auth.email}
          type="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail size={18} />}
          required
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          {isLoading ? 'Mengirim...' : t.auth.sendResetLink}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm text-foreground/60 hover:text-primary-600 flex items-center justify-center gap-2 transition"
        >
          <ArrowLeft size={16} />
          {t.auth.backToLogin}
        </Link>
      </div>
    </div>
  );
}
