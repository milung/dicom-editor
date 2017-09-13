var CACHE_NAME = 'pwa-dicom-viewer-cache-v1';
var urlsToCache = [
    'bundle.js',
    'service-worker.js',
    '',
    'index.html',
    'assets/manifest.json',
    'assets/js/cornerstone-library/cornerstoneWADOImageLoaderWebWorker.js',
    'assets/js/cornerstone-library/cornerstone.js',
    'assets/js/cornerstone-library/codecs/Allcodecs.min.js',
    'assets/img/logo.ico',
    'assets/img/logo.png'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      return response || fetchAndCache(event.request);
    })
  );
});

function fetchAndCache(url) {
  return fetch(url)
  .then(function(response) {
    // Check if we received a valid response
    if (!response.ok) {
        console.log('Request failed:', response);
    }
    return caches.open(CACHE_NAME)
    .then(function(cache) {
      cache.put(url, response.clone());
      return response;
    });
  })
  .catch(function(error) {
    console.log('Request failed:', error);
  });
}

self.addEventListener("activate", function (event) {
    var cacheWhitelist = ['pwa-dicom-viewer-cache-v1'];

    event.waitUntil(
        caches.keys()
            .then(function (allCaches) {
                //Check all caches and delete old caches here
                allCaches.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                });
            })
    );
});