"use client";

import { NoteArticle } from "@/lib/note"
import { useVQE } from "@/hooks/use-vqe"

interface NoteCardProps {
  article: NoteArticle
}

export function NoteCard({ article }: NoteCardProps) {
  const { trackLead } = useVQE({ 
    id: article.link, 
    title: article.title, 
    contentType: "Asset",
    enabled: false 
  });

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackLead("NoteCard", "note.com")}
      className="group relative flex flex-col space-y-4 rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:bg-white/[0.04] hover:border-amber-500/30"
    >
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/80">
          Premium Asset
        </span>
        <h3 className="text-xl font-black leading-tight tracking-tight group-hover:text-amber-400 transition-colors line-clamp-2">
          {article.title}
        </h3>
      </div>
      <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
        {article.contentSnippet}
      </p>
      <div className="pt-2 flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/0 group-hover:text-amber-500 transition-all">
        Get Implementation <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </a>
  )
}
