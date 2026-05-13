import Link from 'next/link';
import { Report } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ReportCardProps {
  report: Report;
}

export default function ReportCard({ report }: ReportCardProps) {
  return (
    <Link
      href={`/reports/${report.slug}`}
      className="group relative flex flex-col space-y-3 rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-500 hover:border-blue-500/30 hover:bg-white/[0.04]"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[9px] font-black tracking-widest text-blue-400 uppercase">
            {report.category}
          </span>
          <span className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase">
            {formatDate(report.timestamp)}
          </span>
        </div>
        <h3 className="text-2xl font-black tracking-tight text-white transition-colors group-hover:text-blue-400">
          {report.title}
        </h3>
      </div>
      <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
        {report.content.substring(0, 120)}...
      </p>
      <div className="flex items-center pt-2 text-[10px] font-black tracking-[0.2em] text-blue-500 opacity-0 transition-all duration-500 group-hover:opacity-100">
        Launch Analysis{' '}
        <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}
