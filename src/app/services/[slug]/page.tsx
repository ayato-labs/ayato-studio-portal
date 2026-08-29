import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';
import Link from 'next/link';

import { getLocalArticleBySlug, getLocalArticles } from '@/lib/local-content';
import { Icons } from '@/components/ui/Icons';
import { PRICING_PLANS } from '@/lib/stripe/plans';
import { CheckoutButton } from '@/components/features/checkout/CheckoutButton';

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: service.title,
    description: service.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Windows, Linux, macOS',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    author: {
      '@type': 'Person',
      name: 'Ayato',
      url: 'https://crowdworks.jp/public/employees/6435014?ref=login_header',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ayato Studio',
      url: 'https://ayato-studio.ai',
    },
  };

  return (
    <main className="bg-background min-h-screen overflow-x-hidden text-white selection:bg-blue-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

          <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
            <Link
              href={`/support?product=${slug}&success=true`}
              className="rounded-full bg-blue-500 px-10 py-5 text-sm font-black tracking-wider text-white uppercase shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:bg-blue-400 active:scale-95 flex items-center gap-3"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              今すぐ無料ダウンロード (Free)
            </Link>
            <a
              href="#pricing"
              className="glass rounded-full border-white/10 px-8 py-5 text-sm font-black tracking-wider text-white uppercase transition-all duration-300 hover:bg-white/10"
            >
              Pro 料金プランを見る
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <div className="glass flex items-center gap-4 rounded-3xl border-white/10 px-8 py-4">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs font-black tracking-widest uppercase">100% Offline // Air-gapped</span>
            </div>
            <div className="glass flex items-center gap-4 rounded-3xl border-white/10 px-8 py-4">
              <Icons.gitHub className="h-5 w-5" />
              <span className="text-xs font-black tracking-widest uppercase">Open Source Available</span>
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

        {/* Pricing / Access Plans Section */}
        {(() => {
          const relevantPlans = PRICING_PLANS.filter((p) => p.productId === slug);
          if (relevantPlans.length === 0) return null;

          return (
            <section id="pricing" className="border-t border-white/5 bg-white/[0.02] py-24 scroll-mt-12">
              <div className="container mx-auto max-w-5xl px-6">
                <div className="mb-16 text-center">
                  <h3 className="mb-4 text-xs font-black tracking-[0.4em] text-blue-400 uppercase">
                    Pricing & License Options
                  </h3>
                  <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                    プランを選択して即座に導入
                  </h2>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {relevantPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative flex flex-col justify-between rounded-3xl border p-8 backdrop-blur-xl ${
                        plan.recommended
                          ? 'border-blue-500/50 bg-blue-500/[0.08] shadow-2xl shadow-blue-500/10'
                          : 'border-white/10 bg-white/[0.03]'
                      }`}
                    >
                      {plan.recommended && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-1 text-[10px] font-black tracking-widest text-white uppercase">
                          Recommended
                        </div>
                      )}

                      <div>
                        <h4 className="mb-2 text-xl font-black text-white">{plan.name}</h4>
                        <p className="mb-6 text-sm text-gray-400">{plan.description}</p>
                        <div className="mb-8 flex items-baseline gap-2">
                          <span className="text-4xl font-black text-white">
                            {plan.price === 0 ? '無料' : `¥${plan.price.toLocaleString()}`}
                          </span>
                          {plan.price > 0 && (
                            <span className="text-xs font-bold text-gray-400">
                              {plan.interval === 'month' ? '/ 月' : '（買い切り）'}
                            </span>
                          )}
                        </div>

                        <ul className="mb-8 space-y-3 text-sm text-gray-300">
                          {plan.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-blue-400 font-bold">✓</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <CheckoutButton
                        productId={slug}
                        planId={plan.id}
                        tierName={`${service.title.split(' - ')[0]} (${plan.name})`}
                        amount={plan.price}
                        mode={plan.interval === 'month' ? 'subscription' : 'payment'}
                        buttonText={plan.price === 0 ? 'GitHubで無料取得' : '今すぐ申し込む'}
                        className={`w-full py-4 px-6 rounded-full font-black tracking-wider text-xs uppercase transition-all duration-300 ${
                          plan.recommended
                            ? 'bg-blue-500 text-white hover:bg-blue-400 shadow-lg shadow-blue-500/20'
                            : 'bg-white text-black hover:bg-gray-200'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })()}
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
              href="/insights"
              className="glass rounded-full border-white/10 px-10 py-5 font-black tracking-widest text-white uppercase transition-colors hover:bg-white/5"
            >
              Read Technical Insights
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
