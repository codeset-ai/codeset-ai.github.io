export const ANALYTICS_CONSENT_STORAGE_KEY = "codeset_analytics_consent_v1";

export function getGtagConsentBootstrapScript(): string {
  const k = JSON.stringify(ANALYTICS_CONSENT_STORAGE_KEY);
  return `(function(){var k=${k};var v=null;try{v=localStorage.getItem(k);}catch(e){}var analytics=v==="granted"?"granted":"denied";window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:analytics,wait_for_update:500});})();`;
}
