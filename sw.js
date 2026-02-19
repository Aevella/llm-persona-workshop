const CACHE_NAME = "pbw-shell-v1";
const SHELL_ASSETS = [
  "./",
  "./home.html",
  "./index.html",
  "./agent.html",
  "./story.html",
  "./intuition.html",
  "./vault.html",
  "./quick-main.css",
  "./quick-main.js",
  "./quick-i18n.js",
  "./quick-engine.js",
  "./quick-ui.js",
  "./agent.css",
  "./agent.js",
  "./story.css",
  "./story.js",
  "./intuition.css",
  "./intuition.js",
  "./workshop-home.css",
  "./shared-utils.js",
  "./manifest.webmanifest",
  "./manifest.zh.webmanifest",
  "./manifest.en.webmanifest",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("./home.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
