import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";

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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9593223306166400"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
