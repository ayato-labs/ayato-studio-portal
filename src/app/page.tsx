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

async function ToolsSection() {
  const apps = getAppsList().slice(0, 2);
  const services = getLocalArticles('services').slice(0, 1);

  const tools = [
    ...apps.map((appSlug) => ({
      slug: appSlug,
      href: `/apps/${appSlug}`,
      type: 'App',
      color: 'blue',
    })),
    ...services.map((s) => ({
      slug: s.slug,
      href: `/services/${s.slug}`,
      type: 'Service',
      color: 'blue',
    })),
  ];

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
      {tools.map((tool) => {
        const title = tool.slug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        return (
          <Link
            key={tool.slug}
            href={tool.href}
            className="group rounded-[2rem] border border-white/5 bg-white/[0.02] p-10 transition-all duration-500 hover:border-blue-500/30 hover:bg-white/[0.04]"
          >
            <span className="mb-6 inline-block text-[10px] font-black tracking-[0.3em] text-blue-500 uppercase">
              {tool.type}
            </span>
            <h4 className="mb-4 text-2xl font-black tracking-tight text-white uppercase group-hover:text-blue-400">
              {title}
            </h4>
            <div className="flex items-center text-xs font-black tracking-widest text-gray-500 uppercase">
              Launch <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

async function IntelligenceSection() {
  const reports = await fetchReports();
  const latest = reports.slice(0, 3);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {latest.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
      <div className="flex justify-center">
        <Link
          href="/reports"
          className="text-xs font-black tracking-[0.3em] text-gray-500 uppercase transition-colors hover:text-blue-500"
        >
          Explore All Intelligence →
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="bg-background relative min-h-screen overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Elements */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-blue-600/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 pt-32 pb-40 md:pt-48">
        {/* --- Hero Section --- */}
        <section className="mb-64">
          <div className="mb-12 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
            <span className="text-[10px] font-black tracking-[0.3em] text-blue-400 uppercase">
              Ayato Studio Portal v2.0
            </span>
          </div>

          <h1 className="mb-16 text-7xl leading-[0.85] font-black tracking-tighter text-white md:text-[10rem]">
            LIBERATION
            <br />
            <span className="text-blue-600">FROM TOIL</span>
          </h1>

          <div className="max-w-2xl">
            <p className="mb-12 text-xl leading-snug font-medium text-gray-400 md:text-2xl">
              AI開発の専門知見を、実益あるツールと戦略的インテリジェンスへ変換する。
              私たちは、知的な自由を追求するための基盤を提供します。
            </p>
            <div className="flex gap-6">
              <Link
                href="/apps"
                className="rounded-full bg-blue-600 px-10 py-5 font-black tracking-widest text-white uppercase transition-all hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/20"
              >
                Get Started
              </Link>
              <Link
                href="/reports"
                className="rounded-full border border-white/10 bg-white/5 px-10 py-5 font-black tracking-widest text-white uppercase transition-all hover:bg-white/10"
              >
                Analysis
              </Link>
            </div>
          </div>
        </section>

        {/* --- Intelligent Tools --- */}
        <section className="mb-64">
          <div className="mb-16">
            <h2 className="mb-4 text-xs font-black tracking-[0.5em] text-blue-500 uppercase">
              Section 01 // Tools
            </h2>
            <h3 className="text-4xl font-black tracking-tighter text-white uppercase md:text-6xl">
              Intelligent Apps
            </h3>
          </div>
          <Suspense fallback={<div className="h-64 animate-pulse rounded-[2rem] bg-white/5" />}>
            <ToolsSection />
          </Suspense>
        </section>

        {/* --- Strategic Intelligence --- */}
        <section className="mb-40">
          <div className="mb-16">
            <h2 className="mb-4 text-xs font-black tracking-[0.5em] text-blue-500 uppercase">
              Section 02 // Insights
            </h2>
            <h3 className="text-4xl font-black tracking-tighter text-white uppercase md:text-6xl">
              Strategic Intelligence
            </h3>
          </div>
          <Suspense fallback={<div className="h-64 animate-pulse rounded-[2rem] bg-white/5" />}>
            <IntelligenceSection />
          </Suspense>
        </section>

        {/* Footer */}
        <footer className="mt-64 border-t border-white/5 pt-20">
          <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black tracking-[0.4em] text-gray-600 uppercase">
                Ayato Studio Intelligence Portal
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
