import { Metadata } from 'next';
import LLMStatsDashboard from '@/components/features/stats/LLMStatsDashboard';

export const metadata: Metadata = {
  title: 'LLM Performance & Cost Statistics | Ayato Studio',
  description: '国内外の主要LLM（Large Language Models）の日本語性能ベンチマーク、推論速度、およびAPIコストに関する定量的な統計比較ダッシュボード。',
};

export default function StatsPage() {
  return (
    <main className="bg-background relative min-h-screen overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Decorator */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-blue-600/5 blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 pt-32 pb-40 md:pt-48 max-w-6xl">
        {/* Breadcrumb / Label */}
        <div className="mb-12 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-[10px] font-black tracking-[0.3em] text-blue-400 uppercase">
            Data Analytics Layer
          </span>
        </div>

        {/* Hero title */}
        <div className="mb-20 max-w-3xl">
          <h1 id="stats-title" className="mb-8 text-5xl leading-none font-black tracking-tighter text-white md:text-7xl uppercase">
            LLM BENCHMARK &<br />
            <span className="text-blue-600">COST STATISTICS</span>
          </h1>
          <p className="text-lg leading-relaxed text-gray-400">
            モデル開発元から提供されている公式仕様、および独立したベンチマーク（LMSYS Arena、JGLUEなど）から得られたデータを統合。
            日本語環境下における実用的な効率性とコストパフォーマンスを可視化します。
          </p>
        </div>

        {/* Dashboard Component */}
        <LLMStatsDashboard />
      </div>
    </main>
  );
}
