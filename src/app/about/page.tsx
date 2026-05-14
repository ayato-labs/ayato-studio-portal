import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'About Ayato Studio | Privacy-First Market Intelligence',
  description:
    'エージェント型AI（Agentic AI）開発の専門家が運営する、AIを駆使したインテリジェンス・プラットフォーム。AI開発の最前線から得られる知見とAIを活用してニッチな情報を配信します。',
};

export default function AboutPage() {
  return (
    <main className="bg-background min-h-screen overflow-x-hidden text-white selection:bg-blue-500/30">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(3,3,3,1)_100%)]" />

      <div className="container mx-auto max-w-5xl px-6 py-24 md:py-32">
        <div className="mb-16">
          <div className="mb-8 inline-flex items-center gap-3 text-xs font-bold tracking-[0.3em] text-blue-500 uppercase">
            <div className="h-px w-12 bg-blue-500/50" />
            Our Identity
          </div>
          <h1 className="mb-8 text-5xl leading-[0.9] font-black tracking-tighter md:text-8xl">
            REDESIGNING
            <br />
            <span className="inline-block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text py-2 text-transparent">
              INTELLIGENCE
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
          <div className="space-y-8 text-lg leading-relaxed font-medium text-gray-400 md:col-span-2">
            <p>
              Ayato Studio
              は、エージェント型AI（Agentic AI）開発の専門家が運営する、AIを駆使したインテリジェンス・プラットフォームです。
              AI開発の最前線から得られる知見とAIを活用して、マーケットの深層にあるニッチな情報を配信します。
            </p>

            <h2 className="mt-12 mb-6 text-2xl font-black tracking-tight text-white">
              なぜ、Ayato Studio なのか？
            </h2>

            <p>
              従来の分析サービスは、多くの場合、ユーザーの関心事項をクラウド上で追跡し、そのデータを三者配信に利用することで成り立っています。
              Ayato Studio はこの構造を否定し、**「Privacy-First」**を掲げています。
            </p>

            <p>
              私たちの AI
              インテリジェンス・エンジンは、分散化されたアーキテクチャを採用しており、極限までプライバシーに配慮したデータ処理を実現しています。
              あなたの戦略的な興味・関心が、広告主や第三者に漏れることはありません。
            </p>

            <div className="mt-12 rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8">
              <h3 className="mb-4 text-xl font-black text-white">Core Principles</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-4">
                  <span className="font-black text-blue-500">01</span>
                  <span>
                    <strong>AI-Driven Accuracy:</strong>{' '}
                    24時間365日、世界中のソースからノイズを排除し、独自のアルゴリズムで重要度をスコアリング。
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="font-black text-blue-500">02</span>
                  <span>
                    <strong>Data Sovereignty:</strong>{' '}
                    ユーザーの閲覧データは匿名化され、インテリジェンスの向上のみに使用されます。
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="font-black text-blue-500">03</span>
                  <span>
                    <strong>High-Density Content:</strong>{' '}
                    速報性だけでなく、文脈を重視した「構造化されたレポート」を提供。
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-12">
            <div className="glass rounded-3xl border border-white/5 p-8">
              <h4 className="mb-6 text-[10px] font-black tracking-widest text-gray-500 uppercase">
                Service Overview
              </h4>
              <div className="space-y-6">
                <div>
                  <p className="mb-1 text-xs font-black text-white uppercase">Founded</p>
                  <p className="text-sm font-medium text-blue-400">2026</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-black text-white uppercase">Core Focus</p>
                  <p className="text-sm font-medium text-blue-400">Deep-Tech / Clean-Energy</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-black text-white uppercase">Analysis Method</p>
                  <p className="text-sm font-medium text-blue-400">Generative Intelligence</p>
                </div>
              </div>
            </div>

            <Link
              href="/contact"
              className="group block rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8 transition-all hover:bg-blue-500/10"
            >
              <h4 className="mb-2 text-lg font-black text-white transition-colors group-hover:text-blue-400">
                Contact Us
              </h4>
              <p className="text-xs leading-relaxed text-gray-500 underline underline-offset-4">
                Get in touch for custom research inquiries &rarr;
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
