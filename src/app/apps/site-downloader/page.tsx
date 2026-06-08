import { getLocalArticles } from '@/lib/local-content';
import Link from 'next/link';
import Markdown from 'react-markdown';

export const metadata = {
  title: 'Site Downloader - Ayato Studio',
  description: 'Site Downloader Chrome 拡張機能のドキュメント、デプロイガイド、利用方法。',
};

export default function SiteDownloaderPage() {
  const articles = getLocalArticles('apps/site-downloader');
  const mainArticle = articles.length > 0 ? articles[0] : null;

  return (
    <main className="bg-background min-h-screen py-20 md:py-32 text-white">
      {/* Background Elements */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-cyan-600/10 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-12">
          <div className="glass mb-8 inline-flex items-center gap-2 rounded-full border-white/10 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] text-cyan-400/80 uppercase">
              Ayato Studio // Solutions & Apps
            </span>
          </div>

          <h1 className="mb-6 text-5xl leading-none font-black tracking-tighter text-white md:text-7xl">
            SITE DOWNLOADER
          </h1>
          <p className="mb-8 text-xl leading-relaxed font-medium text-gray-500">
            Web サイトを高速にダウンロード・保存し、ローカルやエッジで動作可能なアセットとして切り出す Chrome 拡張機能。
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/ayato-labs/site-downloader"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-cyan-500/20 transition-all hover:bg-cyan-500"
            >
              GitHub Repository
            </a>
            <Link
              href="/apps/site-downloader/privacy"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-black tracking-widest text-gray-400 uppercase transition-all hover:bg-white/10 hover:text-white"
            >
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Content */}
        {mainArticle ? (
          <div className="rounded-[3rem] border border-white/5 bg-black/40 p-8 shadow-2xl backdrop-blur-3xl md:p-16">
            <div className="prose prose-invert prose-blue prose-headings:font-black prose-headings:tracking-tight prose-p:text-gray-300 prose-p:leading-relaxed max-w-none">
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
