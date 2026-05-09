import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { cn } from "@/lib/utils";
import Analytics from "@/components/features/analytics/Analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ayato Studio Portal | Market Intelligence AI",
  description: "AI駆動開発の専門家が運営する、AIを駆使したインテリジェンス・プラットフォーム。AI開発の最前線から得られる知見とAIを活用してニッチな情報を配信します。",
  keywords: ["AI", "Tech", "Intelligence", "Market Analysis", "Research"],
  authors: [{ name: "Ayato Studio" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
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
