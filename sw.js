/* WallRush service worker — v1.4.0: network-first app shell + cache-first assets */
"use strict";
const CACHE = "wallrush-v1.4.0";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
  "./icons/icon-180.png"
];
const SHELL = new Set(["./", "./index.html", "index.html", "./index.html?"]);

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS))          // addAll overwrites any stale entries
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  // App shell (index.html): network-first so players always receive the
  // latest game code while online; cache serves it when offline.
  if (e.request.mode === "navigate" || SHELL.has(url.pathname) || url.pathname.endsWith("/index.html")) {
    e.respondWith(
      fetch(e.request).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || caches.match("./index.html")))
    );
    return;
  }

  // Static assets: cache-first with runtime fill.
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
