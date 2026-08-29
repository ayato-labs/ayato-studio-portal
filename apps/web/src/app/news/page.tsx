import { Suspense } from 'react';
import { getGlobalAiNews } from '@/lib/news';
import { NewsFeed } from '@/components/features/news/NewsFeed';

export const metadata = {
  title: 'Global AI News & Research Feed - Ayato Studio',
  description:
    'Real-time worldwide AI news, model releases, arXiv research papers, and open-source updates curated via Google Gemma AI.',
};

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

async function NewsContent() {
  const newsItems = await getGlobalAiNews(150);
  return <NewsFeed initialNews={newsItems} />;
}

export default function GlobalAiNewsPage() {
  return (
    <main className="bg-background min-h-screen py-16 selection:bg-cyan-500/30 selection:text-cyan-200 md:py-24">
      {/* Background glow accent */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-5%] right-[-5%] h-[35%] w-[35%] animate-pulse rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute bottom-[10%] left-[-5%] h-[30%] w-[30%] rounded-full bg-purple-600/10 blur-[140px]" />
      </div>

      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        {/* Page Header */}
        <div className="mb-12 space-y-4">
          <div className="glass inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-1 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] text-cyan-400 uppercase">
              Global Intelligence // Gemma Curated
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
            GLOBAL{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              AI NEWS
            </span>
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
            Worldwide daily breakthroughs, arXiv research papers, open-source model releases, and infrastructure updates curated continuously.
          </p>
        </div>

        {/* Live Feed Component */}
        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="h-10 w-full animate-pulse rounded-2xl bg-white/[0.03]" />
              <div className="h-96 w-full animate-pulse rounded-3xl bg-white/[0.02]" />
            </div>
          }
        >
          <NewsContent />
        </Suspense>
      </div>
    </main>
  );
}
