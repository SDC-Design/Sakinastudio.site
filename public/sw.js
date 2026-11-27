/* Service worker de Sakina Studio : rend le site installable et utilisable avec une connexion instable.
   Il ne met JAMAIS en cache l'administration, l'espace client, les API ni les échanges avec Supabase. */
const VERSION = "sakina-v1";
const STATIC = `${VERSION}-static`;
const PAGES = `${VERSION}-pages`;
const PRECACHE = ["/offline", "/brand/logo-dark.svg", "/brand/monogram-white.svg", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;                          // Supabase et autres domaines : réseau direct
  if (/^\/(admin|api|auth|espace-client)(\/|$)/.test(url.pathname)) return; // zones privées : réseau direct

  if (req.mode === "navigate") {                                            // pages : réseau d'abord, copie en cas de coupure
    event.respondWith(
      fetch(req).then((res) => { const copy = res.clone(); caches.open(PAGES).then((c) => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then((r) => r || caches.match("/offline")))
    );
    return;
  }
  if (url.pathname.startsWith("/_next/static/")) {                          // fichiers versionnés : cache d'abord
    event.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { const copy = res.clone(); caches.open(STATIC).then((c) => c.put(req, copy)); return res; })));
    return;
  }
  if (/^\/(images|brand|icons|fonts|placeholders)\//.test(url.pathname)) { // visuels : affichage immédiat puis mise à jour
    event.respondWith(caches.open(STATIC).then((c) => c.match(req).then((hit) => {
      const net = fetch(req).then((res) => { c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })));
  }
});
