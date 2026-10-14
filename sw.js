/*
 * The app's service worker: lets the site be installed as an app and opens pages faster.
 * - Only this site's own files are handled; the server (Apps Script) is never cached.
 * - Everything (pages, config.js, code, styles, images): the saved copy at once, refreshed in the
 *   background, so a page opens without waiting for the network. A page never saved before
 *   comes from the network. Changes to config.js are picked up on the next page opened.
 * Each build writes its own version below, so a new upload replaces the old saved files.
 */
const VERSION = '20261014105107';
const CACHE = 'tga-' + VERSION;
const CORE = ['js/app.js', 'css/app.css', 'logo.png', 'icons/icon-192.png', 'manifest.webmanifest'];

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
