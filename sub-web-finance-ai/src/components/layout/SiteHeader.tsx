/**
 * Ayato Studio Finance - Site Header Navigation
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, BarChart3, Home } from 'lucide-react';

export default function SiteHeader() {
  const pathname = usePathname();

  const navItems = [
    { id: 'nav-dashboard', label: 'Dashboard', href: '/', icon: Home },
    { id: 'nav-nisa', label: 'NISA Strategist', href: '/nisa', icon: TrendingUp },
    { id: 'nav-portfolio', label: 'Portfolio Strategist', href: '/portfolio', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="container mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        {/* Brand Logo */}
        <Link
          id="header-brand-logo"
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600">
            <span className="font-outfit text-lg font-black text-white">F</span>
          </div>
          <div className="flex flex-col">
            <span className="font-outfit text-sm font-black tracking-widest text-white uppercase">
              Ayato Studio
            </span>
            <span className="text-[9px] font-black tracking-[0.3em] text-blue-400 uppercase">
              Finance // AI
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1 md:gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                id={item.id}
                href={item.href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${
                  isActive
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
