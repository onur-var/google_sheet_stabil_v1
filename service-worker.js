self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
    event.waitUntil(
        caches.open('static-cache').then(cache => {
            return cache.addAll([
                './',
                './index.html',
                './style.css',
                './app.js',
                './icon-192.png',
                './icon-512.png'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
