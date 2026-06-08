import Link from 'next/link';
import { getLocalArticles } from '@/lib/local-content';
import { Icons } from '@/components/ui/Icons';

export const metadata = {
  title: 'Services - Ayato Studio',
  description:
    'AIが存在することを前提とした、AIネイティブなシステム構築・ワークフロー自動化・カスタムMCPサーバー開発のプロフェッショナルサービス。',
};

export default async function ServicesPage() {
  const services = await getLocalArticles('services');

  return (
    <div className="container max-w-5xl py-10 lg:py-16">
      <div className="mb-12 flex flex-col items-start gap-4">
        <h1 className="inline-block text-4xl leading-tight font-black tracking-tighter lg:text-5xl">
          Services & Products
        </h1>
        <p className="text-muted-foreground text-xl">
          自律型AIエージェント、カスタムMCP連携、エッジファーストアーキテクチャ。Ayato Studio が提供するAIネイティブシステム構築ソリューション。
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {services.length > 0 ? (
          services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group relative flex flex-col space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 transition-colors group-hover:bg-blue-500/10">
                  <Icons.logo className="h-6 w-6 transition-colors group-hover:text-blue-400" />
                </div>
                <Icons.arrowRight className="h-5 w-5 -translate-x-2 text-blue-400 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </div>
              <div>
                <h2 className="mb-2 text-2xl font-black transition-colors group-hover:text-blue-400">
                  {service.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
              <div className="flex items-center gap-2 pt-4">
                <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black tracking-widest uppercase">
                  Case Study
                </span>
                {service.category && (
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-blue-400 uppercase">
                    {service.category}
                  </span>
                )}
              </div>
            </Link>
          ))
        ) : (
          <p>No services found.</p>
        )}
      </div>

      <div className="mt-20 rounded-3xl border border-dashed border-white/10 p-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">AI Native Integration Consulting</h2>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl">
          御社独自の業務システムとLLMを安全に繋ぐカスタムMCPサーバーの設計や、エッジ環境を活用した維持費ゼロのAIシステム構築を支援します。
        </p>
        <Link
          href="/contact"
          className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-black text-black transition-all hover:bg-white/90"
        >
          お問い合わせ
        </Link>
      </div>
    </div>
  );
}
