/*
 * The app's service worker: lets the site be installed as an app and opens pages faster.
 * - Only this site's own files are handled; the server (Apps Script) is never cached.
 * - Everything (pages, config.js, code, styles, images): the saved copy at once, refreshed in the
 *   background, so a page opens without waiting for the network. A page never saved before
 *   comes from the network. Changes to config.js are picked up on the next page opened.
 * Each build writes its own version below, so a new upload replaces the old saved files.
 */
const VERSION = '20261027005959';
const CACHE = 'tga-' + VERSION;
const CORE = ['js/app.js?v=' + VERSION, 'css/app.css?v=' + VERSION, 'logo.png', 'icons/icon-192.png', 'manifest.webmanifest'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE.map((p) => new URL(p, self.registration.scope).toString()))).catch(() => null)
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('tga-') && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

function save(req, res) {
  if (res && res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
  return res;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  const page = req.mode === 'navigate' || /\.html$|\/$/.test(url.pathname);
  if (page) {
    // The page's address may carry ?open=… or ?go=…: the saved page is the same file.
    e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => {
      const net = fetch(req).then((res) => save(new Request(url.origin + url.pathname), res), () => hit
        || caches.match(new URL('dashboard.html', self.registration.scope).toString()));
      return hit || net;
    }));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => {
    const net = fetch(req).then((res) => save(req, res), () => hit);
    return hit || net;
  }));
});

/*
 * Push notifications (JOBE, 2026-10-24): the server sends each notice and message through Firebase
 * Cloud Messaging with { title, body, link, unread }. Shown here even when TGA is closed; unread sets
 * the number on the app icon. A click opens (or focuses) the page the notice links to.
 */
self.addEventListener('push', (e) => {
  let d = {};
  try { const j = e.data ? e.data.json() : {}; d = j.data || j; } catch (x) { d = { body: e.data ? e.data.text() : '' }; }
  const scope = self.registration.scope;
  let link = new URL('dashboard.html', scope).toString();
  try { const u = new URL(d.link || 'dashboard.html', scope); if (u.origin === self.location.origin) link = u.toString(); } catch (x) { /* keep the dashboard */ }
  const unread = Number(d.unread) || 0;
  const badge = 'setAppBadge' in self.navigator
    ? (unread > 0 ? self.navigator.setAppBadge(unread) : self.navigator.clearAppBadge()).catch(() => null) : Promise.resolve();
  e.waitUntil(Promise.all([badge, self.registration.showNotification(d.title || 'The Gambia Academy', {
    body: d.body || '', icon: new URL('icons/icon-192.png', scope).toString(), badge: new URL('icons/icon-192.png', scope).toString(),
    data: { link }, tag: d.type === 'message' ? link : undefined, renotify: d.type === 'message'
  })]));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const link = (e.notification.data && e.notification.data.link) || self.registration.scope;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    const same = list.find((c) => c.url === link);
    if (same) return same.focus();
    const any = list.find((c) => c.url.startsWith(self.registration.scope));
    if (any && 'navigate' in any) return any.focus().then(() => any.navigate(link)).catch(() => self.clients.openWindow(link));
    return self.clients.openWindow(link);
  }));
});
