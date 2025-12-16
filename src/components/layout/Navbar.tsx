'use client';

import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { NotificationDropdown } from '@/components/ui/NotificationDropdown';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Menu, Search } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';

interface NavbarProps {
  onMenuClick?: () => void;
  user?: {
    name: string;
    email: string;
    image?: string;
  };
}

export function Navbar({ onMenuClick, user }: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { t } = useLanguage();

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <header className="sticky top-0 z-20 glass-card-static rounded-none border-x-0 border-t-0 px-4 py-3 md:px-6">
      <div className="flex items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-primary-50 transition md:hidden"
          >
            <Menu size={24} />
          </button>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 border border-white/20 w-64 lg:w-80 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
            <Search size={18} className="text-foreground/50" />
            <input
              type="text"
              placeholder={t.navbar.searchPlaceholder}
              className="bg-transparent border-none outline-none flex-1 text-sm placeholder:text-foreground/50"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Notifications */}
          <NotificationDropdown />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-primary-50 transition"
            >
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'User'}
                  width={36}
                  height={36}
                  className="rounded-lg"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-primary-500/20">
                  {initials}
                </div>
              )}
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-foreground/60">{user?.email || 'user@email.com'}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 glass-card-static p-2 animate-fade-in z-50">
                <a
                  href="/profile"
                  className="block px-3 py-2 text-sm rounded-lg hover:bg-primary-50 transition font-medium"
                >
                  {t.navbar.profile}
                </a>
                <a
                  href="/settings"
                  className="block px-3 py-2 text-sm rounded-lg hover:bg-primary-50 transition font-medium"
                >
                  {t.navbar.settings}
                </a>
                <div className="h-px bg-black/5 my-2" />

                <button 
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg text-red-500 hover:bg-red-50 transition font-medium"
                >
                  {t.navbar.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
