"use client";

import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Leaf, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function LandingNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/", label: t.navbar.home },
    { href: "/features", label: t.navbar.features },
    { href: "/about", label: t.navbar.about },
    { href: "/contact", label: t.navbar.contact },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 glass-card-static rounded-none border-x-0 border-t-0 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 animate-fade-in-up"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient tracking-tight">
                Greentera
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8 animate-fade-in-up delay-100" />
            <div className="hidden md:flex items-center gap-4 animate-fade-in-up delay-100" />
            <div className="flex items-center gap-4 md:hidden">
              <button className="p-2 text-foreground/70 hover:text-primary-600 transition">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card-static rounded-none border-x-0 border-t-0 transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 animate-fade-in-up">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient tracking-tight">
              Greentera
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 animate-fade-in-up delay-100">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                  isActive(link.href)
                    ? "text-primary-600 font-bold"
                    : "text-foreground/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4 animate-fade-in-up delay-100">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="px-4 py-2 text-foreground/80 hover:text-primary-600 transition font-medium text-sm"
            >
              {t.navbar.login}
            </Link>
            <Link
              href="/register"
              className="btn-primary text-sm px-6 py-2.5 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40"
            >
              {t.navbar.register}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <LanguageSwitcher />
            <button
              className="p-2 text-foreground/70 hover:text-primary-600 transition"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in">
            <nav className="flex flex-col gap-2 p-4 rounded-2xl bg-white/50 backdrop-blur-md border border-white/20">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-primary-50 text-primary-700"
                      : "text-foreground/70 hover:bg-white/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-foreground/10 my-2" />
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-foreground/70 hover:bg-white/50 text-center"
              >
                {t.navbar.login}
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full py-3 text-center shadow-lg shadow-primary-500/20"
              >
                {t.navbar.register}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
