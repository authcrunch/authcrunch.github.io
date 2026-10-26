export const STORAGE_KEY = 'authcrunch.community-banner.dismissed-at';
export const DISMISSAL_MS = 7 * 24 * 60 * 60 * 1000;
export const DISMISSED_ATTRIBUTE = 'data-community-banner-dismissed';

/** A dismissal lasts exactly seven days; invalid or future dates cannot hide it. */
export function dismissalRemaining(value, now = Date.now()) {
  const dismissedAt = Number(value);
  if (!Number.isFinite(dismissedAt) || dismissedAt <= 0 || dismissedAt > now) return 0;
  return Math.max(0, dismissedAt + DISMISSAL_MS - now);
}

/** Hide a remembered dismissal before the first paint, without changing SSR HTML. */
export function bannerBootstrapScript() {
  return `(function(){try{const DISMISSAL_MS=${DISMISSAL_MS};const remaining=(${dismissalRemaining.toString()})(localStorage.getItem(${JSON.stringify(STORAGE_KEY)}));document.documentElement.setAttribute(${JSON.stringify(DISMISSED_ATTRIBUTE)},String(remaining>0));}catch(e){}})();`;
}
