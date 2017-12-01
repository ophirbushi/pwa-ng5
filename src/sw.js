const appShellCacheName = 'shell-3';

var urlsToCache = [
  '/',
];

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(appShellCacheName)
    .then(function (cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function (event) {
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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(appShellCacheName).then((cache) => {
      return cache.match(event.request).then((response) => {
        let responseTextPromise = response && typeof response.text === 'function' && typeof response.clone === 'function' ?
          response.clone().text() : Promise.resolve(null);


        var fetchPromise = fetch(event.request).then((networkResponse) => {
          if (event.request.url.indexOf('chrome-extension') !== 0) {
            cache.put(event.request, networkResponse.clone());

            const networkResponseTextPromise = networkResponse && typeof networkResponse.text === 'function' && typeof networkResponse.clone === 'function' ?
              networkResponse.clone().text() : Promise.resolve(null);

            networkResponseTextPromise.then(nt => {
              responseTextPromise.then((t) => {
                if (t != nt) {
                  self.clients.matchAll().then(all => all.map(client => {
                    setTimeout(() => {
                      client.postMessage('update');
                    }, 3000)
                  }));
                }
              });
            })

          }

          return networkResponse;
        })
        return response || fetchPromise;
      })
    })
  );
});
