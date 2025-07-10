"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const GA_TRACKING_ID = "G-VJXTWYKTRS";

export const pageview = (url: string) => {
  if (typeof window.gtag !== "function") {
    return;
  }
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }: any) => {
  if (typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const GoogleAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();
    pageview(url);
  }, [pathname, searchParams]);

  return null;
};