import { Suspense } from "react";
import { getLocalArticles } from "@/lib/local-content";
import Link from 'next/link';

export const metadata = {
  title: "Site Downloader - Ayato Studio",
  description: "Site Downloader Chrome 拡張機能のドキュメント、デプロイガイド、利用方法。",
};

async function SiteDownloaderDocsList() {
  const articles = getLocalArticles('apps/site-downloader');

  if (articles.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">No documentation found yet. Under construction.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {articles.map((article) => (
        <div key={article.slug} className="relative group">
            <Link href={`/apps/site-downloader/${article.slug}`} className="block p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all duration-500 group">
                <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest">
                        Site Downloader
                    </span>
                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                        {new Date(article.date).toLocaleDateString()}
                    </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-cyan-400 transition-colors mb-4 line-clamp-2 leading-tight">
                    {article.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-8">
                    {article.description || article.content.replace(/[#*`]/g, '').substring(0, 150) + "..."}
                </p>
                <div className="flex items-center text-cyan-500 text-xs font-black uppercase tracking-[0.2em]">
                    Read Document <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
            </Link>
        </div>
      ))}
    </div>
  );
}

export default function SiteDownloaderPage() {
  return (
    <main className="min-h-screen bg-background py-20 md:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-20">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-none">
            SITE<br />
            <span className="text-cyan-500">DOWNLOADER</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed mb-8">
            Web サイトを高速にダウンロード・保存するための<br className="hidden md:block" />
            Chrome 拡張機能のドキュメント・ガイドセンター。
          </p>
          <div className="flex gap-4">
            <Link 
              href="/apps/site-downloader/privacy" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              Privacy Policy
            </Link>
          </div>
        </div>

        <Suspense fallback={<div className="animate-pulse text-gray-700 font-black">Loading documentation...</div>}>
          <SiteDownloaderDocsList />
        </Suspense>
      </div>
    </main>
  );
}
