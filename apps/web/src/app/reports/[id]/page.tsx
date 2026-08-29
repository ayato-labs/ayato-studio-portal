import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { fetchReportByFilename, fetchReports } from '@/lib/api';
import { cn, formatDateTime } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';
import ReportView from '@/components/features/reports/ReportView';
import { CTASection } from '@/components/ui/CTASection';
import ValueTracker from '@/components/features/vqe/ValueTracker';
import { UtilityFeedback } from '@/components/features/vqe/UtilityFeedback';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamicParams = true;
export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const report = await fetchReportByFilename(decodedId);

  const description = report
    ? report.content
        .replace(/[#*`>!\[\]]/g, '')
        .slice(0, 160)
        .trim() + '...'
    : 'Market Intelligence Deep-Dive';

  return {
    title: report ? `${report.title} | Ayato Studio Reports` : 'Report Not Found',
    description: description,
  };
}

export default async function ReportDetailPage({ params }: PageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const report = await fetchReportByFilename(decodedId);

  if (!report) {
    notFound();
    return null;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: report.title,
    datePublished: report.timestamp,
    author: {
      '@type': 'Organization',
      name: 'Ayato Intelligence Engine',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ayato Studio',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ayato-studio.ai/favicon.ico',
      },
    },
  };

  return (
    <article className="relative container mx-auto max-w-3xl px-4 py-6 sm:px-8 lg:py-10">
      <ValueTracker id={report.slug} title={report.title} contentType="Report" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/reports"
        className={cn(
          'hover:bg-accent hover:text-accent-foreground absolute top-14 left-[-200px] hidden items-center justify-center rounded-md text-sm font-medium transition-colors xl:inline-flex',
        )}
      >
        <Icons.chevronLeft className="mr-2 h-4 w-4" />
        See all reports
      </Link>
      <div>
        <time dateTime={report.timestamp} className="text-muted-foreground block text-sm">
          Published on {formatDateTime(report.timestamp)} (JST)
        </time>
        <h1 className="font-heading mt-2 inline-block text-4xl leading-tight font-bold lg:text-5xl">
          {report.title}
        </h1>
        <div className="mt-4 flex items-center space-x-3">
          <span className="bg-muted rounded-md px-2 py-1 text-sm font-medium">
            {report.category}
          </span>
          <span className="text-muted-foreground text-sm">Market: {report.market}</span>
        </div>
      </div>
      <hr className="my-8" />

      {/* デフォルトエクスポートを正しくインポートして適用 */}
      <ReportView report={report} />

      {/* VQE: Utility Feedback */}
      <UtilityFeedback id={report.slug} title={report.title} className="mt-12" />

      {/* CTA Section */}
      <CTASection theme="blue" className="mt-16" />

      <hr className="my-8" />
      <div className="flex justify-center py-6 lg:py-10">
        <Link
          href="/reports"
          className={cn(
            'border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-11 items-center justify-center rounded-md border px-8 text-sm font-medium transition-colors',
          )}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          See all reports
        </Link>
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  try {
    const reports = await fetchReports();
    const params = reports.map((report) => ({
      id: report.slug, // Use global safety slug
    }));

    if (params.length === 0) {
      console.warn('generateStaticParams: No reports found, providing fallback path.');
      return [{ id: 'draft-initial' }];
    }

    return params;
  } catch (error) {
    console.error('Failed to generate static params for reports:', error);
    return [{ id: 'draft-error' }];
  }
}
