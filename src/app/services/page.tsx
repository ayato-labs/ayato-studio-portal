import Link from "next/link"
import { getLocalArticles } from "@/lib/local-content"
import { Icons } from "@/components/ui/Icons"

export const metadata = {
  title: "Services - Ayato Studio",
  description: "AI駆動型のエージェントとインテリジェンス基盤。私たちが提供するコア・テクノロジーの紹介。",
}

export default async function ServicesPage() {
  const services = await getLocalArticles("services")

  return (
    <div className="container max-w-5xl py-10 lg:py-16">
      <div className="flex flex-col items-start gap-4 mb-12">
        <h1 className="inline-block font-black text-4xl leading-tight lg:text-5xl tracking-tighter">
          Services & Products
        </h1>
        <p className="text-xl text-muted-foreground">
          AIエージェント、共有メモリ、マルチモーダル解析。Ayato Studio が構築したインテリジェンスの基盤実績。
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {services.length > 0 ? (
          services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group relative flex flex-col space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all hover:bg-white/[0.06] hover:border-white/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 group-hover:bg-blue-500/10 transition-colors">
                  <Icons.logo className="h-6 w-6 group-hover:text-blue-400 transition-colors" />
                </div>
                <Icons.arrowRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black mb-2 group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
              <div className="pt-4 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full">
                  Case Study
                </span>
                {service.category && (
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full">
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
        <h2 className="text-2xl font-bold mb-4">Custom AI Agent Development</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          特定のビジネスロジックに基づいた自律型エージェントの構築や、データの資産化（RAG）の導入を支援します。
        </p>
        <Link
          href="/contact"
          className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-black text-black hover:bg-white/90 transition-all"
        >
          お問い合わせ
        </Link>
      </div>
    </div>
  )
}
