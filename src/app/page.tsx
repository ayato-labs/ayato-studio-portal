/**
 * Ayato Studio Portal
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Suspense } from 'react';
import { fetchReports } from '@/lib/api';
import { getLocalArticles, getAppsList } from '@/lib/local-content';
import { LocalArticle } from '@/lib/types';
import ReportCard from '@/components/features/reports/ReportCard';
import { NoteFeedSection } from '@/components/features/blog/NoteFeedSection';
import Link from 'next/link';

export const revalidate = 60;

// Home Page - Ayato Studio Intelligence Portal

async function ServicesSection() {
  const services = getLocalArticles('services').slice(0, 3);

  return (
    <div className="mb-32 grid grid-cols-1 gap-8 md:grid-cols-3">
      {services.map((service: LocalArticle) => (
        <Link
          key={service.slug}
          href={`/services/${service.slug}`}
          className="group rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 transition-all duration-500 hover:border-blue-500/30"
        >
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 transition-transform group-hover:scale-110">
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
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.285a2 2 0 01-1.963 0l-.628-.285a6 6 0 00-3.86-.517l-2.387.477a2 2 0 00-1.022.547V18.14a2 2 0 001.022.547l2.387.477a6 6 0 003.86-.517l.628-.285a2 2 0 011.963 0l.628.285a6 6 0 003.86.517l2.387.477a2 2 0 001.022-.547V15.428z"
              />
            </svg>
          </div>
          <h4 className="mb-3 text-xl font-black tracking-tight text-white uppercase transition-colors group-hover:text-blue-400">
            {service.title.split(' - ')[0]}
          </h4>
          <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
            {service.description}
          </p>
        </Link>
      ))}
    </div>
  );
}

async function AppsSection() {
  const apps = getAppsList().slice(0, 3);

  return (
    <div className="mb-32 grid grid-cols-1 gap-8 md:grid-cols-3">
      {apps.map((appSlug: string) => {
        const articles = getLocalArticles(`apps/${appSlug}`);
        const title = appSlug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        const description =
          articles.length > 0 ? articles[0].description : 'Documentation and guides.';

        return (
          <Link
            key={appSlug}
            href={`/apps/${appSlug}`}
            className="group rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 transition-all duration-500 hover:border-cyan-500/30"
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
            <h4 className="mb-3 text-xl font-black tracking-tight text-white uppercase transition-colors group-hover:text-cyan-400">
              {title}
            </h4>
            <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">{description}</p>
          </Link>
        );
      })}
    </div>
  );
}

async function FeaturedBlogSection() {
  const aiReports = await fetchReports();
  const weekly = aiReports.filter((r) => r.category === 'Weekly').slice(0, 1);
  const local = getLocalArticles('blog').slice(0, 1);

  const featured: Array<{
    id?: string;
    slug: string;
    title: string;
    type: string;
    href: string;
    timestamp: string;
  }> = [
    ...weekly.map((r) => ({
      ...r,
      type: 'Weekly Review',
      href: `/reports/${r.slug}`,
      timestamp: r.timestamp,
    })),
    ...local.map((l: LocalArticle) => ({
      ...l,
      type: 'Human Insight',
      href: `/blog/${l.slug}`,
      timestamp: l.date,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="mb-32 grid grid-cols-1 gap-12 md:grid-cols-2">
      {featured.map((item) => (
        <Link
          key={item.id || item.slug}
          href={item.href}
          className="group relative aspect-[16/9] overflow-hidden rounded-[3rem] border border-white/5 bg-white/[0.02] md:aspect-auto"
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 z-20 w-full p-10">
            <span className="mb-4 inline-block rounded-full bg-blue-500 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase">
              {item.type}
            </span>
            <h3 className="mb-4 line-clamp-2 text-2xl leading-tight font-black text-white transition-colors group-hover:text-blue-400 md:text-4xl">
              {item.title}
            </h3>
            <div className="flex items-center text-xs font-black tracking-widest text-blue-500 uppercase">
              Read Analysis{' '}
              <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

async function ReportsSection() {
  const reports = await fetchReports();
  const fastNews = reports.filter((r) => r.category !== 'Weekly');

  const techReports = fastNews.filter((r) => (r.market || '').toLowerCase() === 'tech').slice(0, 3);
  const financeReports = fastNews
    .filter((r) => (r.market || '').toLowerCase() === 'finance')
    .slice(0, 3);
  const energyReports = fastNews
    .filter((r) => (r.market || '').toLowerCase() === 'energy')
    .slice(0, 3);

  const sections = [
    {
      title: 'Digital Frontier',
      subtitle: 'Tech & AI Research',
      items: techReports,
      color: 'text-blue-500',
      border: 'border-blue-500/10',
    },
    {
      title: 'Strategic Finance',
      subtitle: 'Market & Economy',
      items: financeReports,
      color: 'text-amber-500',
      border: 'border-amber-500/10',
    },
    {
      title: 'Energy Paradigm',
      subtitle: 'Resource & Sustainability',
      items: energyReports,
      color: 'text-emerald-500',
      border: 'border-emerald-500/10',
    },
  ].filter((s) => s.items.length > 0);

  if (sections.length === 0) return null;

  return (
    <div className="space-y-32">
      {sections.map((section) => (
        <div key={section.title} className="relative">
          <div className="mb-12 flex items-center gap-6">
            <div
              className={`h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent`}
            />
            <div className="flex flex-col items-center px-8 text-center">
              <span
                className={`text-[10px] font-black tracking-[0.4em] uppercase ${section.color} mb-2`}
              >
                {section.subtitle}
              </span>
              <h3 className="text-2xl font-black tracking-tighter text-white uppercase md:text-4xl">
                {section.title}
              </h3>
            </div>
            <div
              className={`h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent`}
            />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {section.items.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="bg-background relative min-h-screen overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Elements */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="animation-delay-2000 absolute right-[-5%] bottom-[10%] h-[35%] w-[35%] animate-pulse rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 pt-20 md:pt-40">
        {/* --- Hero Section --- */}
        <div className="relative mb-32">
          <div className="glass mb-8 inline-flex items-center gap-2 rounded-full border-white/10 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] text-blue-400/80 uppercase">
              Ayato Studio // Core Systems Online
            </span>
          </div>

          <h1 className="mb-12 text-6xl leading-[0.8] font-black tracking-tighter text-white md:text-9xl">
            LIBERATION
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              FROM TOIL
            </span>
          </h1>

          <div className="max-w-3xl">
            <p className="mb-12 text-xl leading-tight font-medium tracking-tight text-gray-400 md:text-3xl">
              AI駆動開発の専門家が運営する、AIを駆使したインテリジェンス・プラットフォーム。
              <br />
              Ayato Studio は、AI開発の最前線から得られる知見と
              <br />
              AIを活用してニッチな情報を配信します。
            </p>
            <div className="flex gap-4">
              <Link
                href="/blog"
                className="rounded-full bg-blue-600 px-8 py-4 font-black tracking-widest text-white uppercase transition-colors hover:bg-blue-700"
              >
                View Blog
              </Link>
              <Link
                href="/reports"
                className="glass rounded-full border-white/10 px-8 py-4 font-black tracking-widest text-white uppercase transition-colors hover:bg-white/5"
              >
                Latest reports
              </Link>
            </div>
          </div>
        </div>

        {/* --- Tier 4: Applications (Ecosystem) --- */}
        <section className="mb-40">
          <div className="mb-12 flex flex-col">
            <h2 className="mb-2 text-xs font-black tracking-[0.4em] text-cyan-500 uppercase">
              Tier 04 // Ecosystem
            </h2>
            <span className="text-3xl font-black tracking-tight text-white uppercase md:text-5xl">
              Intelligent Apps
            </span>
          </div>
          <Suspense fallback={<div className="glass h-40 animate-pulse rounded-[2.5rem]" />}>
            <AppsSection />
          </Suspense>
        </section>

        {/* --- Tier 3: Services (Portfolio) --- */}
        <section className="mb-40">
          <div className="mb-12 flex flex-col">
            <h2 className="mb-2 text-xs font-black tracking-[0.4em] text-blue-500 uppercase">
              Tier 03 // Portfolio
            </h2>
            <span className="text-3xl font-black tracking-tight text-white uppercase md:text-5xl">
              Core Infrastructure
            </span>
          </div>
          <Suspense fallback={<div className="glass h-40 animate-pulse rounded-[2.5rem]" />}>
            <ServicesSection />
          </Suspense>
        </section>

        {/* --- Tier 2: Blog (Weekly + Human) --- */}
        <section className="mb-40">
          <div className="mb-12 flex items-center justify-between border-b border-white/5 pb-8">
            <div className="flex flex-col">
              <h2 className="mb-2 text-xs font-black tracking-[0.4em] text-purple-500 uppercase">
                Tier 02 // Analysis
              </h2>
              <span className="text-3xl font-black tracking-tight text-white uppercase md:text-5xl">
                Featured Insights
              </span>
            </div>
            <Link
              href="/blog"
              className="hidden text-xs font-black tracking-widest text-gray-500 uppercase transition-colors hover:text-white md:block"
            >
              Explore all blog posts →
            </Link>
          </div>
          <Suspense fallback={<div className="glass h-64 animate-pulse rounded-[3rem]" />}>
            <FeaturedBlogSection />
          </Suspense>
        </section>

        {/* --- note.com Premium Assets --- */}
        <section className="mb-40">
          <Suspense fallback={<div className="glass h-64 animate-pulse rounded-3xl" />}>
            <NoteFeedSection />
          </Suspense>
        </section>

        {/* --- Tier 1: Reports (Fast News Separated) --- */}
        <section className="mb-32">
          <div className="mb-20 flex items-center justify-between border-b border-white/5 pb-8">
            <div className="flex flex-col">
              <h2 className="mb-2 text-xs font-black tracking-[0.4em] text-gray-500 uppercase">
                Tier 01 // Fast News
              </h2>
              <span className="text-3xl font-black tracking-tight text-white uppercase md:text-5xl">
                Sector Intelligence
              </span>
            </div>
            <Link
              href="/reports"
              className="hidden text-xs font-black tracking-widest text-gray-500 uppercase transition-colors hover:text-white md:block"
            >
              View all reports →
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-3 gap-8">
                <div className="glass h-64 animate-pulse rounded-3xl" />
                <div className="glass h-64 animate-pulse rounded-3xl" />
                <div className="glass h-64 animate-pulse rounded-3xl" />
              </div>
            }
          >
            <ReportsSection />
          </Suspense>
        </section>

        <footer className="flex flex-col items-center justify-between gap-8 border-t border-white/5 py-20 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase">
              Built by Ayato Studio
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] text-gray-700 uppercase">
              © 2026 Intelligence Synergy
            </span>
          </div>
          <div className="flex gap-8">
            <Link
              href="/privacy"
              className="text-[10px] font-black tracking-widest text-gray-700 uppercase hover:text-gray-500"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-[10px] font-black tracking-widest text-gray-700 uppercase hover:text-gray-500"
            >
              Terms
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
