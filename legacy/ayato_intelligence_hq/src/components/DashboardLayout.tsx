'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/' },
    { name: 'SNS Audit', href: '/sns-audit' },
    { name: 'Intelligence Lake', href: '/lake' },
    { name: 'Engine Logs', href: '/logs' },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 p-6 flex flex-col gap-8">
        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Ayato HQ
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-semibold text-white">
            {navItems.find((n) => n.href === pathname)?.name || 'Dashboard'}
          </h1>
          <div className="flex gap-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
              System Online
            </span>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
