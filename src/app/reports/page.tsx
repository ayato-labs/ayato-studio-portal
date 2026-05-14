import { fetchReports } from '@/lib/api';
import { IntelligenceTabs } from '@/components/features/reports/IntelligenceTabs';

export const revalidate = 60;

export default async function ReportsPage() {
  const reports = await fetchReports();

  // Stock: Strategic deep dives (e.g., Weekly category)
  const stockReports = reports.filter((r) => r.category === 'Weekly');

  // Flow: High-frequency market news (everything else)
  const flowReports = reports.filter((r) => r.category !== 'Weekly');

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-8 lg:py-20">
      <div className="mb-16 flex flex-col items-center space-y-6 text-center">
        <h1 className="text-5xl font-black tracking-tighter text-white uppercase md:text-7xl">
          Intelligence Reports
        </h1>
        <p className="max-w-2xl text-xl leading-relaxed text-gray-500">
          Daily synthesized market research from global tech sources.
          Filtered and categorized by strategic value.
        </p>
      </div>

      <IntelligenceTabs stockReports={stockReports} flowReports={flowReports} />

      {!reports?.length && (
        <div className="flex flex-col items-center justify-center space-y-4 py-20 text-center">
          <p className="text-xl font-bold tracking-widest text-gray-700 uppercase">
            No reports found.
          </p>
        </div>
      )}
    </div>
  );
}
