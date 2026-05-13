import { Suspense } from 'react';
import { getLocalArticles } from '@/lib/local-content';
import Link from 'next/link';

export const metadata = {
  title: 'Gmail Protector - Ayato Studio',
  description: 'Gmail Protector Chrome 拡張機能のドキュメント、デプロイガイド、利用方法。',
};

async function GmailProtectorDocsList() {
  const articles = getLocalArticles('apps/gmail-protector');

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
            href={`/apps/gmail-protector/${article.slug}`}
            className="group block rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 transition-all duration-500 hover:border-blue-500/30"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-blue-400 uppercase">
                Gmail Protector
              </span>
              <span className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                {new Date(article.date).toLocaleDateString()}
              </span>
            </div>
            <h3 className="mb-4 line-clamp-2 text-2xl leading-tight font-black text-white transition-colors group-hover:text-blue-400 md:text-3xl">
              {article.title}
            </h3>
            <p className="mb-8 line-clamp-3 text-sm leading-relaxed text-gray-500">
              {article.description ||
                article.content.replace(/[#*`]/g, '').substring(0, 150) + '...'}
            </p>
            <div className="flex items-center text-xs font-black tracking-[0.2em] text-blue-500 uppercase">
              Read Document{' '}
              <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function GmailProtectorPage() {
  return (
    <main className="bg-background min-h-screen py-20 md:py-32">
      {/* Background Elements */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6">
        <div className="mb-20 max-w-4xl">
          <div className="glass mb-8 inline-flex items-center gap-2 rounded-full border-white/10 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] text-blue-400/80 uppercase">
              Ayato Studio // Security Apps
            </span>
          </div>

          <h1 className="mb-8 text-5xl leading-none font-black tracking-tighter text-white md:text-7xl">
            GMAIL
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              PROTECTOR
            </span>
          </h1>
          <p className="mb-8 text-xl leading-relaxed font-medium text-gray-500">
            Gmail の送信内容を AI で守るための
            <br className="hidden md:block" />
            次世代セキュリティ拡張機能のドキュメントセンター。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/apps/gmail-protector/privacy"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500"
            >
              Privacy Policy
            </Link>
            <Link
              href="/apps/gmail-protector/terms"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-black tracking-widest text-gray-400 uppercase transition-all hover:bg-white/10 hover:text-white"
            >
              Terms of Service
            </Link>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="animate-pulse font-black tracking-widest text-gray-700 uppercase">
              Loading documentation...
            </div>
          }
        >
          <GmailProtectorDocsList />
        </Suspense>
      </div>
    </main>
  );
}
