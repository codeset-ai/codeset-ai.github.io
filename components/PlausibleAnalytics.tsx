"use client";

import { useEffect } from "react";

const domain =
  process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim() || "plausible.codeset.ai";

export function PlausibleAnalytics() {
  useEffect(() => {
    if (!domain) {
      return;
    }
    const w = window as Window & { plausible?: { l?: boolean } };
    if (w.plausible?.l) {
      return;
    }
    void import("@plausible-analytics/tracker").then(({ init }) => {
      if ((window as Window & { plausible?: { l?: boolean } }).plausible?.l) {
        return;
      }
      init({
        domain,
        autoCapturePageviews: true,
        bindToWindow: true,
      });
    });
  }, []);

  return null;
}
