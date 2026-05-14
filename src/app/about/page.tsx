import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'About Ayato Studio | Independent Market Intelligence',
  description:
    'AIハーネス・エンジニアリング（AI Harness Engineering）を駆使し、磨き上げられた知性だけを抽出するインテリジェンス・プラットフォーム。情報の深層を解き明かします。',
};

export default function AboutPage() {
  return (
    <main className="bg-background min-h-screen overflow-x-hidden text-white selection:bg-blue-500/30">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(3,3,3,1)_100%)]" />

      <div className="container mx-auto max-w-5xl px-6 py-24 md:py-32">
        <div className="mb-24">
          <div className="mb-8 inline-flex items-center gap-3 text-xs font-bold tracking-[0.3em] text-blue-500 uppercase">
            <div className="h-px w-12 bg-blue-500/50" />
            Mission Statement
          </div>
          <h1 className="mb-12 text-5xl leading-[0.9] font-black tracking-tighter md:text-8xl">
            HARNESSING AI.
            <br />
            <span className="inline-block bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text py-2 text-transparent">
              DEFINING TRUTH.
            </span>
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed font-bold tracking-tight text-gray-300">
            Ayato Studio は、AI 生成のノイズが溢れる時代において、
            「磨き上げられた知性」だけを抽出するためのインテリジェンス・レイヤーです。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
          <div className="space-y-12 text-lg leading-relaxed font-medium text-gray-400 lg:col-span-2">
            <section>
              <h2 className="mb-6 text-2xl font-black tracking-tight text-white uppercase">
                The Core Problem // 情報の氾濫と劣化
              </h2>
              <p>
                現在、世界はかつてない速度で AI 生成コンテンツに埋め尽くされています。
                しかし、その多くは表面的な要約や、事実に基づかないハルシネーション（嘘）を孕んでいます。
                真に価値のある「知性」は、速度ではなく、その「密度」と「正確性」に宿ります。
              </p>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-black tracking-tight text-white uppercase">
                AI Harness Engineering // AI に手綱を、思考に深淵を
              </h2>
              <p>
                私たちは単に AI を使って記事を書いているのではありません。
                AI の「暴走」を抑え、文脈を正確に捉えさせるための品質管理機構——
                <strong>AI Harness Engineering</strong> を基盤としています。
              </p>
              <p className="mt-4">
                この技術により、膨大なデータから「何が起きているか」だけでなく、
                「なぜそれが重要なのか」という深層のインサイトを、抽出します。
              </p>
            </section>

            <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 md:p-12">
              <h3 className="mb-8 text-xl font-black text-white uppercase tracking-widest">Target Domains</h3>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-blue-500 font-black text-xs uppercase tracking-widest">01 / Deep-Tech</h4>
                  <p className="text-sm text-gray-400">量子計算、バイオ、半導体——産業構造を根底から変える技術の深層。</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-blue-500 font-black text-xs uppercase tracking-widest">02 / Clean-Energy</h4>
                  <p className="text-sm text-gray-400">エネルギーの転換点に潜む、地政学的かつ経済的なリアリティ。</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-blue-500 font-black text-xs uppercase tracking-widest">03 / Market Anomalies</h4>
                  <p className="text-sm text-gray-400">マクロ統計には現れない、市場の裂け目にあるニッチな兆候。</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-blue-500 font-black text-xs uppercase tracking-widest">04 / Agentic AI</h4>
                  <p className="text-sm text-gray-400">AI が自律的に行動する未来——その「手綱」となる技術の最前線。</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-white/5 bg-black/40 p-8 backdrop-blur-xl">
              <h4 className="mb-6 text-[10px] font-black tracking-widest text-blue-500 uppercase">
                Ethical Protocol
              </h4>
              <div className="space-y-6">
                <div>
                  <p className="mb-2 text-xs font-black text-white uppercase tracking-tighter">Intellectual Integrity</p>
                  <p className="text-xs leading-relaxed text-gray-500">
                    プライバシー保護は単なる機能ではありません。
                    ユーザーの興味関心を追跡しないことは、私たちの「知的誠実さ」の証明です。
                  </p>
                </div>
                <div className="h-px bg-white/5" />
                <div>
                  <p className="mb-2 text-xs font-black text-white uppercase tracking-tighter">Human-Centric Design</p>
                  <p className="text-xs leading-relaxed text-gray-500">
                    AI はあくまで手段。最終的な価値は、高い質の意思決定をいかに加速させ多く可能にすることにあります。
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/reports"
              className="group relative block overflow-hidden rounded-3xl p-8"
            >
              <div className="absolute inset-0 bg-blue-600 transition-transform duration-500 group-hover:scale-105" />
              <div className="relative">
                <h4 className="mb-2 text-lg font-black text-white">Explore Reports</h4>
                <p className="text-xs text-white/70">
                  磨き上げられたインテリジェンスの深淵へ &rarr;
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
