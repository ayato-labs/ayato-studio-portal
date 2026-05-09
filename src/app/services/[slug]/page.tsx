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
    <main className="min-h-screen bg-background text-white selection:bg-blue-500/30 overflow-x-hidden">
        {/* LP Style Background */}
        <div className="fixed inset-0 -z-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15)_0%,rgba(0,0,0,0)_50%)]" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.1)_0%,rgba(0,0,0,0)_50%)]" />
        </div>
        
        {/* Header Navigation */}
        <div className="container mx-auto px-6 py-8">
            <Link href="/" className="inline-flex items-center text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] hover:text-white transition-colors">
                <Icons.chevronLeft className="mr-2 h-3 w-3" />
                Back to Headquarters
            </Link>
        </div>

        <article>
            {/* Hero Section */}
            <section className="container mx-auto px-6 pt-12 pb-24 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-12">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Core Infrastructure // {service.category.toUpperCase()}
                </div>
                
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85] max-w-5xl mx-auto">
                    {service.title.split(' - ')[0]}<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        {service.title.split(' - ')[1] || "SYSTEM"}
                    </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-3xl mx-auto leading-relaxed mb-12">
                    {service.description}
                </p>

                <div className="flex flex-wrap justify-center gap-6">
                    <div className="glass px-8 py-4 rounded-3xl flex items-center gap-4 border-white/10">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-xs font-black uppercase tracking-widest">Production Ready</span>
                    </div>
                    <div className="glass px-8 py-4 rounded-3xl flex items-center gap-4 border-white/10">
                        <Icons.gitHub className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Open Source</span>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="relative py-24 border-t border-white/5 bg-white/[0.01]">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="
                        prose prose-invert prose-blue max-w-none
                        prose-headings:font-black prose-headings:tracking-tight
                        prose-h1:hidden
                        prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mb-8 prose-h2:mt-20
                        prose-h2:pb-4 prose-h2:border-b prose-h2:border-white/5
                        prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mb-6 prose-h3:mt-12 prose-h3:text-blue-400
                        prose-p:text-gray-400 prose-p:leading-relaxed prose-p:text-lg md:prose-p:text-xl
                        prose-li:text-gray-400 prose-li:text-lg md:prose-li:text-xl
                        prose-strong:text-white
                        prose-blockquote:rounded-3xl prose-blockquote:bg-blue-500/5 prose-blockquote:border-none prose-blockquote:p-8
                    ">
                        <Markdown>{service.content}</Markdown>
                    </div>
                </div>
            </section>
        </article>

        {/* CTA Footer */}
        <section className="py-32 container mx-auto px-6 text-center">
            <div className="glass p-16 rounded-[4rem] border-white/5 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-black mb-8">Ready to enhance your <br />intelligence?</h2>
                <div className="flex justify-center gap-4">
                    <Link href="/contact" className="px-10 py-5 rounded-full bg-blue-600 text-white font-black uppercase tracking-widest hover:bg-blue-700 transition-colors">
                        Get in Touch
                    </Link>
                    <Link href="/blog" className="px-10 py-5 rounded-full glass border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/5 transition-colors">
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
