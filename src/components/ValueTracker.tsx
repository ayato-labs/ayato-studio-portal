"use client";

import { useEffect, useRef } from "react";
import { valueMetrics } from "@/lib/metrics";

interface ValueTrackerProps {
  reportId: string;
  reportTitle: string;
}

/**
 * ValueTracker
 * A headless client component that tracks "Insight Acquisition" on mount.
 * This ensures that server-side rendered reports still trigger tracking events
 * when the user actually views them in the browser.
 */
export default function ValueTracker({ reportId, reportTitle }: ValueTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      valueMetrics.trackInsightAcquisition(reportId, reportTitle);
      tracked.current = true;
    }
  }, [reportId, reportTitle]);

  return null; // Headless component
}
