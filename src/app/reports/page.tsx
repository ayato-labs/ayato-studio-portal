import { fetchReports } from '@/lib/api';
import { PostItem } from '@/components/features/blog/PostItem';

export const revalidate = 60;

export default async function ReportsPage() {
  const reports = await fetchReports();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 sm:px-8 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="font-heading inline-block text-4xl font-bold tracking-tight lg:text-5xl">
            Intelligence Reports
          </h1>
          <p className="text-muted-foreground text-xl">
            Daily synthesized market research from global tech sources.
          </p>
        </div>
      </div>
      <hr className="my-8" />
      {reports?.length ? (
        <div className="grid gap-10 sm:grid-cols-2">
          {reports.map((report) => (
            <PostItem key={report.filename} post={report} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 py-10 text-center">
          <p className="text-muted-foreground text-xl">No reports found.</p>
        </div>
      )}
    </div>
  );
}
