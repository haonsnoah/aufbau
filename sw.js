/* Offline-Speicher für die App-Hülle. Daten kommen immer frisch von Supabase;
   ohne Netz zeigt die App den letzten Stand aus dem Browser-Speicher. */
var VERSION = "aufbau-v1";
var SHELL = [
  "./", "./index.html", "./manifest.webmanifest",
  "./icons/icon-180.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon.svg",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (/supabase\.co$|openfoodfacts\.org$/.test(url.hostname)) return;
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(function (res) {
      var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put("./index.html", copy); }); return res;
    }).catch(function () { return caches.match("./index.html"); }));
    return;
  }
  e.respondWith(caches.match(req).then(function (hit) {
    return hit || fetch(req).then(function (res) {
      if (res.ok && (url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$|jsdelivr\.net$/.test(url.hostname))) {
        var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); });
      }
      return res;
    });
  }));
});
