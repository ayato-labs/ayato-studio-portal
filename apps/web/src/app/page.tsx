import { Suspense } from 'react';
import { fetchReports } from '@/lib/api';
import { getLocalArticles } from '@/lib/local-content';
import { Report } from '@/lib/types';
import LLMStatsDashboard from '@/components/features/stats/LLMStatsDashboard';
import Link from 'next/link';

export const revalidate = 60;

// Helper to check if a report is likely an arXiv paper
function isArxivReport(report: Report): boolean {
  const contentLower = report.content.toLowerCase();
  const titleLower = report.title.toLowerCase();
  return (
    titleLower.includes('arxiv') ||
    titleLower.includes('論文') ||
    contentLower.includes('arxiv') ||
    contentLower.includes('abstract') ||
    contentLower.includes('doi')
  );
}

// 1. radicaldatascience風の簡潔な箇条書きニュースボード (Bulletin Board)
function NewsBulletinBoard({ reports }: { reports: Report[] }) {
  // Filter for reports that are not primarily paper logs, or just show the newest ones
  const newsReports = reports.filter((r) => !isArxivReport(r)).slice(0, 3);

  return (
    <div className="space-y-6">
      {newsReports.map((report) => (
        <div
          key={report.id}
          className="group rounded-3xl border border-white/5 bg-white/[0.01] p-8 transition-all duration-300 hover:border-blue-500/20 hover:bg-white/[0.03]"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[9px] font-black tracking-widest text-blue-400 uppercase">
              AI NEWS BRIEF
            </span>
            <span className="text-[10px] font-bold tracking-wider text-gray-500">
              {new Date(report.timestamp).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <h4 className="mb-4 text-xl font-black text-white transition-colors group-hover:text-blue-400">
            {report.title}
          </h4>
          <div className="prose prose-invert line-clamp-4 max-w-none text-sm leading-relaxed text-gray-400">
            {/* Displaying raw text summary */}
            {report.content.replace(/#+\s+.*?\n/g, '').replace(/\[.*?\]\(.*?\)/g, '')}
          </div>
          <div className="mt-6 flex justify-end">
            <Link
              href={`/reports/${report.slug}`}
              className="text-[10px] font-black tracking-widest text-blue-500 uppercase transition-colors hover:text-blue-400"
            >
              Read full report →
            </Link>
          </div>
        </div>
      ))}
      {newsReports.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/10 py-12 text-center text-xs font-bold tracking-widest text-gray-600 uppercase">
          本日のAIニュース速報はありません。
        </div>
      )}
    </div>
  );
}

// 2. arxiv.org風の日本語要約付き論文リスト (arXiv/recent)
function ArxivPapersSection({ reports }: { reports: Report[] }) {
  const paperReports = reports.filter(isArxivReport).slice(0, 4);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {paperReports.map((report) => (
        <Link
          key={report.id}
          href={`/reports/${report.slug}`}
          className="group flex flex-col justify-between rounded-3xl border border-white/5 bg-white/[0.01] p-8 transition-all duration-300 hover:border-blue-500/20 hover:bg-white/[0.03]"
        >
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[9px] font-black tracking-widest text-indigo-400 uppercase">
                arXiv.org / cs.AI
              </span>
              <span className="text-[10px] font-bold text-gray-500">
                {new Date(report.timestamp).toLocaleDateString('ja-JP')}
              </span>
            </div>
            <h4 className="mb-4 line-clamp-2 text-lg font-black text-white transition-colors group-hover:text-blue-400">
              {report.title}
            </h4>
            <p className="line-clamp-3 text-xs leading-relaxed text-gray-400">
              {report.content.replace(/#+\s+.*?\n/g, '').substring(0, 180)}...
            </p>
          </div>
          <div className="mt-8 flex items-center text-[10px] font-black tracking-widest text-gray-500 uppercase transition-colors group-hover:text-blue-500">
            論文要約・解説を読む{' '}
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </Link>
      ))}
      {paperReports.length === 0 && (
        <div className="col-span-2 rounded-3xl border border-dashed border-white/10 py-12 text-center text-xs font-bold tracking-widest text-gray-600 uppercase">
          新着論文データがありません。
        </div>
      )}
    </div>
  );
}

async function MainAIContent() {
  const flowReports = await fetchReports();
  const stockArticles = getLocalArticles('insights');

  return (
    <div className="space-y-32">
      {/* 1. radicaldatascience風の簡潔な箇条書きニュースボード */}
      <section>
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="mb-2 text-xs font-black tracking-[0.5em] text-blue-500 uppercase">
              Section 01 // Daily Bulletin
            </h2>
            <h3 className="text-4xl font-black tracking-tighter text-white uppercase md:text-5xl">
              AI News Bulletin Board
            </h3>
          </div>
          <Link
            href="/reports"
            className="text-[10px] font-black tracking-widest text-gray-500 uppercase transition-colors hover:text-white"
          >
            All Briefs →
          </Link>
        </div>
        <NewsBulletinBoard reports={flowReports} />
      </section>

      {/* 2. llm-stats風の統計比較ダッシュボード */}
      <section>
        <div className="mb-12">
          <h2 className="mb-2 text-xs font-black tracking-[0.5em] text-blue-500 uppercase">
            Section 02 // Stats & Costs
          </h2>
          <h3 className="text-4xl font-black tracking-tighter text-white uppercase md:text-5xl">
            LLM Benchmark Statistics
          </h3>
        </div>
        <LLMStatsDashboard />
      </section>

      {/* 3. arxiv.org風の日本語要約付き論文リスト */}
      <section>
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="mb-2 text-xs font-black tracking-[0.5em] text-blue-500 uppercase">
              Section 03 // arXiv Papers
            </h2>
            <h3 className="text-4xl font-black tracking-tighter text-white uppercase md:text-5xl">
              Latest AI Research
            </h3>
          </div>
          <Link
            href="/reports"
            className="text-[10px] font-black tracking-widest text-gray-500 uppercase transition-colors hover:text-white"
          >
            All Papers →
          </Link>
        </div>
        <ArxivPapersSection reports={flowReports} />
      </section>

      {/* 4. Human Written deep articles */}
      <section>
        <div className="mb-12">
          <h2 className="mb-2 text-xs font-black tracking-[0.5em] text-blue-500 uppercase">
            Section 04 // Technical Stock
          </h2>
          <h3 className="text-4xl font-black tracking-tighter text-white uppercase md:text-5xl">
            Technical Insights
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {stockArticles.slice(0, 3).map((article) => (
            <Link
              key={article.slug}
              href={`/insights/${article.slug}`}
              className="group flex flex-col justify-between rounded-3xl border border-white/5 bg-white/[0.01] p-8 transition-all duration-300 hover:border-blue-500/20 hover:bg-white/[0.03]"
            >
              <div>
                <span className="mb-4 inline-block text-[9px] font-black tracking-widest text-indigo-400 uppercase">
                  {article.category || 'Opinion'}
                </span>
                <h4 className="mb-4 line-clamp-2 text-xl font-black text-white transition-colors group-hover:text-blue-400">
                  {article.title}
                </h4>
                <p className="line-clamp-3 text-xs leading-relaxed text-gray-500">
                  {article.description}
                </p>
              </div>
              <div className="mt-8 flex items-center text-[10px] font-black tracking-widest text-gray-500 uppercase transition-colors group-hover:text-blue-500">
                Read Article{' '}
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <main className="bg-background relative min-h-screen overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200">
      {/* Ambient background blur */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-blue-600/5 blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-6xl px-6 pt-32 pb-40 md:pt-48">
        {/* --- Hero Section --- */}
        <section className="mb-48">
          <div className="mb-12 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
            <span className="text-[10px] font-black tracking-[0.3em] text-blue-400 uppercase">
              Ayato Studio / AI Native Engineering
            </span>
          </div>

          <h1 className="mb-16 text-6xl leading-[0.85] font-black tracking-tighter text-white uppercase md:text-[8rem]">
            AI NATIVE
            <br />
            <span className="text-blue-600">SYSTEMS</span>
          </h1>

          <div className="max-w-2xl">
            <p className="mb-12 text-xl leading-snug font-medium text-gray-400 md:text-2xl">
              AIが存在することを前提とした、 自律的エージェント・MCP（Model Context Protocol）連携・
              エッジファーストなAIネイティブシステム構築と インテグレーションの専門技術スタジオ。
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <Link
                href="/news"
                className="rounded-full bg-cyan-500 px-8 py-4 font-black tracking-widest text-black uppercase transition-all hover:bg-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/30"
              >
                Live AI News →
              </Link>
              <Link
                href="/reports"
                className="rounded-full border border-white/10 bg-white/5 px-8 py-4 font-black tracking-widest text-white uppercase transition-all hover:bg-white/10"
              >
                Reports
              </Link>
              <Link
                href="/stats"
                className="rounded-full border border-white/10 bg-white/5 px-8 py-4 font-black tracking-widest text-white uppercase transition-all hover:bg-white/10"
              >
                LLM Stats
              </Link>
            </div>
          </div>
        </section>

        {/* --- AI Specialized Sections --- */}
        <Suspense fallback={<div className="h-96 animate-pulse rounded-[2rem] bg-white/5" />}>
          <MainAIContent />
        </Suspense>

        {/* Footer */}
        <footer className="mt-64 border-t border-white/5 pt-20">
          <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black tracking-[0.4em] text-gray-600 uppercase">
                Ayato Studio AI Intelligence Hub
              </p>
              <p className="mt-2 text-[10px] font-black tracking-[0.2em] text-gray-800 uppercase">
                © 2026 Professional AI Engineering
              </p>
            </div>
            <div className="flex gap-12">
              <Link
                href="/privacy"
                className="text-[10px] font-black tracking-widest text-gray-700 uppercase transition-colors hover:text-blue-500"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-[10px] font-black tracking-widest text-gray-700 uppercase transition-colors hover:text-blue-500"
              >
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
