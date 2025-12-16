'use client';

import {
    Gift,
    GraduationCap,
    LayoutDashboard,
    Leaf,
    Settings,
    Ticket,
    Trash2,
    Users,
    X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/deposits', icon: Trash2, label: 'Deposits' },
  { href: '/admin/voucher-templates', icon: Gift, label: 'Voucher Templates' },
  { href: '/admin/vouchers', icon: Ticket, label: 'User Vouchers' },
  { href: '/admin/education', icon: GraduationCap, label: 'Education' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - solid background for responsive, glass for desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white lg:bg-white/80 lg:backdrop-blur-xl border-r border-foreground/10 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-foreground/10">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-foreground">Greentera</span>
              <span className="text-xs text-primary-600 block -mt-1">Admin Panel</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-foreground/60 hover:text-foreground rounded-lg hover:bg-foreground/5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-primary-600' : ''} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
