"use client";

import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { cn } from "@/lib/utils";

export function CookieSettingsLink({ className }: { className?: string }) {
  const { openPreferences } = useCookieConsent();
  return (
    <button
      type="button"
      onClick={openPreferences}
      className={cn(
        "text-left text-sm text-gray-500 transition-colors hover:text-black",
        className,
      )}
    >
      Cookie settings
    </button>
  );
}
