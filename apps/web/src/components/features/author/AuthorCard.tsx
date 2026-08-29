import React from 'react';
import Link from 'next/link';

interface AuthorCardProps {
  className?: string;
}

export function AuthorCard({ className = '' }: AuthorCardProps) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-2xl md:p-10 ${className}`}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        {/* Avatar / Icon */}
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-2xl font-black text-white shadow-xl shadow-blue-500/20">
          A
        </div>

        {/* Info */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h4 className="text-2xl font-black tracking-tight text-white">Ayato</h4>
            <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-[10px] font-black tracking-widest text-blue-400 uppercase">
              AIフルスタックエンジニア
            </span>
          </div>

          <p className="text-sm leading-relaxed text-gray-300">
            減算の美学に基づく自律型AIエージェント・分散バッチ基盤から、100%オフラインで動作するWindows専用AI議事録、数理金融バリュエーションエンジン（DCF×LLM）までを一貫して設計・開発するAIフルスタックエンジニア。TypeScript/Next.jsとPython 3.12によるエッジファースト・極小コストなシステム構築を専門としています。
          </p>

          {/* Contact / Links */}
          <div className="pt-3 flex flex-wrap items-center gap-4 text-xs">
            <a
              href="mailto:cwblog69@gmail.com"
              className="inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
            >
              <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>cwblog69@gmail.com</span>
            </a>

            <span className="text-gray-700">|</span>

            <a
              href="https://crowdworks.jp/public/employees/6435014?ref=login_header"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold text-blue-400 transition-colors hover:text-blue-300"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>CrowdWorks 開発実績・プロフィール</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
