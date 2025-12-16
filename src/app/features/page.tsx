'use client';

import LandingFooter from '@/components/layout/LandingFooter';
import LandingNavbar from '@/components/layout/LandingNavbar';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ArrowRight, Coins, Gift, Recycle, Smartphone, TreeDeciduous, Zap } from 'lucide-react';
import Link from 'next/link';

export default function FeaturesPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-eco selection:bg-primary-500 selection:text-white">
      <LandingNavbar />

      <main className="pt-32 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/50 backdrop-blur-sm mb-8 animate-fade-in-up">
            <Zap className="w-4 h-4 text-primary-500 fill-primary-500" />
            <span className="text-sm font-medium text-primary-700">{t.features.badge}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in-up delay-100">
            {t.features.heroTitle1} <br />
            <span className="text-gradient">{t.features.heroTitle2}</span>
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            {t.features.heroSubtitle}
          </p>
        </section>

        {/* Feature 1: Waste Deposit */}
        <section className="container mx-auto px-4 mb-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-6 text-green-600">
                <Recycle size={32} />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">{t.features.smartWaste}</h2>
              <p className="text-lg text-foreground/60 mb-6 leading-relaxed">
                {t.features.smartWasteDesc}
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-foreground/80">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">1</div>
                  {t.features.aiDetection}
                </li>
                <li className="flex items-center gap-3 text-foreground/80">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">2</div>
                  {t.features.realTimePoints}
                </li>
                <li className="flex items-center gap-3 text-foreground/80">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">3</div>
                  {t.features.transparentHistory}
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="glass-card p-8 bg-gradient-to-br from-green-50 to-white border-green-100 transform rotate-2 hover:rotate-0 transition duration-500">
                {/* Mock UI for Waste Scan */}
                <div className="aspect-video bg-black/5 rounded-xl flex items-center justify-center mb-4">
                  <Smartphone className="w-12 h-12 text-foreground/20" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">Botol Plastik PET</p>
                    <p className="text-sm text-foreground/60">{t.features.detected} • 0.5 kg</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-bold">+50 {t.features.points}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 2: Eco Tree */}
        <section className="container mx-auto px-4 mb-24">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 text-emerald-600">
                <TreeDeciduous size={32} />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">{t.features.ecoTree}</h2>
              <p className="text-lg text-foreground/60 mb-6 leading-relaxed">
                {t.features.ecoTreeDesc}
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-foreground/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">1</div>
                  {t.features.funGamification}
                </li>
                <li className="flex items-center gap-3 text-foreground/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">2</div>
                  {t.features.harvestBonus}
                </li>
                <li className="flex items-center gap-3 text-foreground/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">3</div>
                  {t.features.treeCollection}
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="glass-card p-8 bg-gradient-to-br from-emerald-50 to-white border-emerald-100 transform -rotate-2 hover:rotate-0 transition duration-500">
                <div className="text-center py-8">
                  <TreeDeciduous className="w-32 h-32 text-emerald-500 mx-auto mb-4 animate-bounce-slow" />
                  <h3 className="text-xl font-bold text-emerald-800">{t.features.mangoTree}</h3>
                  <p className="text-emerald-600 mb-4">{t.features.stage}: {t.features.fruiting}</p>
                  <div className="w-full bg-emerald-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-3/4 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 3: Rewards */}
        <section className="container mx-auto px-4 mb-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center mb-6 text-teal-600">
                <Gift size={32} />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">{t.features.rewardsVoucher}</h2>
              <p className="text-lg text-foreground/60 mb-6 leading-relaxed">
                {t.features.rewardsDesc}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/50 border border-white/60">
                  <Coins className="w-6 h-6 text-yellow-500 mb-2" />
                  <p className="font-bold">{t.features.eWallet}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/50 border border-white/60">
                  <Smartphone className="w-6 h-6 text-blue-500 mb-2" />
                  <p className="font-bold">{t.features.pulsa}</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="glass-card p-8 bg-gradient-to-br from-teal-50 to-white border-teal-100 transform rotate-2 hover:rotate-0 transition duration-500">
                <div className="flex items-center gap-4 mb-4 p-3 bg-white/60 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold">{t.features.pulsa} 50rb</p>
                    <p className="text-xs text-foreground/60">500 {t.features.points}</p>
                  </div>
                  <button className="ml-auto px-3 py-1 bg-primary-500 text-white text-xs rounded-lg">{t.features.redeem}</button>
                </div>
                <div className="flex items-center gap-4 p-3 bg-white/60 rounded-xl opacity-60">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Coins className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-bold">Gopay 20rb</p>
                    <p className="text-xs text-foreground/60">200 {t.features.points}</p>
                  </div>
                  <button className="ml-auto px-3 py-1 bg-gray-200 text-gray-500 text-xs rounded-lg">{t.features.redeem}</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">{t.features.ctaTitle}</h2>
          <Link href="/register" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50">
            {t.features.ctaButton} <ArrowRight size={20} />
          </Link>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
