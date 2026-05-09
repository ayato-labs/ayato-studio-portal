"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import * as gtag from "@/lib/gtag";

function AnalyticsContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;
    const ADS_ID = process.env.NEXT_PUBLIC_ADS_ID;
    const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

    // Route change tracking
    useEffect(() => {
        if (pathname) {
            gtag.pageview(pathname);
        }
    }, [pathname, searchParams]);

    if (!GA_MEASUREMENT_ID && !ADS_ID && !ADSENSE_ID) return null;

    return (
        <>
            {/* Google AdSense */}
            {ADSENSE_ID && (
                <Script
                    async
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
            )}

            {/* Global Site Tag (gtag.js) - Google Analytics / Ads */}
            {(GA_MEASUREMENT_ID || ADS_ID) && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID || ADS_ID}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              ${GA_MEASUREMENT_ID ? `gtag('config', '${GA_MEASUREMENT_ID}', { page_path: window.location.pathname });` : ""}
              ${ADS_ID ? `gtag('config', '${ADS_ID}');` : ""}
            `}
                    </Script>
                </>
            )}
        </>
    );
}

export default function Analytics() {
    return (
        <Suspense fallback={null}>
            <AnalyticsContent />
        </Suspense>
    );
}
