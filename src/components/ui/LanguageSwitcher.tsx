'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-white/10 border border-foreground/10 rounded-lg p-1">
      <button
        onClick={() => setLanguage('id')}
        className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
          language === 'id'
            ? 'bg-white text-primary-600 shadow-sm'
            : 'text-foreground/60 hover:text-foreground'
        }`}
      >
        ID
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
          language === 'en'
            ? 'bg-white text-primary-600 shadow-sm'
            : 'text-foreground/60 hover:text-foreground'
        }`}
      >
        EN
      </button>
    </div>
  );
}
