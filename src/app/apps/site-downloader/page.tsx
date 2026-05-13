import { Suspense } from 'react';
import { getLocalArticles } from '@/lib/local-content';
import Link from 'next/link';

export const metadata = {
  title: 'Site Downloader - Ayato Studio',
  description: 'Site Downloader Chrome 拡張機能のドキュメント、デプロイガイド、利用方法。',
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
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {articles.map((article) => (
        <div key={article.slug} className="group relative">
          <Link
            href={`/apps/site-downloader/${article.slug}`}
            className="group block rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 transition-all duration-500 hover:border-cyan-500/30"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-cyan-400 uppercase">
                Site Downloader
              </span>
              <span className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                {new Date(article.date).toLocaleDateString()}
              </span>
            </div>
            <h3 className="mb-4 line-clamp-2 text-2xl leading-tight font-black text-white transition-colors group-hover:text-cyan-400 md:text-3xl">
              {article.title}
            </h3>
            <p className="mb-8 line-clamp-3 text-sm leading-relaxed text-gray-500">
              {article.description ||
                article.content.replace(/[#*`]/g, '').substring(0, 150) + '...'}
            </p>
            <div className="flex items-center text-xs font-black tracking-[0.2em] text-cyan-500 uppercase">
              Read Document{' '}
              <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function SiteDownloaderPage() {
  return (
    <main className="bg-background min-h-screen py-20 md:py-32">
      <div className="container mx-auto px-6">
        <div className="mb-20 max-w-4xl">
          <h1 className="mb-8 text-5xl leading-none font-black tracking-tighter text-white md:text-7xl">
            SITE
            <br />
            <span className="text-cyan-500">DOWNLOADER</span>
          </h1>
          <p className="mb-8 text-xl leading-relaxed font-medium text-gray-500">
            Web サイトを高速にダウンロード・保存するための
            <br className="hidden md:block" />
            Chrome 拡張機能のドキュメント・ガイドセンター。
          </p>
          <div className="flex gap-4">
            <Link
              href="/apps/site-downloader/privacy"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black tracking-widest text-gray-400 uppercase transition-all hover:bg-white/10 hover:text-white"
            >
              Privacy Policy
            </Link>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="animate-pulse font-black text-gray-700">Loading documentation...</div>
          }
        >
          <SiteDownloaderDocsList />
        </Suspense>
      </div>
    </main>
  );
}
