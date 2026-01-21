import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

//Initialize the service worker and take control of clients as soon as possible
self.skipWaiting();
clientsClaim();


cleanupOutdatedCaches();
// no precacheAndRoute call


self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
    event.waitUntil( // When service worker activates, clear old caches
    (async () => {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
    })()
  );
});
  

self.addEventListener('push', (event) => {
  console.log('Push event received', event);

  if (!event.data) {
    // Fallback if no payload was sent
    event.waitUntil(
      self.registration.showNotification('Push Notification', {
        body: 'No data payload received',
        tag: 'no-data',
      })
    );
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch (e) {
    console.error('Failed to parse push event data as JSON', e);
    event.waitUntil(
      self.registration.showNotification('Push Notification', {
        body: 'Invalid payload',
        tag: 'invalid-payload',
      })
    );
    return;
  }

  const title = data.title || 'Push Notification';
  const body = data.body || 'No message';
  const url = data.url || '/';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag: `push-${Date.now()}`,
      data: { url },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  console.log('Notification clicked');

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Try to reuse an existing tab
      for (const client of windowClients) {
        // If it's already on our origin, focus it and navigate
        if (client.url.startsWith(self.location.origin)) {
          client.focus();
          client.navigate(urlToOpen);
          return;
        }
      }

      // Otherwise open a new tab/window
      return clients.openWindow(urlToOpen);
    })
  );
});
