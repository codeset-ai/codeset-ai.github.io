export const ANALYTICS_CONSENT_STORAGE_KEY = "codeset_analytics_consent_v1";

type GtagFn = (...args: unknown[]) => void;

export function pushGtagConsentUpdate(analyticsGranted: boolean): void {
  if (typeof window === "undefined") {
    return;
  }
  const gtag = (window as Window & { gtag?: GtagFn }).gtag;
  if (typeof gtag !== "function") {
    return;
  }
  gtag("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: analyticsGranted ? "granted" : "denied",
  });
}

export function getGtagConsentBootstrapScript(): string {
  const k = JSON.stringify(ANALYTICS_CONSENT_STORAGE_KEY);
  return `(function(){var k=${k};var v=null;try{v=localStorage.getItem(k);}catch(e){}var analytics=v==="granted"?"granted":"denied";window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:analytics,wait_for_update:500});})();`;
}
