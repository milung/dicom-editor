var CACHE_NAME = 'pwa-dicom-viewer-cache-v1';
var urlsToCache = [
    '.',
    'bundle.js',
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

self.addEventListener('fetch', function (event) {
    console.log('FETCHING START');
    event.respondWith(
        fetch(event.request).catch(function () {
            console.log('Match ' + event.request);
            return caches.match(event.request);
        })
    );
    console.log('FETCHING END');
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