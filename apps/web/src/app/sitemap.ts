import type { MetadataRoute } from 'next';
import { fetchReports } from '../lib/api';
import { getLocalArticles, getLocalReports } from '../lib/local-content';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ayato-studio.ai';

  // 1. 固定ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/insights`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reports`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stats`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  let allPages = [...staticPages];

  // 2. インテリジェンス・レポート (リモート + ローカル)
  try {
    const remoteReports = await fetchReports();
    const localReports = getLocalReports();
    const reports = [...remoteReports, ...localReports];

    if (reports && reports.length > 0) {
      const reportPages: MetadataRoute.Sitemap = reports
        .filter((report) => report.timestamp)
        .map((report) => ({
          url: `${baseUrl}/reports/${report.slug}`,
          lastModified: isValidDate(report.timestamp) ? new Date(report.timestamp) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }));
      allPages = [...allPages, ...reportPages];
    }
  } catch (e) {
    console.error('[Sitemap] Failed to fetch reports:', e);
  }

  // 3. ローカルインサイト記事 (旧ブログ)
  try {
    const insightArticles = getLocalArticles('insights');
    const insightPages: MetadataRoute.Sitemap = insightArticles
      .filter((article) => article.date)
      .map((article) => ({
        url: `${baseUrl}/insights/${article.slug}`,
        lastModified: isValidDate(article.date) ? new Date(article.date) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      }));
    allPages = [...allPages, ...insightPages];
  } catch (e) {
    console.error('[Sitemap] Failed to fetch insight articles:', e);
  }

  // 4. ローカルサービス紹介 (内製ツール紹介も含む)
  try {
    const serviceArticles = getLocalArticles('services');
    const servicePages: MetadataRoute.Sitemap = serviceArticles
      .filter((article) => article.date)
      .map((article) => ({
        url: `${baseUrl}/services/${article.slug}`,
        lastModified: isValidDate(article.date) ? new Date(article.date) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      }));
    allPages = [...allPages, ...servicePages];
  } catch (e) {
    console.error('[Sitemap] Failed to fetch service articles:', e);
  }

  return allPages;
}

function isValidDate(dateStr: string) {
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}
