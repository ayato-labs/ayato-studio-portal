import Link from 'next/link';
import { Report } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface PostItemProps {
  post: Report;
}

export function PostItem({ post }: PostItemProps) {
  return (
    <article className="group relative flex flex-col space-y-2">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-xs font-medium">
            {post.category}
          </span>
          <span className="text-muted-foreground text-xs">{formatDate(post.timestamp)}</span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">
          <Link href={`/reports/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>
      </div>
      <p className="text-muted-foreground line-clamp-2">{post.content.substring(0, 160)}...</p>
      <Link href={`/reports/${post.slug}`} className="absolute inset-0">
        <span className="sr-only">View Report</span>
      </Link>
    </article>
  );
}
