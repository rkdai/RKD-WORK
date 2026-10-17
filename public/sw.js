const CACHE_NAME = 'workos-cache-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Listen for message from frontend to show notifications
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SEND_NOTIFICATION') {
    const title = event.data.title || 'RKD WorkOS Attendance Reminder';
    const options = {
      body: event.data.options?.body || 'Please mark today\'s attendance and log deliverables.',
      icon: event.data.options?.icon || '/icons/icon-192.png',
      badge: event.data.options?.badge || '/icons/icon-192.png',
      vibrate: [200, 100, 200],
      tag: event.data.options?.tag || 'workos-reminder',
      renotify: true,
      data: {
        url: '/',
      },
    };
    self.registration.showNotification(title, options);
  }
});

// Handle notification click to open or focus app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});
