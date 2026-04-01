"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  useCookieConsent,
} from "@/contexts/CookieConsentContext";

export const GA_TRACKING_ID = "G-VJXTWYKTRS";

const consentBootstrapScript = `(function(){var k=${JSON.stringify(ANALYTICS_CONSENT_STORAGE_KEY)};var v=null;try{v=localStorage.getItem(k);}catch(e){}var analytics=v==="granted"?"granted":"denied";window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:analytics,wait_for_update:500});})();`;

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
      <Script id="google-consent-default" strategy="beforeInteractive">
        {consentBootstrapScript}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`gtag('js',new Date());gtag('config','${GA_TRACKING_ID}');`}
      </Script>
    </>
  );
};
