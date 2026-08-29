'use client';

import React, { Suspense } from 'react';
import { useVQE } from '@/hooks/use-vqe';

interface NoteCTAProps {
  title?: string;
  link?: string;
}

const NoteCTAContent = ({
  title = 'Premium AI Implementation Guide',
  link = 'https://note.com/ayato_studio',
}: NoteCTAProps) => {
  const { trackLead } = useVQE({ id: link, title, contentType: 'Asset', enabled: false });

  return (
    <div className="group relative my-16 overflow-hidden rounded-[2.5rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-8 backdrop-blur-3xl md:p-12">
      {/* Background Glow */}
      <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-amber-500/10 blur-[100px] transition-all duration-1000 group-hover:bg-amber-500/20" />

      <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex-1 text-center md:text-left">
          <div className="mb-4 flex items-center justify-center gap-2 md:justify-start">
            <span className="rounded bg-amber-500 px-2 py-0.5 text-[10px] font-black tracking-widest text-black uppercase">
              Premium
            </span>
            <span className="text-[10px] font-bold tracking-widest text-amber-500/60 uppercase">
              Engineering Asset
            </span>
          </div>
          <h3 className="mb-4 text-2xl font-black tracking-tight text-white transition-colors group-hover:text-amber-400 md:text-3xl">
            {title}
          </h3>
          <p className="max-w-xl text-sm leading-relaxed font-medium text-gray-400">
            AIによる自律的な意思決定と自動化を実現するための、具体的なプロンプト・コード・設計図。
            Ayato Studio の開発現場で磨き上げられた実戦的な知見を note で公開しています。
          </p>
        </div>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackLead('NoteCTA', 'note.com')}
          className="inline-flex shrink-0 items-center gap-3 rounded-2xl bg-amber-500 px-8 py-4 text-xs font-black tracking-widest text-black uppercase shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.05] hover:bg-amber-400"
        >
          noteで技術詳細を見る
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export const NoteCTA = (props: NoteCTAProps) => {
  return (
    <Suspense
      fallback={
        <div className="my-16 h-[200px] w-full animate-pulse rounded-[2.5rem] bg-white/5" />
      }
    >
      <NoteCTAContent {...props} />
    </Suspense>
  );
};
