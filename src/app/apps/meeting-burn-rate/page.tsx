import { getLocalArticles } from '@/lib/local-content';
import Markdown from 'react-markdown';

export const metadata = {
  title: 'Meeting Burn Rate - Ayato Studio',
  description: '会議のコストをリアルタイムで算出するブラックジョーク・メーターのドキュメントと利用方法。',
};

export default function MeetingBurnRatePage() {
  const articles = getLocalArticles('apps/meeting-burn-rate');
  const mainArticle = articles.length > 0 ? articles[0] : null;

  return (
    <main className="bg-background min-h-screen py-20 md:py-32 text-white">
      {/* Background Elements */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-red-600/10 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-12">
          <div className="glass mb-8 inline-flex items-center gap-2 rounded-full border-white/10 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] text-red-400/80 uppercase">
              Ayato Studio // Solutions & Apps
            </span>
          </div>

          <h1 className="mb-6 text-5xl leading-none font-black tracking-tighter text-white md:text-7xl">
            MEETING BURN RATE
          </h1>
          <p className="mb-8 text-xl leading-relaxed font-medium text-gray-500">
            会議のコストをリアルタイムで可視化し、組織の生産性を監査するシミュレーションツール。
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/ayato-labs/meeting-burn-rate"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-red-500/20 transition-all hover:bg-red-500"
            >
              GitHub Repository
            </a>
          </div>
        </div>

        {/* Content */}
        {mainArticle ? (
          <div className="rounded-[3rem] border border-white/5 bg-black/40 p-8 shadow-2xl backdrop-blur-3xl md:p-16">
            <div className="prose prose-invert prose-red prose-headings:font-black prose-headings:tracking-tight prose-p:text-gray-300 prose-p:leading-relaxed max-w-none">
              <Markdown>{mainArticle.content}</Markdown>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-xs font-bold tracking-widest text-gray-600 uppercase border border-dashed border-white/10 rounded-3xl">
            ドキュメントファイルがありません。
          </div>
        )}
      </div>
    </main>
  );
}
