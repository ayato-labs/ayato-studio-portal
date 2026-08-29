import { Suspense } from 'react';
import { getLocalArticles } from '@/lib/local-content';
import Link from 'next/link';

export const metadata = {
  title: 'Academy - Ayato Studio',
  description:
    'AIを実務で活用するための基礎数学、理論、最新のハック手法を学ぶための教育セクション。',
};

async function AcademyList() {
  const articles = getLocalArticles('academy');

  if (articles.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">No lessons found yet. Under construction.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {articles.map((article) => (
        <div key={article.slug} className="group relative">
          <Link
            href={`/academy/${article.slug}`}
            className="group block rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 transition-all duration-500 hover:border-blue-500/30"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-indigo-400 uppercase">
                Academy Series
              </span>
              <span className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                {new Date(article.date).toLocaleDateString()}
              </span>
            </div>
            <h3 className="mb-4 line-clamp-2 text-2xl leading-tight font-black text-white transition-colors group-hover:text-indigo-400 md:text-3xl">
              {article.title}
            </h3>
            <p className="mb-8 line-clamp-3 text-sm leading-relaxed text-gray-500">
              {article.description ||
                article.content.replace(/[#*`]/g, '').substring(0, 150) + '...'}
            </p>
            <div className="flex items-center text-xs font-black tracking-[0.2em] text-indigo-500 uppercase">
              Start Learning{' '}
              <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function AcademyPage() {
  return (
    <main className="bg-background min-h-screen py-20 md:py-32">
      <div className="container mx-auto px-6">
        <div className="mb-20 max-w-4xl">
          <h1 className="mb-8 text-5xl leading-none font-black tracking-tighter text-white md:text-7xl">
            AYATO
            <br />
            <span className="text-indigo-500">ACADEMY</span>
          </h1>
          <p className="text-xl leading-relaxed font-medium text-gray-500">
            「計算できる」だけでなく「本質を理解する」。
            <br className="hidden md:block" />
            AIエンジニアに必須の数学的素養と、次世代のハック手法を紐解くアカデミー。
          </p>
        </div>

        <Suspense
          fallback={
            <div className="animate-pulse font-black text-gray-700">Initializing curriculum...</div>
          }
        >
          <AcademyList />
        </Suspense>
      </div>
    </main>
  );
}
