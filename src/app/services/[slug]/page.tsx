import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';
import Link from 'next/link';

import { getLocalArticleBySlug, getLocalArticles } from '@/lib/local-content';
import { Icons } from '@/components/ui/Icons';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getLocalArticleBySlug('services', slug);

  if (!service) return { title: 'Service Not Found' };

  return {
    title: `${service.title} | Ayato Studio Projects`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getLocalArticleBySlug('services', slug);

  if (!service) {
    notFound();
    return null;
  }

  return (
    <main className="bg-background min-h-screen overflow-x-hidden text-white selection:bg-blue-500/30">
      {/* LP Style Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15)_0%,rgba(0,0,0,0)_50%)]" />
        <div className="absolute right-0 bottom-0 h-full w-full bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.1)_0%,rgba(0,0,0,0)_50%)]" />
      </div>

      {/* Header Navigation */}
      <div className="container mx-auto px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase transition-colors hover:text-white"
        >
          <Icons.chevronLeft className="mr-2 h-3 w-3" />
          Back to Headquarters
        </Link>
      </div>

      <article>
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-12 pb-24 text-center">
          <div className="mb-12 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-blue-400 uppercase">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            Core Infrastructure // {service.category.toUpperCase()}
          </div>

          <h1 className="mx-auto mb-8 max-w-5xl text-5xl leading-[0.85] font-black tracking-tighter md:text-8xl">
            {service.title.split(' - ')[0]}
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {service.title.split(' - ')[1] || 'SYSTEM'}
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed font-medium text-gray-400 md:text-2xl">
            {service.description}
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <div className="glass flex items-center gap-4 rounded-3xl border-white/10 px-8 py-4">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs font-black tracking-widest uppercase">Production Ready</span>
            </div>
            <div className="glass flex items-center gap-4 rounded-3xl border-white/10 px-8 py-4">
              <Icons.gitHub className="h-5 w-5" />
              <span className="text-xs font-black tracking-widest uppercase">Open Source</span>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="relative border-t border-white/5 bg-white/[0.01] py-24">
          <div className="container mx-auto max-w-4xl px-6">
            <div className="prose prose-invert prose-blue prose-headings:font-black prose-headings:tracking-tight prose-h1:hidden prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mb-8 prose-h2:mt-20 prose-h2:pb-4 prose-h2:border-b prose-h2:border-white/5 prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mb-6 prose-h3:mt-12 prose-h3:text-blue-400 prose-p:text-gray-400 prose-p:leading-relaxed prose-p:text-lg md:prose-p:text-xl prose-li:text-gray-400 prose-li:text-lg md:prose-li:text-xl prose-strong:text-white prose-blockquote:rounded-3xl prose-blockquote:bg-blue-500/5 prose-blockquote:border-none prose-blockquote:p-8 max-w-none">
              <Markdown>{service.content}</Markdown>
            </div>
          </div>
        </section>
      </article>

      {/* CTA Footer */}
      <section className="container mx-auto px-6 py-32 text-center">
        <div className="glass mx-auto max-w-4xl rounded-[4rem] border-white/5 p-16">
          <h2 className="mb-8 text-3xl font-black md:text-5xl">
            Ready to enhance your <br />
            intelligence?
          </h2>
          <div className="flex justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-blue-600 px-10 py-5 font-black tracking-widest text-white uppercase transition-colors hover:bg-blue-700"
            >
              Get in Touch
            </Link>
            <Link
              href="/blog"
              className="glass rounded-full border-white/10 px-10 py-5 font-black tracking-widest text-white uppercase transition-colors hover:bg-white/5"
            >
              Read Technical Blog
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  const articles = getLocalArticles('services');
  return articles.map((article) => ({
    slug: article.slug,
  }));
}
