/**
 * Ayato Studio Finance - NISA Strategist
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 */

import React from 'react';
import NisaSimulator from '@/components/features/apps/nisa-strategist/NisaSimulator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NISA Strategist - Ayato Studio',
  description:
    '1800万円の壁を正確にシミュレート。枠到達後の複利成長を可視化し、真の資産戦略を構築する。',
};

export default function NisaPage() {
  return (
    <main className="relative overflow-hidden py-20 md:py-32 selection:bg-blue-500/10 selection:text-blue-400">
      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-blue-600/5 blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-6xl px-6 relative z-10">
        {/* Header Section */}
        <div className="mb-20 max-w-4xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase">
              Ayato Studio // Finance & AI Systems
            </span>
          </div>

          <h1 className="mb-8 text-6xl leading-none font-black tracking-tighter text-white md:text-[8rem] uppercase">
            NISA
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              STRATEGIST
            </span>
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed font-medium text-gray-400 md:text-2xl">
            1800万円の壁を正確にシミュレート。
            <br />
            枠到達後の複利成長を可視化し、真の資産戦略を構築する。
          </p>
        </div>

        {/* NISA Simulator Component */}
        <NisaSimulator />

        {/* Footer Info */}
        <div className="mt-32 max-w-2xl border-t border-white/10 pt-12">
          <h5 className="mb-4 text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase">
            Security & Privacy
          </h5>
          <p className="text-xs leading-relaxed text-gray-500">
            このツールで入力されたデータは、ブラウザ内の Local Storage 
            にのみ安全に保存されます。サーバーへの送信は行われません。
          </p>
        </div>
      </div>
    </main>
  );
}
