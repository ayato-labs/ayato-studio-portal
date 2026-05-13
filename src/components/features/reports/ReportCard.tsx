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
      className="group relative flex flex-col space-y-2 rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-white/10 hover:bg-white/[0.04]"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-blue-400 uppercase">
            {report.category}
          </span>
          <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
            {formatDate(report.timestamp)}
          </span>
        </div>
        <h3 className="text-xl font-black tracking-tight transition-colors group-hover:text-blue-400">
          {report.title}
        </h3>
      </div>
      <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
        {report.content.substring(0, 120)}...
      </p>
      <div className="flex items-center pt-2 text-[10px] font-black tracking-[0.2em] text-blue-500/0 uppercase transition-all group-hover:text-blue-500">
        Read Report <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}
