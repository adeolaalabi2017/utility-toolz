// Bump CACHE_VERSION whenever the caching rules below change; activate() then
// drops every cache from older versions.
const CACHE_VERSION = "v2";
const SHELL_CACHE = `utility-toolz-shell-${CACHE_VERSION}`;
const PAGE_CACHE = `utility-toolz-pages-${CACHE_VERSION}`;
const STATIC_CACHE = `utility-toolz-static-${CACHE_VERSION}`;
const CURRENT_CACHES = [SHELL_CACHE, PAGE_CACHE, STATIC_CACHE];

const MAX_PAGES = 60;
const MAX_STATIC = 250;

const PRECACHE_ASSETS = [
  "/",
  "/manifest.json",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png"
];

// Drop the oldest entries so the caches can't grow without bound.
async function trimCache(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) {
    await cache.delete(keys[i]);
  }
}

async function putInCache(name, req, res, max) {
  const cache = await caches.open(name);
  await cache.put(req, res);
  await trimCache(name, max);
}

// 1. Install & precache shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

// 2. Clean up caches from older versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !CURRENT_CACHES.includes(k)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 3. Fetch routing
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET requests originating from same origin
  if (req.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Client-side navigation payloads (React Server Components) change with every
  // deploy and are keyed by headers, so leave them to the network.
  if (url.searchParams.has("_rsc") || req.headers.get("RSC")) {
    return;
  }

  // A. Next.js static chunks are content-hashed and immutable -> Cache First
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((networkRes) => {
          if (networkRes.ok) {
            event.waitUntil(putInCache(STATIC_CACHE, req, networkRes.clone(), MAX_STATIC));
          }
          return networkRes;
        });
      })
    );
    return;
  }

  // B. Navigation requests (HTML pages) -> Network First, so a deploy is picked
  // up straight away; the cached copy is only the offline fallback.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes.ok) {
            event.waitUntil(putInCache(PAGE_CACHE, req, networkRes.clone(), MAX_PAGES));
          }
          return networkRes;
        })
        .catch(async () => (await caches.match(req)) || caches.match("/"))
    );
    return;
  }

  // C. API calls (e.g. currency rates) -> Network First with cached fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes.ok) {
            event.waitUntil(putInCache(PAGE_CACHE, req, networkRes.clone(), MAX_PAGES));
          }
          return networkRes;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // D. Images and icons -> Stale-While-Revalidate. Anything else (sitemap,
  // robots.txt, the manifest, sw.js itself) goes straight to the network.
  if (req.destination === "image") {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req)
          .then((networkRes) => {
            if (networkRes.ok) {
              event.waitUntil(putInCache(STATIC_CACHE, req, networkRes.clone(), MAX_STATIC));
            }
            return networkRes;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});
