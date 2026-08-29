/**
 * Ayato Studio Finance - Portal Dashboard
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 */

import React from 'react';
import Link from 'next/link';
import { TrendingUp, BarChart3, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finance & AI Systems - Ayato Studio',
  description: '金融市場分析と最先端AI技術の融合。次世代の投資インテリジェンスを提供します。',
};

export default function Page() {
  const apps = [
    {
      id: 'nisa-strategist',
      title: 'NISA Strategist',
      tagline: '1800万円の壁と複利成長の最大化',
      description:
        '生涯投資枠1800万円を最短で埋めた場合と、ダラダラと投資した場合の資産成長の差を正確にシミュレーション。使っていないサブスク支出が将来に及ぼす「バタフライ効果」や、資産がもたらす「無職生存期間」まで可視化します。',
      href: '/nisa',
      icon: TrendingUp,
      gradient: 'from-blue-600/20 to-indigo-600/20',
      border: 'border-blue-500/20 hover:border-blue-500/60',
      shadow: 'hover:shadow-blue-500/10',
      textAccent: 'text-blue-400',
    },
    {
      id: 'portfolio-strategist',
      title: 'Portfolio Strategist',
      tagline: '税効率を極めるノーセル・リバランス',
      description:
        '資産を売却して利益確定（課税）を発生させることなく、毎月の追加入金分だけで目標のアセットアロケーションに再接近させるアルゴリズム。複数の個別資産やカスタムアセットを追加して、理想のアライメントをシミュレート。',
      href: '/portfolio',
      icon: BarChart3,
      gradient: 'from-emerald-600/20 to-teal-600/20',
      border: 'border-emerald-500/20 hover:border-emerald-500/60',
      shadow: 'hover:shadow-emerald-500/10',
      textAccent: 'text-emerald-400',
    },
  ];

  return (
    <div className="relative overflow-hidden py-20 md:py-32 selection:bg-blue-500/10 selection:text-blue-400">
      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-600/5 blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-6xl px-6 relative z-10">
        <div className="mb-20 max-w-4xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 shadow-sm">
            <span className="text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase">
              Ayato Studio // Finance & AI Systems
            </span>
          </div>

          <h1 className="mb-8 text-6xl leading-none font-black tracking-tighter text-white md:text-[8rem] uppercase">
            INVESTMENT
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              INTELLIGENCE
            </span>
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed font-medium text-gray-400 md:text-2xl">
            最先端のモデリングとシミュレーションで、あなたの資産形成を合理化する。
            <br />
            売却ロスと機会損失を極限まで排除した、知性のアプローチ。
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <Link
                key={app.id}
                id={`card-link-${app.id}`}
                href={app.href}
                className={`group flex flex-col justify-between rounded-[2.5rem] border ${app.border} bg-gradient-to-br ${app.gradient} p-10 shadow-2xl transition-all duration-500 ${app.shadow} hover:-translate-y-1 backdrop-blur-sm`}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className={`rounded-2xl bg-white/5 p-4 ${app.textAccent}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
                      Active Tool //
                    </span>
                  </div>

                  <div>
                    <h3 className="mb-2 text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400">
                      {app.title}
                    </h3>
                    <p className={`text-xs font-bold tracking-widest uppercase ${app.textAccent} mb-4`}>
                      {app.tagline}
                    </p>
                    <p className="text-sm leading-relaxed text-gray-400">
                      {app.description}
                    </p>
                  </div>
                </div>

                <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
                  <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase group-hover:text-blue-400 transition-colors">
                    Launch Application
                  </span>
                  <div className="rounded-full bg-white/5 p-3 text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-32 max-w-2xl border-t border-white/10 pt-12">
          <h5 className="mb-4 text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase">
            Security & Privacy
          </h5>
          <p className="text-xs leading-relaxed text-gray-500">
            すべてのシミュレーターで入力されたデータは、ブラウザ内の Local Storage 
            にのみ安全に保存されます。サーバーへの送信は行われません。
          </p>
        </div>
      </div>
    </div>
  );
}
