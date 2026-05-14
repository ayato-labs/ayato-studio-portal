/**
 * Ayato Studio Portal
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';

import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { cn } from '@/lib/utils';
import Analytics from '@/components/features/analytics/Analytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ayato Studio Portal | Market Intelligence AI',
  description:
    'エージェント型AI（Agentic AI）開発の専門家が運営する、AIを駆使したインテリジェンス・プラットフォーム。AI開発の最前線から得られる知見とAIを活用してニッチな情報を配信します。',
  keywords: ['AI', 'Tech', 'Intelligence', 'Market Analysis', 'Research'],
  authors: [{ name: 'Ayato Studio' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark" suppressHydrationWarning>
      <body className={cn('bg-background min-h-screen font-sans antialiased', inter.className)}>
        <Suspense fallback={null}>
          <Analytics
            gaId={process.env.NEXT_PUBLIC_GA_ID || process.env.GA_ID}
            adsId={process.env.NEXT_PUBLIC_ADS_ID || process.env.ADS_ID}
            adsenseId={process.env.NEXT_PUBLIC_ADSENSE_ID || process.env.ADSENSE_ID}
          />
        </Suspense>
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
