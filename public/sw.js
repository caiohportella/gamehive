// Service Worker for PWA
const CACHE_NAME = "gamehive-v2";
const ASSETS_CACHE_NAME = "gamehive-assets-v2";
const DATA_CACHE_NAME = "gamehive-data-v2";

// Assets to cache
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/apple-touch-icon.png",
];

// Install service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(ASSETS_CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== ASSETS_CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch handler
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }
  
  // Cache API responses
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          return response || fetch(event.request).then((response) => {
            // Clone and cache the response
            const responseClone = response.clone();
            cache.put(event.request, responseClone);
            return response;
          });
        });
      })
    );
  }
  
  // Cache static assets
  if (url.origin === self.location.origin && ASSETS_TO_CACHE.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
  
  // Cache images
  if (event.request.destination === "image") {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          return response || fetch(event.request).then((response) => {
            // Clone and cache the response
            const responseClone = response.clone();
            cache.put(event.request, responseClone);
            return response;
          });
        });
      })
    );
  }
});

// Background sync for offline data
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-user-data") {
    event.waitUntil(syncUserData());
  }
});

async function syncUserData() {
  // Implement background sync logic here
  console.log("Syncing user data...");
}

// Push notifications
self.addEventListener("push", (event) => {
  const data = event.data?.json();
  if (data) {
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon || "/icons/icon-192x192.png",
        data: data.url,
      })
    );
  }
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.notification.data) {
    clients.openWindow(event.notification.data);
  }
});
