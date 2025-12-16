'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Instagram, Leaf, Linkedin, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';

export default function LandingFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white/50 backdrop-blur-xl border-t border-black/5 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient tracking-tight">Greentera</span>
            </Link>
            <p className="text-foreground/60 leading-relaxed">
              {t.footer.description}
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/50 border border-black/5 flex items-center justify-center text-foreground/60 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-foreground mb-6">{t.footer.quickLinks}</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-foreground/60 hover:text-primary-600 transition">{t.navbar.about}</Link></li>
              <li><Link href="/features" className="text-foreground/60 hover:text-primary-600 transition">{t.navbar.features}</Link></li>
              <li><Link href="/contact" className="text-foreground/60 hover:text-primary-600 transition">{t.navbar.contact}</Link></li>
            </ul>
          </div>

          {/* Resource Links */}
          <div>
            <h4 className="font-bold text-foreground mb-6">{t.footer.support}</h4>
            <ul className="space-y-4">
              <li><Link href="/contact" className="text-foreground/60 hover:text-primary-600 transition">{t.footer.helpCenter}</Link></li>
              <li><Link href="/contact" className="text-foreground/60 hover:text-primary-600 transition">{t.footer.faq}</Link></li>
              <li><Link href="#" className="text-foreground/60 hover:text-primary-600 transition">{t.footer.privacyPolicy}</Link></li>
              <li><Link href="#" className="text-foreground/60 hover:text-primary-600 transition">{t.footer.terms}</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-foreground mb-6">{t.footer.followUs}</h4>
            <p className="text-foreground/60 mb-4 text-sm">
              {t.footer.description}
            </p>
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-white/50 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition text-sm"
              />
              <button className="btn-primary w-full py-3 text-sm shadow-lg shadow-primary-500/20">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground/40 text-center md:text-left">
            © {new Date().getFullYear()} Greentera Indonesia. {t.footer.allRightsReserved}
          </p>
          <div className="flex gap-6 text-sm text-foreground/40">
            <Link href="#" className="hover:text-primary-600 transition">{t.footer.privacyPolicy}</Link>
            <Link href="#" className="hover:text-primary-600 transition">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
