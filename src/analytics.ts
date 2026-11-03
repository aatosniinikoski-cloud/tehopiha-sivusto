// Basic consent mode: no Google resource is requested until explicit consent.
export type AnalyticsConsent = 'granted' | 'denied' | null;
const storageKey = 'tehopiha.analytics-consent.v1';
const lifetime = 180 * 24 * 60 * 60 * 1000;
const listeners = new Set<() => void>();
let consent: AnalyticsConsent = null;
let initialized = false;
let expiresAt = 0;
let expiryTimer: ReturnType<typeof setTimeout> | undefined;
let frame: HTMLIFrameElement | null = null;
let ready = false;
let pageViewed = false;
let pendingLeads = 0;

function readChoice(): { choice: AnalyticsConsent; expiresAt: number } {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
    if (saved?.version === 1 && ['granted', 'denied'].includes(saved.choice) &&
        typeof saved.expiresAt === 'number' && saved.expiresAt > Date.now() && saved.expiresAt <= Date.now() + lifetime) {
      return saved;
    }
    localStorage.removeItem(storageKey);
  } catch { /* Storage unavailable: keep the choice in memory for this page only. */ }
  return { choice: null, expiresAt: 0 };
}

function deleteAnalyticsCookies() {
  const names = document.cookie.split(';').map(cookie => cookie.trim().split('=')[0])
    .filter(name => name === '_ga' || name.startsWith('_ga_'));
  const host = location.hostname.split('.');
  const domains = ['', ...host.map((_, index) => host.slice(index).join('.')).filter(domain => domain.includes('.'))];
  const paths = new Set(['/', ...location.pathname.split('/').map((_, index, parts) => parts.slice(0, index + 1).join('/') || '/')]);
  for (const name of names) for (const domain of domains) for (const path of paths) {
    document.cookie = `${name}=; Max-Age=0; path=${path}${domain ? `; domain=${domain}` : ''}; SameSite=Lax`;
  }
}

function sendEvent(name: 'page_view' | 'generate_lead') {
  frame?.contentWindow?.postMessage({ source: 'tehopiha-analytics', type: 'event', name }, location.origin);
}

function flushEvents() {
  if (!ready || consent !== 'granted' || Date.now() >= expiresAt) return;
  if (!pageViewed) { sendEvent('page_view'); pageViewed = true; }
  while (pendingLeads > 0) { sendEvent('generate_lead'); pendingLeads--; }
}

function startAnalytics() {
  if (frame) return;
  // A removable, same-origin runtime prevents background tracking after withdrawal,
  // without reloading the page or losing an unfinished quotation request. It has no
  // form, links or page history for enhanced measurement to observe automatically.
  frame = document.createElement('iframe');
  frame.hidden = true;
  frame.title = 'Suostumuksella käytettävä analytiikka';
  frame.setAttribute('aria-hidden', 'true');
  frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  frame.referrerPolicy = 'no-referrer';
  frame.src = `${import.meta.env.BASE_URL}analytics.html`;
  frame.addEventListener('load', () => {
    if (consent !== 'granted' || Date.now() >= expiresAt) return;
    frame?.contentWindow?.postMessage({ source: 'tehopiha-analytics', type: 'init',
      // Never send query strings, fragments, incoming referrers or form fields.
      pageLocation: `${location.origin}${import.meta.env.BASE_URL}`,
      pageTitle: document.title }, location.origin);
  });
  document.body.append(frame);
}

function applyChoice(choice: AnalyticsConsent, expiry: number) {
  consent = choice;
  expiresAt = expiry;
  clearTimeout(expiryTimer);
  if (choice === 'granted') startAnalytics();
  else {
    // Destroying the context also discards queued hits and Google's timers/listeners.
    // Disable first so frame teardown cannot emit an automatic engagement hit.
    const runtime = frame?.contentWindow as (Window & { 'ga-disable-G-CWKEST2H7X'?: boolean; dataLayer?: unknown[] }) | null;
    if (runtime) { runtime['ga-disable-G-CWKEST2H7X'] = true; if (runtime.dataLayer) runtime.dataLayer.length = 0; }
    frame?.remove(); frame = null; ready = false; pendingLeads = 0;
    deleteAnalyticsCookies();
  }
  if (expiry > Date.now()) expiryTimer = setTimeout(() => {
    const saved = readChoice();
    applyChoice(saved.choice, saved.expiresAt);
  }, Math.min(expiry - Date.now(), 2_147_483_647));
  listeners.forEach(listener => listener());
}

export function initializeAnalyticsConsent() {
  if (initialized) return;
  initialized = true;
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== frame?.contentWindow ||
        event.data?.source !== 'tehopiha-analytics' || event.data.type !== 'ready') return;
    ready = true; flushEvents();
  });
  const sync = () => { const saved = readChoice(); applyChoice(saved.choice, saved.expiresAt); };
  window.addEventListener('storage', event => { if (event.key === storageKey || event.key === null) sync(); });
  window.addEventListener('pageshow', sync);
  sync();
}

export function setAnalyticsConsent(choice: Exclude<AnalyticsConsent, null>) {
  const expiry = Date.now() + lifetime;
  try { localStorage.setItem(storageKey, JSON.stringify({ version: 1, choice, expiresAt: expiry })); } catch { /* In-memory choice still works. */ }
  applyChoice(choice, expiry);
}

export const getAnalyticsConsent = () => consent;
export function subscribeAnalyticsConsent(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function trackSuccessfulQuotation() {
  // No parameters: in particular, no customer details or project information.
  // Analytics failure must never change a successful form's UI or delivery result.
  try {
    if (consent !== 'granted' || Date.now() >= expiresAt) return;
    pendingLeads++; flushEvents();
  } catch { /* Analytics is optional, including when scripts/storage are blocked. */ }
}
