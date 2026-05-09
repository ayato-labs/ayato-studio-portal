"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAnalytics } from "./use-analytics";
import { ContentType } from "@/lib/metrics";

interface UseVQEProps {
  id: string;
  title: string;
  contentType: ContentType;
  enabled?: boolean;
}

/**
 * useVQE
 * Custom hook to handle Value Quantification Engine (VQE) tracking.
 * Encapsulates GA4 events for various user engagement and value metrics.
 */
export const useVQE = ({ id, title, contentType, enabled = true }: UseVQEProps) => {
  const { trackEvent } = useAnalytics(process.env.NEXT_PUBLIC_GA_ID);
  const trackedAcquisition = useRef(false);

  const trackInsightAcquisition = useCallback(() => {
    trackEvent("insight_acquisition", "VQE", `${contentType}: ${title} (${id})`);
  }, [trackEvent, contentType, title, id]);

  const trackFeedback = useCallback((isUseful: boolean) => {
    trackEvent("utility_feedback", "VQE", `${isUseful ? "Positive" : "Negative"}: ${title} (${id})`);
  }, [trackEvent, title, id]);

  const trackEfficiency = useCallback((minutesSaved: number) => {
    trackEvent("efficiency_gain", "VQE", `${title} (${id})`, minutesSaved);
  }, [trackEvent, title, id]);

  const trackLead = useCallback((location: string, type: string) => {
    trackEvent("lead_conversion", "Conversion", `${type} @ ${location}`);
  }, [trackEvent]);

  const trackAction = useCallback((actionName: string, label: string) => {
    trackEvent(actionName, "Engagement", label);
  }, [trackEvent]);

  useEffect(() => {
    if (enabled && !trackedAcquisition.current) {
      trackInsightAcquisition();
      trackedAcquisition.current = true;
    }
  }, [enabled, trackInsightAcquisition]);

  return {
    trackInsightAcquisition,
    trackFeedback,
    trackEfficiency,
    trackLead,
    trackAction
  };
};
