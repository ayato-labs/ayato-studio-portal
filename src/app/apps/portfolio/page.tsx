/**
 * Ayato Studio Portal - Portfolio Strategist
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 */

import React from 'react';
import PortfolioContainer from '@/components/features/apps/portfolio/PortfolioContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Portfolio Strategist - Ayato Studio",
  description: "追加投資のみで目標アロケーションを達成する、税効率を重視したノーセル・リバランス・シミュレーター。",
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] py-20 md:py-32 selection:bg-blue-500/10 selection:text-blue-600">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-indigo-400/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="max-w-4xl mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 bg-white border border-gray-200 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500">Ayato Studio // Intelligence Systems</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-8 leading-none">
            PORTFOLIO<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">STRATEGIST</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl">
            売却による課税を避け、追加投資のみで理想のアセットアロケーションへ。<br />
            プロフェッショナルな資産形成を支える、ライトウェイトな知能。
          </p>
        </div>

        {/* Main App Container */}
        <PortfolioContainer />
        
        {/* Footer Info */}
        <div className="mt-32 pt-12 border-t border-gray-200 max-w-2xl">
            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Security & Privacy</h5>
            <p className="text-xs text-gray-500 leading-relaxed">
                このアプリケーションで入力された資産データは、あなたのブラウザ内（Local Storage）にのみ保存されます。
                サーバーへの送信や保存は一切行われません。Ayato Studio はあなたのプライバシーを尊重します。
            </p>
        </div>
      </div>
    </main>
  );
}
