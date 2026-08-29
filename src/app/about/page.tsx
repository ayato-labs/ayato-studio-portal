import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'About Ayato Studio | AI Native Systems Engineering',
  description:
    'AIが存在することを前提とした、自律的エージェント・MCP（Model Context Protocol）連携・エッジファーストなAIネイティブシステム構築とインテグレーションの専門技術スタジオ。',
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
              BUILDING NATIVE.
            </span>
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed font-bold tracking-tight text-gray-300">
            Ayato Studio
            は、AIが存在することを前提とした「AIネイティブ」なシステム・ワークフロー構築の専門技術スタジオです。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
          <div className="space-y-12 text-lg leading-relaxed font-medium text-gray-400 lg:col-span-2">
            <section>
              <h2 className="mb-6 text-2xl font-black tracking-tight text-white uppercase">
                The Core Problem // 既存システムとAIの「壁」
              </h2>
              <p>
                企業が保有する既存システム、固有のデータベース、レガシーAPIは、
                最新のLLMやAIエージェントにとってそのままではアクセスしづらい「壁」となっています。
                AIの能力をビジネスに最大限組み込むには、AIエージェントが心地よく稼働するための
                システムインフラと、安全な接続プロトコル（MCP等）が不可欠です。
              </p>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-black tracking-tight text-white uppercase">
                AI Native Systems // AIに手綱を、システムに協調を
              </h2>
              <p>
                私たちは単にAIモデルをAPI経由で呼び出すだけのシステムは作りません。
                AIエージェントが自律的にタスクをこなし、人間や既存システムと協調するための
                メモリ管理、セキュアな認証、カスタムMCP（Model Context
                Protocol）サーバーの開発を行います。
              </p>
              <p className="mt-4">
                エッジ環境（Cloudflare Pages/Workers + Supabase RLS等）をフル活用することで、
                初期投資を抑えつつ爆速でPoC（概念実証）からプロダクション運用までを
                立ち上げる「超高機動型エッジファースト」を実装します。
              </p>
            </section>

            <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 md:p-12">
              <h3 className="mb-8 text-xl font-black tracking-widest text-white uppercase">
                Core Capabilities
              </h3>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-xs font-black tracking-widest text-blue-500 uppercase">
                    01 / Custom MCP Server
                  </h4>
                  <p className="text-sm text-gray-400">
                    既存DBや社内APIをAIエージェントに安全に接続する、標準仕様に準拠したカスタムMCPサーバーの設計・開発。
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-black tracking-widest text-blue-500 uppercase">
                    02 / Agentic Orchestration
                  </h4>
                  <p className="text-sm text-gray-400">
                    LangGraphや自律型エージェントを活用した、複雑なビジネスプロセスの自動化・ワークフロー構築。
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-black tracking-widest text-blue-500 uppercase">
                    03 / Edge First Architecture
                  </h4>
                  <p className="text-sm text-gray-400">
                    Cloudflare
                    Pages/WorkersとSupabaseを組み合わせた、サーバーレスかつ低遅延・高セキュリティなインフラ構築。
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-black tracking-widest text-blue-500 uppercase">
                    04 / Fine-Tuning & Evaluation
                  </h4>
                  <p className="text-sm text-gray-400">
                    ビジネス要件に特化したLLMのファインチューニングおよび、エージェント出力の精度・安全性の継続的評価。
                  </p>
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
                  <p className="mb-2 text-xs font-black tracking-tighter text-white uppercase">
                    Intellectual Integrity
                  </p>
                  <p className="text-xs leading-relaxed text-gray-500">
                    プライバシー保護は単なる機能ではありません。
                    ユーザーの興味関心を追跡しないことは、私たちの「知的誠実さ」の証明です。
                  </p>
                </div>
                <div className="h-px bg-white/5" />
                <div>
                  <p className="mb-2 text-xs font-black tracking-tighter text-white uppercase">
                    Human-Centric Design
                  </p>
                  <p className="text-xs leading-relaxed text-gray-500">
                    AI
                    はあくまで手段。最終的な価値は、高い質の意思決定をいかに加速させ多く可能にすることにあります。
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/5 bg-black/40 p-8 backdrop-blur-xl">
              <h4 className="mb-6 text-[10px] font-black tracking-widest text-blue-500 uppercase">
                Operator Profile // 運営者情報
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-white">運営者: Ayato</p>
                  <p className="text-xs text-blue-400 font-bold">
                    AIフルスタックエンジニア
                  </p>
                </div>
                <div className="h-px bg-white/5" />
                <div>
                  <p className="text-xs leading-relaxed text-gray-400">
                    減算の美学に基づく自律型AIエージェント・分散バッチ基盤から、100%オフラインで動作するWindows専用AI議事録、数理金融バリュエーションエンジン（DCF×LLM）までを一貫して設計・開発。TypeScript/Next.jsとPython 3.12によるエッジファースト・極小コストなシステム構築を専門としています。
                  </p>
                </div>
                <div className="h-px bg-white/5" />
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Contact</p>
                    <a href="mailto:cwblog69@gmail.com" className="text-xs text-blue-400 hover:underline">
                      cwblog69@gmail.com
                    </a>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Track Record</p>
                    <a
                      href="https://crowdworks.jp/public/employees/6435014?ref=login_header"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      CrowdWorks 実績・プロフィール →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/reports" className="group relative block overflow-hidden rounded-3xl p-8">
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
