import { fetchReports } from "@/lib/api";
import { PostItem } from "@/components/features/blog/PostItem";

export const revalidate = 60;

export default async function ReportsPage() {
  const reports = await fetchReports();

  return (
    <div className="container max-w-4xl py-6 lg:py-10 mx-auto px-4 sm:px-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-heading text-4xl font-bold tracking-tight lg:text-5xl">
            Intelligence Reports
          </h1>
          <p className="text-xl text-muted-foreground">
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
            <p className="text-xl text-muted-foreground">No reports found.</p>
        </div>
      )}
    </div>
  );
}
