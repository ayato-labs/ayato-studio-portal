'use client';

import React, { useState, useMemo } from 'react';
import { AiNewsItem } from '@/lib/types';

interface NewsFeedProps {
  initialNews: AiNewsItem[];
}

const CATEGORIES = [
  'All',
  'Models',
  'Research',
  'Open Source',
  'Industry',
  'Hardware',
  'Policy',
  'Tools',
];

function formatTimeAgo(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

function getDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function getCategoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case 'models':
      return 'border-blue-500/30 bg-blue-500/10 text-blue-400';
    case 'research':
      return 'border-purple-500/30 bg-purple-500/10 text-purple-400';
    case 'open source':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
    case 'hardware':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-400';
    case 'industry':
      return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400';
    case 'policy':
      return 'border-rose-500/30 bg-rose-500/10 text-rose-400';
    default:
      return 'border-zinc-500/30 bg-zinc-500/10 text-zinc-400';
  }
}

export function NewsFeed({ initialNews }: NewsFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredNews = useMemo(() => {
    return initialNews.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [initialNews, selectedCategory, searchQuery]);

  return (
    <div className="w-full space-y-8">
      {/* Controls: Search and Category Tabs */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Category Tabs */}
        <div className="flex max-w-full items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'border border-white/5 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px] lg:w-72">
          <svg
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search news, models, research..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus:border-cyan-500/50 w-full rounded-2xl border border-white/10 bg-white/[0.03] py-2 pr-4 pl-9 text-xs text-white placeholder-gray-500 backdrop-blur transition-colors focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Live Feed: {filteredNews.length} Stories Curated
          </span>
        </div>
        <span className="text-[11px] text-gray-500">Sorted by newest first</span>
      </div>

      {/* News List */}
      {filteredNews.length === 0 ? (
        <div className="rounded-3xl border border-white/5 bg-white/[0.02] py-20 text-center">
          <p className="text-sm font-medium text-gray-400">No news articles found matching your criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-cyan-400 mt-4 text-xs hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.04] rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden">
          {filteredNews.map((item) => {
            const domain = getDomain(item.url);
            const timeAgo = formatTimeAgo(item.published_at);
            const categoryClass = getCategoryColor(item.category);

            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-3 p-6 transition-all duration-300 hover:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1 space-y-2 min-w-0 pr-4">
                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-cyan-400">{item.source_name}</span>
                    <span className="text-gray-600">•</span>
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${categoryClass}`}>
                      {item.category}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500">{timeAgo}</span>
                  </div>

                  {/* Title Link */}
                  <h3 className="text-base font-semibold leading-snug text-white transition-colors group-hover:text-cyan-300 md:text-lg">
                    {item.title}
                  </h3>

                  {/* Domain */}
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <span>{domain}</span>
                  </div>
                </div>

                {/* Arrow Action */}
                <div className="flex shrink-0 items-center justify-end">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-gray-400 transition-all duration-200 group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 group-hover:scale-105">
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
