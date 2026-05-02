import { Suspense } from "react";
import { getAppsList, getLocalArticles } from "@/lib/local-content";
import Link from 'next/link';

export const metadata = {
  title: "Applications - Ayato Studio",
  description: "AI駆動開発の専門家が運営する AI アプリケーション・エコシステム。最前線の知見を活用したニッチなツールを提供します。",
};

async function AppsList() {
  const apps = getAppsList();

  if (apps.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500 font-medium">No applications found yet. Under construction.</p>
      </div>
    );
  }

  // Get first article for each app to show description/title
  const appsWithData = apps.map(appSlug => {
    const articles = getLocalArticles(`apps/${appSlug}`);
    return {
      slug: appSlug,
      title: appSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      description: articles.length > 0 ? articles[0].description : "Documentation and guides.",
      articleCount: articles.length
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {appsWithData.map((app) => (
        <div key={app.slug} className="relative group">
          <Link href={`/apps/${app.slug}`} className="block h-full p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all duration-500 group">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest">
                Application
              </span>
              <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                {app.articleCount} Docs
              </span>
            </div>
            <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors mb-4 uppercase tracking-tight">
              {app.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-8">
              {app.description}
            </p>
            <div className="mt-auto flex items-center text-cyan-500 text-xs font-black uppercase tracking-[0.2em]">
              Explore App <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function AppsPage() {
  return (
    <main className="min-h-screen bg-background py-20 md:py-32 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px] animate-pulse" />
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-20">
          <div className="glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-cyan-400/80">Ayato Studio // App Ecosystem</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-none">
            INTELLIGENT<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">APPLICATIONS</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl">
            AI開発の最前線から得られる知見とAIを活用して、<br />
            クリエイティビティを最大化するための専用ツールを配信します。
          </p>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-64 glass animate-pulse rounded-[2.5rem]" />
            <div className="h-64 glass animate-pulse rounded-[2.5rem]" />
            <div className="h-64 glass animate-pulse rounded-[2.5rem]" />
          </div>
        }>
          <AppsList />
        </Suspense>
      </div>
    </main>
  );
}
