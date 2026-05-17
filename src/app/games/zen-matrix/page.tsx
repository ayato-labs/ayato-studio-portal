import React from 'react';
import ZenMatrixContainer from '@/components/features/games/zen-matrix/ZenMatrixContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zen Matrix - Ayato Studio Arcade',
  description: '盤面を自由にエディットできる、究極のブロック配置パズル。',
};

export default function ZenMatrixPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-20 md:py-32 selection:bg-blue-500/20 selection:text-blue-300 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center md:text-left">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2">
            <span className="text-[10px] font-black tracking-[0.3em] text-blue-400 uppercase">
              Arcade // Strategy
            </span>
          </div>

          <h1 className="mb-4 text-5xl leading-none font-black tracking-tighter md:text-7xl uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
            ZEN MATRIX
          </h1>
          <p className="max-w-2xl text-lg font-medium text-slate-400 mx-auto md:mx-0">
            グリッドを構築し、空間を最適化せよ。
            <br />
            限界まで広げた盤面で、あなたの生存戦略を証明する。
          </p>
        </div>

        <ZenMatrixContainer />
      </div>
    </main>
  );
}
