import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';
import Link from 'next/link';

import { getLocalArticleBySlug, getLocalArticles } from '@/lib/local-content';
import { Icons } from '@/components/ui/Icons';
import { CTASection } from '@/components/ui/CTASection';
import { NoteCTA } from '@/components/features/blog/NoteCTA';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const articles = getLocalArticles('academy');
  const article = articles.find(a => a.slug === slug);
  
  if (!article) return { title: 'Lesson Not Found' };

  return {
    title: `${article.title || 'Untitled Lesson'} | Ayato Academy`,
    description: article.description || '',
  };
}

export default async function AcademyDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const article = getLocalArticleBySlug('academy', slug);

  if (!article) {
    notFound();
    return null;
  }

  const articleTitle = article.title || "Untitled Lesson";
  const articleDescription = article.description || "";
  const articleDate = article.date ? new Date(article.date) : new Date();
  const formattedDate = isNaN(articleDate.getTime()) ? "Unknown Date" : articleDate.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" }).replace(/\//g, ".");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": articleTitle,
    "description": articleDescription,
    "provider": {
      "@type": "Organization",
      "name": "Ayato Academy",
      "sameAs": "https://ayato-studio.ai/academy"
    }
  };

  return (
    <main className="min-h-screen bg-background text-white selection:bg-indigo-500/30 overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Dynamic Background */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(30,27,75,1)_0%,rgba(5,5,5,1)_100%)]" />
        
        <article className="mx-auto max-w-4xl px-6 py-12 md:py-24">
            {/* Header */}
            <div className="mb-12">
                <Link href="/academy" className="inline-flex items-center text-xs font-black text-indigo-400 uppercase tracking-widest mb-8 hover:opacity-70 transition-opacity">
                    <Icons.chevronLeft className="mr-2 h-4 w-4" />
                    Back to Academy Curriculum
                </Link>
                
                <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.3em] mb-6">
                    <div className="h-px w-12 bg-gray-500/30" />
                    AI Fundamentals Lecture
                </div>
                
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">
                    {articleTitle}
                </h1>
                
                <div className="flex items-center gap-6 p-6 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold shadow-lg shadow-indigo-500/20">AI</div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Category</p>
                            <p className="text-sm font-bold">Mathematics & Theory</p>
                        </div>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Lesson Date</p>
                        <p className="text-sm font-bold">{formattedDate}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-b from-indigo-600/5 to-transparent rounded-[3rem] -z-10 blur-2xl" />
                
                <div className="p-8 md:p-16 rounded-[3rem] border border-white/5 bg-black/40 backdrop-blur-3xl shadow-2xl">
                    <div className="
                        prose prose-invert prose-indigo max-w-none
                        prose-headings:font-black prose-headings:tracking-tight
                        prose-h1:text-3xl md:prose-h1:text-4xl prose-h1:mb-8
                        prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12
                        prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-10
                        prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-lg
                        prose-li:text-gray-300 prose-li:text-lg
                        prose-strong:text-white prose-strong:font-bold
                        prose-hr:border-white/10 prose-hr:my-12
                    ">
                        <Markdown>{article.content || ""}</Markdown>
                    </div>

                    {/* Premium Asset CTA (Note) */}
                    <div className="mt-16">
                      <NoteCTA />
                    </div>

                    {/* Business CTA Section */}
                    <CTASection theme="indigo" />
                </div>
            </div>

            <div className="mt-20 pt-10 border-t border-white/5 flex items-center justify-between">
                <Link href="/academy" className="text-xs font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                    ← Overview
                </Link>
                <Link href="/blog" className="text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">
                    Read Latest Insights →
                </Link>
            </div>
        </article>
    </main>
  );
}

export async function generateStaticParams() {
  const articles = getLocalArticles('academy');
  return articles.map((article) => ({
    slug: article.slug,
  }));
}
