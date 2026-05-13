/**
 * Ayato Studio Portal - Portfolio Strategist
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 */

import React from 'react';
import PortfolioContainer from '@/components/features/apps/portfolio/PortfolioContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio Strategist - Ayato Studio',
  description:
    '追加投資のみで目標アロケーションを達成する、税効率を重視したノーセル・リバランス・シミュレーター。',
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] py-20 selection:bg-blue-500/10 selection:text-blue-600 md:py-32">
      {/* Background Decor */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-blue-400/5 blur-[120px]" />
        <div className="absolute right-[-5%] bottom-[10%] h-[35%] w-[35%] rounded-full bg-indigo-400/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="mb-20 max-w-4xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">
              Ayato Studio // Intelligence Systems
            </span>
          </div>

          <h1 className="mb-8 text-6xl leading-none font-black tracking-tighter text-gray-900 md:text-8xl">
            PORTFOLIO
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              STRATEGIST
            </span>
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed font-medium text-gray-500 md:text-2xl">
            売却による課税を避け、追加投資のみで理想のアセットアロケーションへ。
            <br />
            プロフェッショナルな資産形成を支える、ライトウェイトな知能。
          </p>
        </div>

        {/* Main App Container */}
        <PortfolioContainer />

        {/* Footer Info */}
        <div className="mt-32 max-w-2xl border-t border-gray-200 pt-12">
          <h5 className="mb-4 text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">
            Security & Privacy
          </h5>
          <p className="text-xs leading-relaxed text-gray-500">
            このアプリケーションで入力された資産データは、あなたのブラウザ内（Local
            Storage）にのみ保存されます。 サーバーへの送信や保存は一切行われません。Ayato Studio
            はあなたのプライバシーを尊重します。
          </p>
        </div>
      </div>
    </main>
  );
}
