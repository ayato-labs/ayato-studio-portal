import { Suspense } from 'react';
import { fetchReports } from '@/lib/api';
import { getLocalArticles } from '@/lib/local-content';
import Link from 'next/link';

// blog/page.tsx - Combines Weekly AI reviews and Human local articles
async function BlogList() {
  // 1. Fetch AI reports and filter for "Weekly" category
  const aiReports = await fetchReports();
  const weeklyReviews = aiReports.filter((r) => r.category === 'Weekly');

  // 2. Fetch Local Markdown articles
  const localArticles = getLocalArticles('blog');

  // 3. Map local articles to a similar structure for display
  const mappedLocal = localArticles.map((a) => ({
    id: a.slug,
    title: a.title,
    category: 'Human Insight',
    timestamp: a.date,
    market: 'Editorial',
    content: a.description,
    slug: `/blog/${a.slug}`,
    isLocal: true,
  }));

  const allPosts = [
    ...weeklyReviews.map((r) => ({ ...r, isLocal: false, slug: `/reports/${r.slug}` })),
    ...mappedLocal,
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (allPosts.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">No blog posts found yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {allPosts.map((post) => (
        <div key={post.id} className="group relative">
          {/* Custom Card for Blog */}
          <Link
            href={post.slug}
            className="group block rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 transition-all duration-500 hover:border-blue-500/30"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-blue-400 uppercase">
                {post.category}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                {new Date(post.timestamp)
                  .toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })
                  .replace(/\//g, '.')}
              </span>
            </div>
            <h3 className="mb-4 line-clamp-2 text-2xl leading-tight font-black text-white transition-colors group-hover:text-blue-400 md:text-3xl">
              {post.title}
            </h3>
            <p className="mb-8 line-clamp-3 text-sm leading-relaxed text-gray-500">
              {post.content.replace(/[#*`]/g, '').substring(0, 150)}...
            </p>
            <div className="flex items-center text-xs font-black tracking-[0.2em] text-blue-500 uppercase">
              Read Full Analysis{' '}
              <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function BlogPage() {
  return (
    <main className="bg-background min-h-screen py-20 md:py-32">
      <div className="container mx-auto px-6">
        <div className="mb-20 max-w-4xl">
          <h1 className="mb-8 text-5xl leading-none font-black tracking-tighter text-white md:text-7xl">
            INTELLIGENCE
            <br />
            <span className="text-blue-500">BLOG</span>
          </h1>
          <p className="text-xl leading-relaxed font-medium text-gray-500">
            AI が生成する週刊インテリジェンス・レビューと、
            <br className="hidden md:block" />
            人間による最新の技術考察やマーケット・インサイトを統合した情報ハブ。
          </p>
        </div>

        <Suspense
          fallback={
            <div className="animate-pulse font-black text-gray-700">Decrypting insights...</div>
          }
        >
          <BlogList />
        </Suspense>
      </div>
    </main>
  );
}
