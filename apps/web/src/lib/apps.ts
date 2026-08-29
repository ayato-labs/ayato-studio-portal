// src/lib/apps.ts

export interface App {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  status: 'active' | 'beta' | 'coming-soon';
  docsPath: string;
}

export const APPS: App[] = [
  {
    id: 'site-downloader',
    name: 'Site Downloader',
    slug: 'site-downloader',
    description:
      'Web サイトを高速にダウンロード・保存するための Chrome 拡張機能。完全なドキュメント、デプロイメントガイド、実装例を提供。',
    icon: '⬇️',
    color: 'cyan',
    category: 'Chrome Extension',
    status: 'active',
    docsPath: '/apps/site-downloader',
  },
  {
    id: 'screenshot-tool',
    name: 'Screenshot Tool',
    slug: 'screenshot-tool',
    description:
      'Web ページのスクリーンショット取得と編集機能。複数フォーマット対応、ワンクリック保存。',
    icon: '📸',
    color: 'purple',
    category: 'Chrome Extension',
    status: 'beta',
    docsPath: '/apps/screenshot-tool',
  },
  {
    id: 'pdf-converter',
    name: 'PDF Converter',
    slug: 'pdf-converter',
    description: 'Web ページから PDF へのシームレス変換。レイアウト保持、複数ページ対応。',
    icon: '📄',
    color: 'rose',
    category: 'Chrome Extension',
    status: 'coming-soon',
    docsPath: '/apps/pdf-converter',
  },
];

export function getAppBySlug(slug: string): App | undefined {
  return APPS.find((app) => app.slug === slug);
}

export function getAppsByStatus(status: 'active' | 'beta' | 'coming-soon'): App[] {
  return APPS.filter((app) => app.status === status);
}

export function getActiveApps(): App[] {
  return APPS.filter((app) => app.status === 'active');
}

export function getBetaApps(): App[] {
  return APPS.filter((app) => app.status === 'beta');
}

export function getComingSoonApps(): App[] {
  return APPS.filter((app) => app.status === 'coming-soon');
}
