import { fetchReports } from '@/lib/api';
import ReportCard from '@/components/features/reports/ReportCard';

export const revalidate = 60;

export default async function ReportsPage() {
  // Flow: Dynamic AI-generated market intelligence from Supabase
  const flowReports = await fetchReports();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-8 lg:py-20">
      <div className="mb-16 flex flex-col items-center space-y-6 text-center">
        <h1 className="text-5xl font-black tracking-tighter text-white uppercase md:text-7xl">
          AI News Reports
        </h1>
        <p className="max-w-2xl text-xl leading-relaxed text-gray-400">
          海外の最新AI関連論文（arXiv）やテックフィードを、
          AIで分析・日本語要約したデイリーレポート。
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-3">
        {flowReports.map((report) => (
          <ReportCard key={report.id} report={report} variant="minimal" />
        ))}
        {flowReports.length === 0 && (
          <div className="py-20 text-center text-xs font-bold tracking-widest text-gray-700 uppercase">
            No news reports found.
          </div>
        )}
      </div>
    </div>
  );
}
