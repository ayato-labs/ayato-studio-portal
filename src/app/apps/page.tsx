import { Suspense } from 'react';
import { getAppsList, getLocalArticles } from '@/lib/local-content';
import Link from 'next/link';

export const metadata = {
  title: 'Applications - Ayato Studio',
  description:
    'AI駆動開発の専門家が運営する AI アプリケーション・エコシステム。最前線の知見を活用したニッチなツールを提供します。',
};

async function AppsList() {
  const apps = getAppsList();

  if (apps.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-medium text-gray-500">No applications found yet. Under construction.</p>
      </div>
    );
  }

  // Get first article for each app to show description/title
  const appsWithData = apps.map((appSlug) => {
    const articles = getLocalArticles(`apps/${appSlug}`);
    return {
      slug: appSlug,
      title: appSlug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      description: articles.length > 0 ? articles[0].description : 'Documentation and guides.',
      articleCount: articles.length,
    };
  });

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {appsWithData.map((app) => (
        <div key={app.slug} className="group relative">
          <Link
            href={`/apps/${app.slug}`}
            className="group block h-full rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 transition-all duration-500 hover:border-cyan-500/30"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500 transition-transform group-hover:scale-110">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </div>
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-cyan-400 uppercase">
                Application
              </span>
              <span className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                {app.articleCount} Docs
              </span>
            </div>
            <h3 className="mb-4 text-2xl font-black tracking-tight text-white uppercase transition-colors group-hover:text-cyan-400">
              {app.title}
            </h3>
            <p className="mb-8 line-clamp-3 text-sm leading-relaxed text-gray-500">
              {app.description}
            </p>
            <div className="mt-auto flex items-center text-xs font-black tracking-[0.2em] text-cyan-500 uppercase">
              Explore App{' '}
              <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function AppsPage() {
  return (
    <main className="bg-background min-h-screen py-20 selection:bg-cyan-500/30 selection:text-cyan-200 md:py-32">
      {/* Background Elements */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-cyan-600/10 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6">
        <div className="mb-20 max-w-4xl">
          <div className="glass mb-8 inline-flex items-center gap-2 rounded-full border-white/10 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] text-cyan-400/80 uppercase">
              Ayato Studio // App Ecosystem
            </span>
          </div>

          <h1 className="mb-8 text-6xl leading-none font-black tracking-tighter text-white md:text-8xl">
            INTELLIGENT
            <br />
            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              APPLICATIONS
            </span>
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed font-medium text-gray-500 md:text-2xl">
            AI開発の最前線から得られる知見とAIを活用して、
            <br />
            クリエイティビティを最大化するための専用ツールを配信します。
          </p>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="glass h-64 animate-pulse rounded-[2.5rem]" />
              <div className="glass h-64 animate-pulse rounded-[2.5rem]" />
              <div className="glass h-64 animate-pulse rounded-[2.5rem]" />
            </div>
          }
        >
          <AppsList />
        </Suspense>
      </div>
    </main>
  );
}
