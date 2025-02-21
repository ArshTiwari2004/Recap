importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (workbox) {
    console.log("Workbox is successfully loaded 🎉");

    // Precache assets (optional, if using Workbox precaching)
    workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

    // Cache images using a NetworkFirst strategy
    workbox.routing.registerRoute(
        ({ request }) => request.destination === 'image',
        new workbox.strategies.NetworkFirst({
            cacheName: 'image-cache',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 50, // Keep last 50 images
                    maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
                }),
            ],
        })
    );

} else {
    console.log("Workbox failed to load :(");
}
