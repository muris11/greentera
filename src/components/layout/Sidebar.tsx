'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
    BookOpen,
    ChevronDown,
    History,
    LayoutDashboard,
    Leaf,
    ScanLine,
    Ticket,
    Trash2,
    TreeDeciduous,
    Trophy
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
  labelKey: string;
  href: string;
  icon: React.ReactNode;
  children?: { labelKey: string; href: string; icon: React.ReactNode }[];
}

const navItemsConfig: NavItem[] = [
  {
    labelKey: 'dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    labelKey: 'wasteManagement',
    href: '/waste',
    icon: <Trash2 size={20} />,
    children: [
      { labelKey: 'scanWaste', href: '/waste/scan', icon: <ScanLine size={18} /> },
      { labelKey: 'manualDeposit', href: '/waste', icon: <Trash2 size={18} /> },
      { labelKey: 'history', href: '/waste/history', icon: <History size={18} /> },
    ],
  },
  {
    labelKey: 'ecoTree',
    href: '/tree',
    icon: <TreeDeciduous size={20} />,
  },
  {
    labelKey: 'voucher',
    href: '/voucher',
    icon: <Ticket size={20} />,
  },
  {
    labelKey: 'education',
    href: '/education',
    icon: <BookOpen size={20} />,
  },
  {
    labelKey: 'leaderboard',
    href: '/leaderboard',
    icon: <Trophy size={20} />,
  },
];


interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [expandedItems, setExpandedItems] = useState<string[]>(['wasteManagement']);

  // Create a labels object from translations
  const labels: Record<string, string> = {
    dashboard: t.sidebar.dashboard,
    wasteManagement: t.sidebar.wasteDeposit,
    scanWaste: t.sidebar.wasteDeposit,
    manualDeposit: t.sidebar.wasteDeposit,
    history: t.sidebar.dashboard,
    ecoTree: t.sidebar.myTree,
    voucher: t.sidebar.voucher,
    education: t.sidebar.education,
    leaderboard: t.sidebar.leaderboard,
  };

  const toggleExpand = (labelKey: string) => {
    setExpandedItems((prev) =>
      prev.includes(labelKey)
        ? prev.filter((item) => item !== labelKey)
        : [...prev, labelKey]
    );
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href || pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar glass-card-static rounded-none border-y-0 border-l-0 border-r border-white/20 h-screen fixed left-0 top-0 z-40 w-72 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gradient tracking-tight">Greentera</span>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar py-4">
          {navItemsConfig.map((item) => (
            <div key={item.labelKey}>
              {item.children ? (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleExpand(item.labelKey)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive(item.href) 
                        ? 'bg-primary-50 text-primary-600 font-semibold shadow-sm' 
                        : 'text-foreground/70 hover:bg-white/50 hover:text-primary-600'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`transition-colors ${isActive(item.href) ? 'text-primary-600' : 'text-foreground/50 group-hover:text-primary-600'}`}>
                        {item.icon}
                      </span>
                      {labels[item.labelKey] || item.labelKey}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 text-foreground/40 ${expandedItems.includes(item.labelKey) ? 'rotate-180' : ''}`}
                    />
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      expandedItems.includes(item.labelKey) ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="ml-4 pl-4 border-l border-primary-100 space-y-1 mt-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                            pathname === child.href 
                              ? 'text-primary-600 font-medium bg-primary-50/50' 
                              : 'text-foreground/60 hover:text-primary-600 hover:bg-white/30'
                          }`}
                          onClick={onClose}
                        >
                          {child.icon}
                          {labels[child.labelKey] || child.labelKey}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                      : 'text-foreground/70 hover:bg-white/50 hover:text-primary-600'
                  }`}
                  onClick={onClose}
                >
                  <span className={isActive(item.href) ? 'text-white' : 'text-foreground/50 group-hover:text-primary-600 transition-colors'}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{labels[item.labelKey] || item.labelKey}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Divider */}
        <div className="px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-black/5 to-transparent my-4" />
        </div>
      </aside>
    </>
  );
}
