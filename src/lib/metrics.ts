import * as gtag from "./gtag";

export type ContentType = "Report" | "App" | "Blog" | "Asset" | "Service";

/**
 * Ayato Studio Value Metrics
 * These functions provide a structured way to track the "Value" of the intelligence portal.
 */

export const valueMetrics = {
  /**
   * Track when a user absorbs a high-value insight.
   */
  trackInsightAcquisition: (reportId: string, title: string) => {
    gtag.event({
      action: "insight_acquisition",
      category: "Intelligence",
      label: `${reportId}: ${title}`,
      value: 1,
    });
  },

  /**
   * Track user-reported utility (Upvote/Downvote).
   */
  trackUtilityFeedback: (reportId: string, isUseful: boolean) => {
    gtag.event({
      action: "utility_feedback",
      category: "Value",
      label: reportId,
      value: isUseful ? 1 : 0,
    });
  },

  /**
   * Track estimated research hours saved (Business ROI).
   */
  trackResearchEfficiency: (reportId: string, minutesSaved: number) => {
    gtag.event({
      action: "research_efficiency",
      category: "ROI",
      label: reportId,
      value: minutesSaved,
    });
  },

  /**
   * Track specific CTA clicks (e.g., "Implement this strategy").
   */
  trackActionTriggered: (reportId: string, actionName: string) => {
    gtag.event({
      action: "action_triggered",
      category: "Decision",
      label: `${reportId}: ${actionName}`,
      value: 1,
    });
  },
};
