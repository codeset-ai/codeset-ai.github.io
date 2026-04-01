"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useCookieConsent } from "@/contexts/CookieConsentContext";

export const GA_TRACKING_ID = "G-VJXTWYKTRS";

const gtagInitScript = `(function(){if(typeof window.gtag!=="function")return;window.gtag("js",new Date());window.gtag("config","${GA_TRACKING_ID}");})();`;

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
  const { analyticsGranted, ready } = useCookieConsent();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!ready || typeof window.gtag !== "function") {
      return;
    }
    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: analyticsGranted ? "granted" : "denied",
    });
  }, [ready, analyticsGranted]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    const qs = searchParams.toString();
    const url = pathname + (qs ? `?${qs}` : "");
    pageview(url);
  }, [pathname, searchParams, ready]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {gtagInitScript}
      </Script>
    </>
  );
};
