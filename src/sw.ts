declare interface Window {
  clients;
}

const appShellCacheName = 'shell-3';

var urlsToCache = [
  '/',
];

self.addEventListener('install', function (event: any) {
  // Perform install steps
  event.waitUntil(
    caches.open(appShellCacheName)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function (event: any) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== appShellCacheName)
          .map(function (cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener('fetch', (event: any) => {
  if (event.request.url.indexOf('chrome-extension') === 0) return event.respondWith(null);

  const eventResponse = caches.open(appShellCacheName)
    .then(async (cache) => {
      const cacheResponse = await cache.match(event.request);

      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          compareResponses(cacheResponse.clone(), networkResponse.clone());
          return networkResponse;
        });

      return cacheResponse ? cacheResponse.clone() : fetchPromise;
    });

  event.respondWith(eventResponse);
});

async function compareResponses(cacheResponse: Response, networkResponse: Response) {
  if (!cacheResponse || cacheResponse.status / 100 >= 4 || !networkResponse || networkResponse.status / 100 >= 4) return;

  const cacheResponseText = await cacheResponse.text();
  const networkResponseText = await networkResponse.text();

  if (cacheResponseText !== networkResponseText) {
    const clients: any[] = await self.clients.matchAll();
    clients.forEach(client => setTimeout(() => client.postMessage('update'), 3000));
  }
}
