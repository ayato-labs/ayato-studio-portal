import Link from "next/link"
import { Report } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface ReportCardProps {
  report: Report
}

export default function ReportCard({ report }: ReportCardProps) {
  return (
    <Link
      href={`/reports/${report.slug}`}
      className="group relative flex flex-col space-y-2 rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.04] hover:border-white/10"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-blue-400">
            {report.category}
          </span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            {formatDate(report.timestamp)}
          </span>
        </div>
        <h3 className="text-xl font-black tracking-tight group-hover:text-blue-400 transition-colors">
          {report.title}
        </h3>
      </div>
      <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
        {report.content.substring(0, 120)}...
      </p>
      <div className="pt-2 flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/0 group-hover:text-blue-500 transition-all">
        Read Report <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  )
}
