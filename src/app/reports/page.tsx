import { fetchReports } from '@/lib/api';
import { getLocalArticles } from '@/lib/local-content';
import { IntelligenceTabs } from '@/components/features/reports/IntelligenceTabs';
import { Report } from '@/lib/types';

export const revalidate = 60;

export default async function ReportsPage() {
  // Stock: Manually curated insights from local files
  const stockArticles = getLocalArticles('blog');
  const stockReports: Report[] = stockArticles.map((a) => ({
    id: a.slug,
    filename: a.slug,
    slug: a.slug,
    title: a.title,
    category: a.category || 'Human Insight',
    language: 'jp',
    timestamp: a.date,
    market: 'Global',
    author: 'ayato-labs',
    content: a.content,
  }));

  // Flow: Dynamic AI-generated market intelligence from Supabase
  const flowReports = await fetchReports();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-8 lg:py-20">
      <div className="mb-16 flex flex-col items-center space-y-6 text-center">
        <h1 className="text-5xl font-black tracking-tighter text-white uppercase md:text-7xl">
          AI Intelligence Hub
        </h1>
        <p className="max-w-2xl text-xl leading-relaxed text-gray-400">
          海外の最新AI関連論文（arXiv）やテックフィードを、AIで分析・日本語要約したデイリーレポート。
          AIが分析し、人間が検証した確度の高い情報を提供します。
        </p>
      </div>

      <IntelligenceTabs stockReports={stockReports} flowReports={flowReports} />

      {stockReports.length === 0 && flowReports.length === 0 && (
        <div className="flex flex-col items-center justify-center space-y-4 py-20 text-center">
          <p className="text-xl font-bold tracking-widest text-gray-700 uppercase">
            No reports found.
          </p>
        </div>
      )}
    </div>
  );
}
