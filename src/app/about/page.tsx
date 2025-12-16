'use client';

import LandingFooter from '@/components/layout/LandingFooter';
import LandingNavbar from '@/components/layout/LandingNavbar';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ArrowRight, Globe, Shield, Star } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const { t } = useLanguage();

  const team = [
    { name: 'Rifqy Saputra', role: 'Founder & CEO', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rifqy' },
    { name: 'Sarah Amalia', role: 'Head of Operations', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { name: 'Budi Pratama', role: 'Lead Developer', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi' },
  ];

  const missions = [t.about.mission1, t.about.mission2, t.about.mission3];

  return (
    <div className="min-h-screen bg-gradient-eco selection:bg-primary-500 selection:text-white">
      <LandingNavbar />

      <main className="pt-32 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/50 backdrop-blur-sm mb-8 animate-fade-in-up">
            <Star className="w-4 h-4 text-primary-500 fill-primary-500" />
            <span className="text-sm font-medium text-primary-700">{t.about.badge}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in-up delay-100">
            {t.about.heroTitle1} <br />
            <span className="text-gradient">{t.about.heroTitle2}</span>
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            {t.about.heroSubtitle}
          </p>
        </section>

        {/* Vision & Mission */}
        <section className="container mx-auto px-4 mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-10 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10" />
              <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-6 text-primary-600">
                <Globe size={32} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">{t.about.ourVision}</h2>
              <p className="text-lg text-foreground/70 leading-relaxed">
                {t.about.visionText}
              </p>
            </div>

            <div className="glass-card p-10 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl -z-10" />
              <div className="w-16 h-16 rounded-2xl bg-accent-100 flex items-center justify-center mb-6 text-accent-600">
                <Shield size={32} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">{t.about.ourMission}</h2>
              <ul className="space-y-4 text-foreground/70 text-lg">
                {missions.map((mission, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-accent-500 flex-shrink-0" />
                    {mission}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t.about.teamTitle}</h2>
            <p className="text-foreground/60">{t.about.teamSubtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="glass-card p-6 text-center hover:bg-white/40 transition">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary-100 to-teal-100 p-1 mb-4">
                  <img src={member.img} alt={member.name} className="w-full h-full rounded-full bg-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                <p className="text-primary-600 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4">
          <div className="glass-card p-12 text-center bg-primary-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-teal-600 opacity-90" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">{t.about.ctaTitle}</h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                {t.about.ctaSubtitle}
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3 rounded-xl font-bold hover:bg-primary-50 transition">
                {t.about.contactUs} <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
