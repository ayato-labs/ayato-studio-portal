'use client';

import React, { Suspense } from 'react';
import { Icons } from './Icons';
import { cn } from '@/lib/utils';
import { useVQE } from '@/hooks/use-vqe';

interface CTASectionProps {
  className?: string;
  theme?: 'blue' | 'indigo' | 'amber';
}

const CTASectionContent = ({ className, theme = 'blue' }: CTASectionProps) => {
  const { trackLead } = useVQE({
    id: 'cta-section',
    title: 'Global CTA',
    contentType: 'App',
    enabled: false,
  });

  const themes = {
    blue: {
      bg: 'bg-blue-600/5',
      border: 'border-blue-500/20',
      accent: 'text-blue-400',
      button: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20',
    },
    indigo: {
      bg: 'bg-indigo-600/5',
      border: 'border-indigo-500/20',
      accent: 'text-indigo-400',
      button: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20',
    },
    amber: {
      bg: 'bg-amber-600/5',
      border: 'border-amber-500/20',
      accent: 'text-amber-400',
      button: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/20',
    },
  };

  const styles = themes[theme] || themes.blue;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[3rem] border p-8 md:p-16',
        styles.bg,
        styles.border,
        className,
      )}
    >
      {/* Background Glow */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />

      <div className="relative z-10 grid items-center gap-8 md:grid-cols-2">
        <div>
          <div className="mb-6 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
            </span>
            <span className="text-xs font-black tracking-[0.3em] text-blue-400/80 uppercase">
              Available for Consultation
            </span>
          </div>

          <h2 className="mb-6 text-4xl leading-none font-black tracking-tighter text-white md:text-5xl">
            READY TO
            <br />
            <span className={styles.accent}>QUANTIFY VALUE?</span>
          </h2>
          <p className="mb-8 max-w-md leading-relaxed font-medium text-gray-400">
            AIを活用したリサーチの自動化、価値計測エンジンの導入、
            次世代の技術スタック構築など、ビジネスの加速を支援します。
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="https://crowdworks.jp/public/employees/6435014"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackLead('CTASection', 'CrowdWorks')}
              className={cn(
                'inline-flex flex-1 items-center justify-center gap-3 rounded-2xl px-8 py-5 text-sm font-black tracking-widest uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]',
                styles.button,
              )}
            >
              CrowdWorksで相談
              <Icons.externalLink className="h-4 w-4" />
            </a>

            <a
              href="mailto:Cwblog69@gmail.com"
              onClick={() => trackLead('CTASection', 'Contact')}
              className="inline-flex flex-1 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-8 py-5 text-sm font-black tracking-widest text-white uppercase transition-all hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98]"
            >
              メールで問い合わせ
              <Icons.mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="rounded-[2.5rem] border border-white/5 bg-black/40 p-8 backdrop-blur-2xl">
            <div className="space-y-6">
              {[
                { label: 'Architecture', value: 'Modern & Clean' },
                { label: 'Lead Time', value: '2-4 Weeks' },
                { label: 'Engine', value: 'AI-Augmented' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between border-b border-white/5 pb-4"
                >
                  <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                    {item.label}
                  </span>
                  <span className="text-sm font-black text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CTASection = (props: CTASectionProps) => {
  return (
    <Suspense
      fallback={<div className="h-[400px] w-full animate-pulse rounded-[3rem] bg-white/5" />}
    >
      <CTASectionContent {...props} />
    </Suspense>
  );
};
