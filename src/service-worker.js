var CACHE_NAME = 'pwa-dicom-viewer-cache-v1';
var urlsToCache = [
    '/',
    '/bundle.js',
    '/assets/js/cornerstone-library/cornerstoneWADOImageLoaderWebWorker.js',
    '/assets/js/cornerstone-library/cornerstone.js',
    '/assets/js/cornerstone-library/codecs/Allcodecs.min.js',
    '/assets/manifest.json',
    '/assets/img/logo.ico',
    '/assets/img/logo.png'
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
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});