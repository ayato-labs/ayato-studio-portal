"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import * as gtag from "@/lib/gtag";

export const useAnalytics = (gaId?: string) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname && gaId) {
            gtag.pageview(pathname, gaId);
        }
    }, [pathname, searchParams, gaId]);

    const trackEvent = (action: string, category: string, label: string, value?: number) => {
        gtag.event({ action, category, label, value });
    };

    return { trackEvent };
};
