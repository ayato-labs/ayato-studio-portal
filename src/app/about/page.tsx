import React from "react";
import Link from "next/link";

export const metadata = {
  title: "About Ayato Studio | Privacy-First Market Intelligence",
  description: "AI駆動開発の専門家が運営する、AIを駆使したインテリジェンス・プラットフォーム。AI開発の最前線から得られる知見とAIを活用してニッチな情報を配信します。",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-white selection:bg-blue-500/30 overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(3,3,3,1)_100%)]" />

      <div className="container mx-auto px-6 py-24 md:py-32 max-w-5xl">
        <div className="mb-16">
          <div className="inline-flex items-center gap-3 text-blue-500 font-bold text-xs uppercase tracking-[0.3em] mb-8">
            <div className="h-px w-12 bg-blue-500/50" />
            Our Identity
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
            REDESIGNING<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 inline-block py-2">INTELLIGENCE</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="md:col-span-2 space-y-8 text-lg text-gray-400 leading-relaxed font-medium">
            <p>
              Ayato Studio は、AI駆動開発の専門家が運営する、AIを駆使したインテリジェンス・プラットフォームです。
              AI開発の最前線から得られる知見とAIを活用して、マーケットの深層にあるニッチな情報を配信します。
            </p>
            
            <h2 className="text-2xl font-black text-white tracking-tight mt-12 mb-6">
              なぜ、Ayato Studio なのか？
            </h2>
            
            <p>
              従来の分析サービスは、多くの場合、ユーザーの関心事項をクラウド上で追跡し、そのデータを三者配信に利用することで成り立っています。
              Ayato Studio はこの構造を否定し、**「Privacy-First」**を掲げています。
            </p>
            
            <p>
              私たちの AI インテリジェンス・エンジンは、分散化されたアーキテクチャを採用しており、極限までプライバシーに配慮したデータ処理を実現しています。
              あなたの戦略的な興味・関心が、広告主や第三者に漏れることはありません。
            </p>

            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 mt-12">
              <h3 className="text-xl font-black text-white mb-4">Core Principles</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-4">
                  <span className="text-blue-500 font-black">01</span>
                  <span><strong>AI-Driven Accuracy:</strong> 24時間365日、世界中のソースからノイズを排除し、独自のアルゴリズムで重要度をスコアリング。</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-500 font-black">02</span>
                  <span><strong>Data Sovereignty:</strong> ユーザーの閲覧データは匿名化され、インテリジェンスの向上のみに使用されます。</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-500 font-black">03</span>
                  <span><strong>High-Density Content:</strong> 速報性だけでなく、文脈を重視した「構造化されたレポート」を提供。</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-12">
            <div className="glass p-8 rounded-3xl border border-white/5">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-6">Service Overview</h4>
                <div className="space-y-6">
                    <div>
                        <p className="text-xs font-black text-white mb-1 uppercase">Founded</p>
                        <p className="text-sm font-medium text-blue-400">2026</p>
                    </div>
                    <div>
                        <p className="text-xs font-black text-white mb-1 uppercase">Core Focus</p>
                        <p className="text-sm font-medium text-blue-400">Deep-Tech / Clean-Energy</p>
                    </div>
                    <div>
                        <p className="text-xs font-black text-white mb-1 uppercase">Analysis Method</p>
                        <p className="text-sm font-medium text-blue-400">Generative Intelligence</p>
                    </div>
                </div>
            </div>

            <Link 
              href="/contact"
              className="group block p-8 rounded-3xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-all"
            >
              <h4 className="font-black text-white mb-2 group-hover:text-blue-400 transition-colors text-lg">Contact Us</h4>
              <p className="text-xs text-gray-500 leading-relaxed underline underline-offset-4">Get in touch for custom research inquiries &rarr;</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
