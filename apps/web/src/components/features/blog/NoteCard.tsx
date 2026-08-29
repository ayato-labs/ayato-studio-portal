'use client';

import { NoteArticle } from '@/lib/note';
import { useVQE } from '@/hooks/use-vqe';

interface NoteCardProps {
  article: NoteArticle;
}

export function NoteCard({ article }: NoteCardProps) {
  const { trackLead } = useVQE({
    id: article.link,
    title: article.title,
    contentType: 'Asset',
    enabled: false,
  });

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackLead('NoteCard', 'note.com')}
      className="group relative flex flex-col space-y-4 rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-amber-500/30 hover:bg-white/[0.04]"
    >
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black tracking-[0.2em] text-amber-500/80 uppercase">
          Premium Asset
        </span>
        <h3 className="line-clamp-2 text-xl leading-tight font-black tracking-tight transition-colors group-hover:text-amber-400">
          {article.title}
        </h3>
      </div>
      <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
        {article.contentSnippet}
      </p>
      <div className="flex items-center pt-2 text-[10px] font-black tracking-[0.2em] text-amber-500/0 uppercase transition-all group-hover:text-amber-500">
        Get Implementation{' '}
        <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
      </div>
    </a>
  );
}
