import { Suspense } from "react";
import { getLocalArticles } from "@/lib/local-content";
import Link from 'next/link';

export const metadata = {
  title: "Gmail Protector - Ayato Studio",
  description: "Gmail Protector Chrome 拡張機能のドキュメント、デプロイガイド、利用方法。",
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {articles.map((article) => (
        <div key={article.slug} className="relative group">
            <Link href={`/apps/gmail-protector/${article.slug}`} className="block p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all duration-500 group">
                <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                        Gmail Protector
                    </span>
                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                        {new Date(article.date).toLocaleDateString()}
                    </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-blue-400 transition-colors mb-4 line-clamp-2 leading-tight">
                    {article.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-8">
                    {article.description || article.content.replace(/[#*`]/g, '').substring(0, 150) + "..."}
                </p>
                <div className="flex items-center text-blue-500 text-xs font-black uppercase tracking-[0.2em]">
                    Read Document <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
            </Link>
        </div>
      ))}
    </div>
  );
}

export default function GmailProtectorPage() {
  return (
    <main className="min-h-screen bg-background py-20 md:py-32">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-20">
          <div className="glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-400/80">Ayato Studio // Security Apps</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-none">
            GMAIL<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">PROTECTOR</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed mb-8">
            Gmail の送信内容を AI で守るための<br className="hidden md:block" />
            次世代セキュリティ拡張機能のドキュメントセンター。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/apps/gmail-protector/privacy" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/apps/gmail-protector/terms" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              Terms of Service
            </Link>
          </div>
        </div>

        <Suspense fallback={<div className="animate-pulse text-gray-700 font-black tracking-widest uppercase">Loading documentation...</div>}>
          <GmailProtectorDocsList />
        </Suspense>
      </div>
    </main>
  );
}
