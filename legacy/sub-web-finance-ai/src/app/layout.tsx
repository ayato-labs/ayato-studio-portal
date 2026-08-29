import React from 'react';
import './globals.css';
import SiteHeader from '@/components/layout/SiteHeader';

export const metadata = {
  title: 'Ayato Studio - Finance & AI',
  description: '金融市場分析と最先端AI技術の融合。次世代の投資インテリジェンスを提供します。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Outfit:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0 }} className="min-h-screen bg-[#030303] text-white">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
