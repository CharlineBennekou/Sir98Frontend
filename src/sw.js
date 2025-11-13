// Use Workbox to precache assets injected at build time
import { precacheAndRoute } from 'workbox-precaching';

// This array is injected by vite-plugin-pwa / workbox at build time
precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
}); 

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
});

// Handle notification events
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  console.log('Notification clicked');
  // You can focus/open a client here later if you want
});

self.addEventListener("push", (event) => {
  console.log("Push event received", event);

  event.waitUntil(
    self.registration.showNotification("Push Notification", {
      body: "This is a push message triggered from DevTools!",
      tag: "devtools-push",
    })
  );
});
