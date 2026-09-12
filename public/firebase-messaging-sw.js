/* eslint-disable no-undef */
// Scripts for Firebase App and Firebase Messaging in Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// Initialize Firebase inside the Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyDxRpA-aiGJJK9Vf6U6nv38_E06RUykfNE",
  authDomain: "enhanced-melody-mmjvc.firebaseapp.com",
  projectId: "enhanced-melody-mmjvc",
  storageBucket: "enhanced-melody-mmjvc.firebasestorage.app",
  messagingSenderId: "709530437507",
  appId: "1:709530437507:web:d760471c7c24a8a1ba58b6"
});

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message: ', payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || 'NUR AI High School';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'New notification from NUR AI',
    icon: '/assets/app-icon.png',
    badge: '/assets/badge-icon.png',
    tag: payload.data?.id || 'nur-ai-notification',
    data: {
      url: payload.data?.deepLink || '/',
      id: payload.data?.id,
      type: payload.data?.type,
      recipientId: payload.data?.recipientId,
    },
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open', title: 'ክፈት / Open' },
      { action: 'dismiss', title: 'ዝጋ / Dismiss' }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click and deep-linking
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open, focus it and post a message
      for (let client of windowClients) {
        if ('focus' in client) {
          client.postMessage({
            type: 'NOTIFICATION_CLICKED',
            payload: event.notification.data
          });
          return client.focus();
        }
      }
      // If not, open a new window with the deep link
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
