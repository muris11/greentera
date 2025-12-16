"use client";

import { NotificationDropdown } from "@/components/ui/NotificationDropdown";
import { LogOut, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface AdminNavbarProps {
  onMenuClick: () => void;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AdminNavbar({ onMenuClick, user }: AdminNavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-20 h-16 glass-card-static border-x-0 border-t-0 px-4 flex items-center justify-between transition-colors">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-foreground/60 hover:text-foreground rounded-lg hover:bg-foreground/5"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-foreground font-semibold hidden sm:block">
          Admin Dashboard
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <NotificationDropdown />

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-foreground/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {user.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-foreground">
                {user.name || "Admin"}
              </p>
              <p className="text-xs text-foreground/50">{user.email}</p>
            </div>
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 glass-card-static border border-foreground/10 rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
