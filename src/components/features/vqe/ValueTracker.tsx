"use client";

import { Suspense } from "react";
import { useVQE } from "@/hooks/use-vqe";
import { ContentType } from "@/lib/metrics";

interface ValueTrackerProps {
  id: string;
  title: string;
  contentType: ContentType;
}

/**
 * ValueTracker
 * A headless component that initiates VQE tracking for a page or section.
 * Best used in layouts or top-level page components.
 */
function ValueTrackerContent({ id, title, contentType }: ValueTrackerProps) {
  // The hook handles the initial acquisition tracking via useEffect
  useVQE({ id, title, contentType });

  return null; // Headless component
}

export default function ValueTracker(props: ValueTrackerProps) {
  return (
    <Suspense fallback={null}>
      <ValueTrackerContent {...props} />
    </Suspense>
  );
}
