var CACHE_NAME = 'pwa-dicom-viewer-cache-v1';
var urlsToCache = [
    '.',
    'bundle.js',
    'assets/manifest.json'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request).catch(function () {
            return caches.match(event.request);
        })
    );
});

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