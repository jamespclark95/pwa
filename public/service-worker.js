const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/db.js",
  "/index.js",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(RUNTIME).then((cachedResponse) => {
        return fetch(event.request)
          .then((response) => {
            if (response.status === 200) {
              cachedResponse.put(event.request.url, response.clone());
            }
            return response;
          })
          .catch(err => {
              return cachedResponse.match(event.request)
          });
      }).catch(err => console.log(err))
    );
    return;
  }
  event.respondWith(
      fetch(event.request).catch(function() {
          return caches.match(event.request).then(response => {
              if (response) {
                  return response;
              }
              else if (event.request.headers.get('accept').includes('text/html')) {
                  return caches.match('/')
              }
          })
      })
  )
});
