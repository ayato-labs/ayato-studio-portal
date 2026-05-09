export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag?: (command: string, action: string, params: object) => void;
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string, measurementId?: string) => {
  const id = measurementId || GA_MEASUREMENT_ID;
  if (typeof window !== "undefined" && window.gtag && id) {
    window.gtag("config", id, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[GA4 Event] Action: ${action}, Category: ${category}, Label: ${label}, Value: ${value}`);
  }

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
