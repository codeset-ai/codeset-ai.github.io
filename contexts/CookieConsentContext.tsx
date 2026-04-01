"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { Button } from "@/components/ui/button";

export const ANALYTICS_CONSENT_STORAGE_KEY = "codeset_analytics_consent_v1";

const STORAGE_KEY = ANALYTICS_CONSENT_STORAGE_KEY;

type StoredConsent = "granted" | "denied";

type CookieConsentContextValue = {
  analyticsGranted: boolean;
  ready: boolean;
  acceptAnalytics: () => void;
  rejectAnalytics: () => void;
  openPreferences: () => void;
};

const CookieConsentContext = createContext<
  CookieConsentContextValue | undefined
>(undefined);

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return ctx;
}

function CookieConsentBanner({
  onAccept,
  onReject,
}: {
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-gray-200 bg-white p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] sm:p-6"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1 text-sm text-gray-600" id="cookie-consent-desc">
          <p>
          We use essential cookies to ensure the website functions properly. 
          With your consent, we also use optional cookies to improve your experience, analyze traffic, and personalize content. 
          Learn more in our{" "}
          <Link
          href="/privacy"
          className="text-primary underline underline-offset-2 hover:no-underline"
          >
            Privacy Policy
          </Link>.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row-reverse">
          <Button type="button" onClick={onAccept} size="sm">
            Accept all
          </Button>
          <Button type="button" onClick={onReject} variant="outline" size="sm">
            Essential only
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<StoredConsent | null | "pending">(
    "pending",
  );
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "granted" || raw === "denied") {
        setConsent(raw);
        setShowBanner(false);
      } else {
        setConsent(null);
        setShowBanner(true);
      }
    } catch {
      setConsent(null);
      setShowBanner(true);
    }
  }, []);

  const acceptAnalytics = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "granted");
    } catch {
      /* ignore */
    }
    setConsent("granted");
    setShowBanner(false);
  }, []);

  const rejectAnalytics = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "denied");
    } catch {
      /* ignore */
    }
    setConsent("denied");
    setShowBanner(false);
  }, []);

  const openPreferences = useCallback(() => {
    setShowBanner(true);
  }, []);

  const ready = consent !== "pending";
  const analyticsGranted = consent === "granted";

  const value = useMemo(
    () => ({
      analyticsGranted,
      ready,
      acceptAnalytics,
      rejectAnalytics,
      openPreferences,
    }),
    [
      analyticsGranted,
      ready,
      acceptAnalytics,
      rejectAnalytics,
      openPreferences,
    ],
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      {ready && showBanner ? (
        <CookieConsentBanner
          onAccept={acceptAnalytics}
          onReject={rejectAnalytics}
        />
      ) : null}
    </CookieConsentContext.Provider>
  );
}
