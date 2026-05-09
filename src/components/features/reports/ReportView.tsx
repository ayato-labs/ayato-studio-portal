"use client"

import { Report } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface ReportViewProps {
  report: Report
}

export default function ReportView({ report }: ReportViewProps) {
  return (
    <article className="container max-w-3xl py-6 lg:py-12 mx-auto px-4 sm:px-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-blue-400">
            {report.category}
          </span>
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            {formatDate(report.timestamp)}
          </span>
        </div>
        <h1 className="inline-block font-black text-4xl leading-tight lg:text-5xl tracking-tighter">
          {report.title}
        </h1>
      </div>
      <hr className="my-8 border-white/5" />
      <div className="prose prose-invert max-w-none">
        <div className="whitespace-pre-wrap text-lg leading-relaxed text-gray-300">
          {report.content}
        </div>
      </div>
    </article>
  )
}
