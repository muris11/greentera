'use client';

import LandingFooter from '@/components/layout/LandingFooter';
import LandingNavbar from '@/components/layout/LandingNavbar';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ArrowRight, ChevronRight, Gift, Recycle, Star, TreeDeciduous, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const { t } = useLanguage();

  const stats = [
    { label: t.landing.activeUsers, value: '10K+' },
    { label: t.landing.wasteCollected, value: '50T+' },
    { label: t.landing.treesPlanted, value: '5K+' },
    { label: t.landing.recyclePartners, value: '100+' },
  ];

  const features = [
    {
      icon: <Recycle className="w-8 h-8 text-white" />,
      title: t.landing.wasteDeposit,
      desc: t.landing.wasteDepositDesc,
      color: 'from-green-400 to-green-600'
    },
    {
      icon: <TreeDeciduous className="w-8 h-8 text-white" />,
      title: t.landing.plantTree,
      desc: t.landing.plantTreeDesc,
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      icon: <Gift className="w-8 h-8 text-white" />,
      title: t.landing.exchangeVoucher,
      desc: t.landing.exchangeVoucherDesc,
      color: 'from-teal-400 to-teal-600'
    },
    {
      icon: <Trophy className="w-8 h-8 text-white" />,
      title: t.landing.leaderboard,
      desc: t.landing.leaderboardDesc,
      color: 'from-cyan-400 to-cyan-600'
    }
  ];

  const missions = [t.landing.mission1, t.landing.mission2, t.landing.mission3];

  return (
    <div className="min-h-screen bg-gradient-eco overflow-x-hidden selection:bg-primary-500 selection:text-white">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float -z-10" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float delay-300 -z-10" />

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/50 backdrop-blur-sm mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
            <span className="text-sm font-medium text-primary-700">{t.landing.badge}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight animate-fade-in-up delay-100">
            {t.landing.heroTitle1}<br />
            <span className="text-gradient">{t.landing.heroTitle2}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
            {t.landing.heroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Link
              href="/register"
              className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-1 transition-all duration-300"
            >
              {t.landing.startNow}
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/features"
              className="btn-secondary inline-flex items-center justify-center text-lg px-8 py-4 hover:-translate-y-1 transition-all duration-300"
            >
              {t.landing.learnMore}
            </Link>
          </div>

          {/* Hero Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in-up delay-300">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</h3>
                <p className="text-sm text-foreground/50 font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t.landing.featuresTitle}
            </h2>
            <p className="text-foreground/60 text-lg">
              {t.landing.featuresSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="glass-card p-8 hover:bg-white/40 transition-all duration-300 group">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-foreground/60 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 px-4 relative bg-white/30 backdrop-blur-sm border-y border-white/20">
        <div className="container mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
              <Star size={14} className="fill-primary-700" />
              {t.landing.aboutUs}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t.landing.visionMission}
            </h2>
            <p className="text-foreground/60 text-lg">
              {t.landing.visionMissionDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Vision Card */}
            <div className="glass-card p-8 md:p-10 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10" />
              <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-6 text-primary-600">
                <Star size={32} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{t.landing.ourVision}</h3>
              <p className="text-lg text-foreground/70 leading-relaxed">
                {t.landing.visionText}
              </p>
            </div>

            {/* Mission Card */}
            <div className="glass-card p-8 md:p-10 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl -z-10" />
              <div className="w-16 h-16 rounded-2xl bg-accent-100 flex items-center justify-center mb-6 text-accent-600">
                <Trophy size={32} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{t.landing.ourMission}</h3>
              <ul className="space-y-4">
                {missions.map((mission, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-foreground/70 text-lg">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500 flex-shrink-0" />
                    {mission}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-24 px-4 bg-white/30 backdrop-blur-sm border-y border-white/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                <Star size={14} className="fill-primary-700" />
                {t.landing.trustedCommunity}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                {t.landing.joinGreen1} <span className="text-gradient">{t.landing.joinGreen2}</span> {t.landing.joinGreen3}
              </h2>
              <p className="text-lg text-foreground/60 mb-8 leading-relaxed">
                {t.landing.joinDesc}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                    +10K
                  </div>
                </div>
                <div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/60 font-medium mt-1">4.9/5 {t.landing.communityRating}</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="glass-card p-8 max-w-md mx-auto relative z-10 rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Budi Santoso</h4>
                    <p className="text-sm text-foreground/50">{t.landing.topContributor}</p>
                  </div>
                </div>
                <p className="text-foreground/70 italic text-lg">
                  {t.landing.testimonial}
                </p>
              </div>
              <div className="absolute top-10 -right-4 w-24 h-24 bg-primary-400/30 rounded-full blur-2xl -z-10" />
              <div className="absolute -bottom-10 -left-4 w-32 h-32 bg-accent-400/30 rounded-full blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="glass-card p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/10 to-accent-500/10 -z-10" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl" />
            
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              {t.landing.ctaTitle}
            </h2>
            <p className="text-foreground/60 max-w-xl mx-auto mb-10 text-lg">
              {t.landing.ctaSubtitle}
            </p>
            <Link
              href="/register"
              className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-4 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 transition-all duration-300"
            >
              {t.landing.registerNow}
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
