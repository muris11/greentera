'use client';

import {
    BookOpen,
    LayoutDashboard,
    Trash2,
    TreeDeciduous,
    User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Waste', href: '/waste', icon: Trash2 },
  { label: 'Tree', href: '/tree', icon: TreeDeciduous },
  { label: 'Edu', href: '/education', icon: BookOpen },
  { label: 'Profile', href: '/profile', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href || pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card-static rounded-none border-x-0 border-b-0 pb-safe md:hidden">
      <div className="flex items-center justify-around p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
                active 
                  ? 'text-primary-600 bg-primary-50 scale-110 shadow-sm' 
                  : 'text-foreground/60 hover:text-primary-500 hover:bg-white/50'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-[10px] font-medium mt-1 ${active ? 'text-primary-700' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
