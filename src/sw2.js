var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const appShellCacheName = 'shell-3';
var urlsToCache = [
  '/',
];
self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(caches.open(appShellCacheName)
      .then(function (cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
  }));
});
self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (cacheNames) {
      return Promise.all(cacheNames
          .filter(cacheName => cacheName !== appShellCacheName)
          .map(function (cacheName) {
          return caches.delete(cacheName);
      }));
  }));
});
self.addEventListener('fetch', (event) => {
  if (event.request.url.indexOf('chrome-extension') === 0)
      return event.respondWith(null);
  const eventResponse = caches.open(appShellCacheName)
      .then((cache) => __awaiter(this, void 0, void 0, function* () {
      const cacheResponse = yield cache.match(event.request);
      const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          compareResponses(cacheResponse.clone(), networkResponse.clone());
          return networkResponse;
      });
      return cacheResponse.clone() || fetchPromise;
  }));
  event.respondWith(eventResponse);
});
function compareResponses(cacheResponse, networkResponse) {
  return __awaiter(this, void 0, void 0, function* () {
      if (cacheResponse.status / 100 >= 4 || networkResponse.status / 100 >= 4)
          return;
      const cacheResponseTextPromise = !!cacheResponse && typeof cacheResponse.text === 'function' ? cacheResponse.text() : Promise.resolve(null);
      const networkResponseTextPromise = !!networkResponse && typeof networkResponse.text === 'function' ? networkResponse.text() : Promise.resolve(null);
      const cacheResponseText = yield cacheResponseTextPromise;
      const networkResponseText = yield networkResponseTextPromise;
      if (cacheResponseText !== networkResponseText) {
          const clients = yield self.clients.matchAll();
          clients.forEach(client => setTimeout(() => client.postMessage('update'), 2000));
      }
  });
}
