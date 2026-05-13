'use client';

import { Report } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ReportViewProps {
  report: Report;
}

export default function ReportView({ report }: ReportViewProps) {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-6 sm:px-8 lg:py-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-black tracking-widest text-blue-400 uppercase">
            {report.category}
          </span>
          <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            {formatDate(report.timestamp)}
          </span>
        </div>
        <h1 className="inline-block text-4xl leading-tight font-black tracking-tighter lg:text-5xl">
          {report.title}
        </h1>
      </div>
      <hr className="my-8 border-white/5" />
      <div className="prose prose-invert max-w-none">
        <div className="text-lg leading-relaxed whitespace-pre-wrap text-gray-300">
          {report.content}
        </div>
      </div>
    </article>
  );
}
