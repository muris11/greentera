import { Leaf } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-eco flex relative overflow-hidden">
      {/* Background Elements - Same as Landing Page */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float delay-300 -z-10" />

      {/* Left Side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative z-10">
        <div className="animate-fade-in-up">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient tracking-tight">Greentera</span>
          </Link>
        </div>

        <div className="space-y-6 animate-fade-in-up delay-100">
          <h1 className="text-5xl font-bold text-foreground leading-tight">
            Kelola Sampah,<br />
            <span className="text-gradient">Raih Reward!</span>
          </h1>
          <p className="text-foreground/60 text-lg max-w-md leading-relaxed">
            Bergabung dengan ribuan pengguna lainnya dalam misi menjaga lingkungan 
            dan dapatkan reward menarik untuk setiap kontribusi Anda.
          </p>

          <div className="flex gap-8 pt-4">
            <div>
              <h3 className="text-3xl font-bold text-primary-600">10K+</h3>
              <p className="text-foreground/50 text-sm font-medium uppercase tracking-wider">Pengguna Aktif</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-primary-600">50T+</h3>
              <p className="text-foreground/50 text-sm font-medium uppercase tracking-wider">Kg Sampah</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-primary-600">5K+</h3>
              <p className="text-foreground/50 text-sm font-medium uppercase tracking-wider">Pohon Ditanam</p>
            </div>
          </div>
        </div>

        <p className="text-foreground/40 text-sm animate-fade-in-up delay-200">
          © {new Date().getFullYear()} Greentera. All rights reserved.
        </p>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md animate-fade-in-up delay-100">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient tracking-tight">Greentera</span>
            </Link>
          </div>

          {/* Auth Card */}
          <div className="glass-card p-8 md:p-10 shadow-2xl shadow-black/10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
