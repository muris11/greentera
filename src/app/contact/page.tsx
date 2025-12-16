'use client';

import LandingFooter from '@/components/layout/LandingFooter';
import LandingNavbar from '@/components/layout/LandingNavbar';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-eco selection:bg-primary-500 selection:text-white">
      <LandingNavbar />

      <main className="pt-32 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/50 backdrop-blur-sm mb-8 animate-fade-in-up">
            <MessageSquare className="w-4 h-4 text-primary-500 fill-primary-500" />
            <span className="text-sm font-medium text-primary-700">{t.contact.badge}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in-up delay-100">
            {t.contact.heroTitle1} <br />
            <span className="text-gradient">{t.contact.heroTitle2}</span>
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            {t.contact.heroSubtitle}
          </p>
        </section>

        {/* Contact Content */}
        <section className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="lg:w-1/3 space-y-8">
              <div className="glass-card p-8">
                <h3 className="text-xl font-bold text-foreground mb-6">{t.contact.contactInfo}</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{t.contact.headOffice}</p>
                      <p className="text-foreground/60 text-sm leading-relaxed">
                        Jl. Sudirman No. 123, SCBD<br />
                        Jakarta Selatan, 12190
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{t.contact.email}</p>
                      <p className="text-foreground/60 text-sm">
                        hello@greentera.id<br />
                        support@greentera.id
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{t.contact.phone}</p>
                      <p className="text-foreground/60 text-sm">
                        +62 21 5555 8888<br />
                        Mon - Fri, 09:00 - 17:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="glass-card p-2 h-64 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <p className="text-foreground/40 font-medium">Google Maps Embed</p>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-2/3">
              <div className="glass-card p-8 md:p-10">
                <h3 className="text-2xl font-bold text-foreground mb-6">{t.contact.sendMessage}</h3>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground/70">{t.contact.fullName}</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-white/50 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground/70">{t.contact.email}</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com" 
                        className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-white/50 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/70">{t.contact.subject}</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-white/50 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition">
                      <option>{t.contact.generalQuestion}</option>
                      <option>{t.contact.partnership}</option>
                      <option>{t.contact.reportIssue}</option>
                      <option>{t.contact.other}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/70">{t.contact.message}</label>
                    <textarea 
                      rows={5}
                      placeholder={t.contact.messagePlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-white/50 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition resize-none"
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full py-4 text-lg shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2">
                    {t.contact.send} <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
