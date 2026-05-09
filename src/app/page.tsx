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

import { Suspense } from "react";
import { fetchReports } from "@/lib/api";
import { getLocalArticles, getAppsList } from "@/lib/local-content";
import { LocalArticle } from "@/lib/types";
import ReportCard from "@/components/features/reports/ReportCard";
import { NoteFeedSection } from "@/components/features/blog/NoteFeedSection";
import Link from 'next/link';

export const revalidate = 60;

// Home Page - Ayato Studio Intelligence Portal

async function ServicesSection() {
  const services = getLocalArticles('services').slice(0, 3);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
      {services.map((service: LocalArticle) => (
        <Link key={service.slug} href={`/services/${service.slug}`} className="group p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all duration-500">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.285a2 2 0 01-1.963 0l-.628-.285a6 6 0 00-3.86-.517l-2.387.477a2 2 0 00-1.022.547V18.14a2 2 0 001.022.547l2.387.477a6 6 0 003.86-.517l.628-.285a2 2 0 011.963 0l.628.285a6 6 0 003.86.517l2.387.477a2 2 0 001.022-.547V15.428z" />
            </svg>
          </div>
          <h4 className="text-xl font-black text-white mb-3 group-hover:text-blue-400 transition-colors uppercase tracking-tight">
            {service.title.split(' - ')[0]}
          </h4>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
      {apps.map((appSlug: string) => {
        const articles = getLocalArticles(`apps/${appSlug}`);
        const title = appSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        const description = articles.length > 0 ? articles[0].description : "Documentation and guides.";

        return (
          <Link key={appSlug} href={`/apps/${appSlug}`} className="group p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all duration-500">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h4 className="text-xl font-black text-white mb-3 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
              {title}
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
              {description}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

async function FeaturedBlogSection() {
  const aiReports = await fetchReports();
  const weekly = aiReports.filter(r => r.category === "Weekly").slice(0, 1);
  const local = getLocalArticles('blog').slice(0, 1);
 
  const featured: Array<{
    id?: string;
    slug: string;
    title: string;
    type: string;
    href: string;
    timestamp: string;
  }> = [
    ...weekly.map(r => ({ ...r, type: 'Weekly Review', href: `/reports/${r.slug}`, timestamp: r.timestamp })),
    ...local.map((l: LocalArticle) => ({ ...l, type: 'Human Insight', href: `/blog/${l.slug}`, timestamp: l.date }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
      {featured.map((item) => (
        <Link key={item.id || item.slug} href={item.href} className="group relative aspect-[16/9] md:aspect-auto overflow-hidden rounded-[3rem] border border-white/5 bg-white/[0.02]">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 p-10 z-20 w-full">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest mb-4">
                    {item.type}
                </span>
                <h3 className="text-2xl md:text-4xl font-black text-white mb-4 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                    {item.title}
                </h3>
                <div className="flex items-center text-blue-500 text-xs font-black uppercase tracking-widest">
                    Read Analysis <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
            </div>
        </Link>
      ))}
    </div>
  );
}

async function ReportsSection() {
  const reports = await fetchReports();
  const fastNews = reports.filter(r => r.category !== "Weekly");

  const techReports = fastNews.filter(r => (r.market || "").toLowerCase() === "tech").slice(0, 3);
  const financeReports = fastNews.filter(r => (r.market || "").toLowerCase() === "finance").slice(0, 3);
  const energyReports = fastNews.filter(r => (r.market || "").toLowerCase() === "energy").slice(0, 3);

  const sections = [
    { title: "Digital Frontier", subtitle: "Tech & AI Research", items: techReports, color: "text-blue-500", border: "border-blue-500/10" },
    { title: "Strategic Finance", subtitle: "Market & Economy", items: financeReports, color: "text-amber-500", border: "border-amber-500/10" },
    { title: "Energy Paradigm", subtitle: "Resource & Sustainability", items: energyReports, color: "text-emerald-500", border: "border-emerald-500/10" }
  ].filter(s => s.items.length > 0);

  if (sections.length === 0) return null;

  return (
    <div className="space-y-32">
      {sections.map((section) => (
        <div key={section.title} className="relative">
          <div className="flex items-center gap-6 mb-12">
            <div className={`h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent`} />
            <div className="flex flex-col items-center text-center px-8">
              <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${section.color} mb-2`}>{section.subtitle}</span>
              <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase">{section.title}</h3>
            </div>
            <div className={`h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent`} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    <main className="relative min-h-screen bg-background selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-purple-600/10 blur-[120px] animation-delay-2000 animate-pulse" />
      </div>

      <div className="container mx-auto px-6 pt-20 md:pt-40">
        {/* --- Hero Section --- */}
        <div className="relative mb-32">
          <div className="glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-400/80">Ayato Studio // Core Systems Online</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-[0.8] mb-12">
            LIBERATION<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">FROM TOIL</span>
          </h1>
          
          <div className="max-w-3xl">
            <p className="text-xl md:text-3xl text-gray-400 font-medium leading-tight tracking-tight mb-12">
                AI駆動開発の専門家が運営する、AIを駆使したインテリジェンス・プラットフォーム。<br />
                Ayato Studio は、AI開発の最前線から得られる知見と<br />
                AIを活用してニッチな情報を配信します。
            </p>
            <div className="flex gap-4">
                <Link href="/blog" className="px-8 py-4 rounded-full bg-blue-600 text-white font-black uppercase tracking-widest hover:bg-blue-700 transition-colors">
                    View Blog
                </Link>
                <Link href="/reports" className="px-8 py-4 rounded-full glass border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/5 transition-colors">
                    Latest reports
                </Link>
            </div>
          </div>
        </div>

        {/* --- Tier 4: Applications (Ecosystem) --- */}
        <section className="mb-40">
           <div className="flex flex-col mb-12">
                <h2 className="text-xs uppercase font-black tracking-[0.4em] text-cyan-500 mb-2">Tier 04 // Ecosystem</h2>
                <span className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">Intelligent Apps</span>
            </div>
            <Suspense fallback={<div className="h-40 glass rounded-[2.5rem] animate-pulse" />}>
                <AppsSection />
            </Suspense>
        </section>

        {/* --- Tier 3: Services (Portfolio) --- */}
        <section className="mb-40">
           <div className="flex flex-col mb-12">
                <h2 className="text-xs uppercase font-black tracking-[0.4em] text-blue-500 mb-2">Tier 03 // Portfolio</h2>
                <span className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">Core Infrastructure</span>
            </div>
            <Suspense fallback={<div className="h-40 glass rounded-[2.5rem] animate-pulse" />}>
                <ServicesSection />
            </Suspense>
        </section>

        {/* --- Tier 2: Blog (Weekly + Human) --- */}
        <section className="mb-40">
            <div className="flex items-center justify-between mb-12 pb-8 border-b border-white/5">
                <div className="flex flex-col">
                    <h2 className="text-xs uppercase font-black tracking-[0.4em] text-purple-500 mb-2">Tier 02 // Analysis</h2>
                    <span className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">Featured Insights</span>
                </div>
                <Link href="/blog" className="hidden md:block text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                    Explore all blog posts →
                </Link>
            </div>
            <Suspense fallback={<div className="h-64 glass rounded-[3rem] animate-pulse" />}>
                <FeaturedBlogSection />
            </Suspense>
        </section>

        {/* --- note.com Premium Assets --- */}
        <section className="mb-40">
            <Suspense fallback={<div className="h-64 glass rounded-3xl animate-pulse" />}>
                <NoteFeedSection />
            </Suspense>
        </section>

        {/* --- Tier 1: Reports (Fast News Separated) --- */}
        <section className="mb-32">
          <div className="flex items-center justify-between mb-20 border-b border-white/5 pb-8">
              <div className="flex flex-col">
                <h2 className="text-xs uppercase font-black tracking-[0.4em] text-gray-500 mb-2">Tier 01 // Fast News</h2>
                <span className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">Sector Intelligence</span>
              </div>
              <Link href="/reports" className="hidden md:block text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                    View all reports →
              </Link>
          </div>
          <Suspense fallback={<div className="grid grid-cols-3 gap-8"><div className="h-64 glass animate-pulse rounded-3xl" /><div className="h-64 glass animate-pulse rounded-3xl" /><div className="h-64 glass animate-pulse rounded-3xl" /></div>}>
            <ReportsSection />
          </Suspense>
        </section>

        <footer className="py-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Built by Ayato Studio</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">© 2026 Intelligence Synergy</span>
            </div>
            <div className="flex gap-8">
                <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-gray-700 hover:text-gray-500">Privacy</Link>
                <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-gray-700 hover:text-gray-500">Terms</Link>
            </div>
        </footer>
      </div>
    </main>
  );
}
