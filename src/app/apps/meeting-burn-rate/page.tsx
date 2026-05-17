import React from 'react';
import BurnCounter from '@/components/features/apps/meeting-burn-rate/BurnCounter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meeting Burn Rate - Ayato Studio',
  description:
    '会議のコストをリアルタイムで「炎上」させる、ブラックジョーク・メーター。',
};

export default function MeetingBurnRatePage() {
  return (
    <main className="min-h-screen bg-black py-20 selection:bg-red-500/20 selection:text-red-200 md:py-32">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.05)_0%,transparent_70%)]" />
      </div>

      <div className="container mx-auto px-6">
        <div className="mb-24 flex flex-col items-center text-center">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2">
            <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-[10px] font-black tracking-[0.3em] text-red-500 uppercase">
              Ayato Studio // Productivity Auditor
            </span>
          </div>

          <h1 className="mb-8 text-6xl leading-none font-black tracking-tighter text-white md:text-[10rem]">
            MEETING
            <br />
            <span className="text-red-600">BURN RATE</span>
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed font-medium text-gray-400 md:text-2xl">
            「時間」という名の札束が燃えていく。
            <br />
            その無益な対話に、どれほどの価値がありますか？
          </p>
        </div>

        <BurnCounter />

        <div className="mt-32 flex flex-col items-center text-center">
          <div className="max-w-2xl border-t border-white/5 pt-12">
            <h5 className="mb-4 text-[10px] font-black tracking-[0.3em] text-gray-800 uppercase">
              Disclaimer
            </h5>
            <p className="text-[10px] leading-relaxed text-gray-700 max-w-lg mx-auto uppercase tracking-widest">
              このツールは日本の最低賃金（¥1,055）に基づいた最小見積もりを表示しています。
              実際のビジネス損失、機会費用の焼失、および参加者の精神的摩耗は含まれていません。
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
