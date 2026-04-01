"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { pushGtagConsentUpdate } from "@/lib/analyticsConsent";

type GtagFn = (...args: unknown[]) => void;

function getGtag(): GtagFn | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  const gtag = (window as Window & { gtag?: GtagFn }).gtag;
  return typeof gtag === "function" ? gtag : undefined;
}

export const GA_TRACKING_ID = "G-VJXTWYKTRS";

const gtagInitScript = `(function(){if(typeof window.gtag!=="function")return;window.gtag("js",new Date());window.gtag("config","${GA_TRACKING_ID}");})();`;

export const pageview = (url: string) => {
  const gtag = getGtag();
  if (!gtag) {
    return;
  }
  gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }: any) => {
  const gtag = getGtag();
  if (!gtag) {
    return;
  }
  gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

function GoogleAnalyticsBootstrap() {
  const { analyticsGranted, ready } = useCookieConsent();

  useEffect(() => {
    if (!ready) {
      return;
    }
    pushGtagConsentUpdate(analyticsGranted);
  }, [ready, analyticsGranted]);

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
}

function GoogleAnalyticsPageviews() {
  const { ready, analyticsGranted } = useCookieConsent();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!ready) {
      return;
    }
    const qs = searchParams.toString();
    const url = pathname + (qs ? `?${qs}` : "");
    pageview(url);
  }, [pathname, searchParams, ready, analyticsGranted]);

  return null;
}

export const GoogleAnalytics = () => (
  <>
    <GoogleAnalyticsBootstrap />
    <Suspense fallback={null}>
      <GoogleAnalyticsPageviews />
    </Suspense>
  </>
);
