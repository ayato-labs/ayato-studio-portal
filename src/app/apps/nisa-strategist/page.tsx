import React from 'react';
import NisaSimulator from '@/components/features/apps/nisa-strategist/NisaSimulator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NISA Strategist - Ayato Studio',
  description:
    '1800万円の生涯投資枠を自動管理。NISA特化型の複利シミュレーター。',
};

export default function NisaStrategistPage() {
  return (
    <main className="min-h-screen bg-background py-20 selection:bg-blue-500/10 selection:text-blue-600 md:py-32">
      <div className="container mx-auto px-6">
        <div className="mb-20 max-w-4xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 shadow-sm">
            <span className="text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase">
              Ayato Studio // Intelligence Systems
            </span>
          </div>

          <h1 className="mb-8 text-6xl leading-none font-black tracking-tighter text-white md:text-[8rem]">
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

        <NisaSimulator />

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
