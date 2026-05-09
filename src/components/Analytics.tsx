"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import * as gtag from "@/lib/gtag";

interface AnalyticsProps {
    gaId?: string;
    adsId?: string;
    adsenseId?: string;
}

function AnalyticsContent({ gaId, adsId, adsenseId }: AnalyticsProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Route change tracking
    useEffect(() => {
        if (pathname && gaId) {
            gtag.pageview(pathname, gaId);
        }
    }, [pathname, searchParams, gaId]);

    if (!gaId && !adsId && !adsenseId) return null;

    return (
        <>
            {/* Google AdSense */}
            {adsenseId && (
                <Script
                    async
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
            )}

            {/* Global Site Tag (gtag.js) - Google Analytics / Ads */}
            {(gaId || adsId) && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${gaId || adsId}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              ${gaId ? `gtag('config', '${gaId}', { page_path: window.location.pathname });` : ""}
              ${adsId ? `gtag('config', '${adsId}');` : ""}
            `}
                    </Script>
                </>
            )}
        </>
    );
}

export default function Analytics(props: AnalyticsProps) {
    return (
        <Suspense fallback={null}>
            <AnalyticsContent {...props} />
        </Suspense>
    );
}
