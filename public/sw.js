const CACHE_NAME = 'mdtopdf-pro-v2';
const STATIC_CACHE = 'mdtopdf-static-v2';
const DYNAMIC_CACHE = 'mdtopdf-dynamic-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Fichiers essentiels
  '/images/logo.webp',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png'
];

// Fichiers à mettre en cache avec stratégie cache-first
const cacheFirstResources = [
  /\.js$/,
  /\.css$/,
  /\.woff2?$/,
  /\.ttf$/,
  /\.eot$/,
  /\.svg$/
];

// Fichiers à mettre en cache avec stratégie network-first
const networkFirstResources = [
  '/api/',
  'https://fonts.googleapis.com/'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching essential files');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache essential files', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Stratégie de cache : Cache First
const cacheFirst = async (request) => {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Mettre à jour le cache en arrière-plan
      fetch(request).then((response) => {
        if (response.ok) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone());
          });
        }
      });
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Cache First failed', error);
    throw error;
  }
};

// Stratégie de cache : Network First
const networkFirst = async (request) => {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
};

// Stratégie de cache : Stale While Revalidate
const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
};

// Intercepter les requêtes
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignorer les requêtes Chrome DevTools
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Stratégies de cache basées sur le type de ressource
  if (cacheFirstResources.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(cacheFirst(request));
  } else if (networkFirstResources.some(pattern => url.href.includes(pattern))) {
    event.respondWith(networkFirst(request));
  } else if (url.origin === self.location.origin) {
    // Pour les ressources locales, utiliser stale while revalidate
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Background Sync pour les actions hors ligne
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Synchroniser les données sauvegardées hors ligne
      console.log('Service Worker: Background sync triggered')
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/images/icon-192x192.png',
    badge: '/images/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explorer',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/images/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('MDtoPDF Pro', options)
  );
});

// Gérer les clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Fermer la notification
  } else {
    // Comportement par défaut : ouvrir l'application
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling pour la communication avec le client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Nettoyage du cache périodique
const cleanupCache = async () => {
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    const now = Date.now();

    // Supprimer les entrées plus vieilles que 7 jours
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const dateHeader = response.headers.get('date');
        if (dateHeader && new Date(dateHeader).getTime() < sevenDaysAgo) {
          await cache.delete(request);
          console.log('Service Worker: Deleted stale cache entry', request.url);
        }
      }
    }
  } catch (error) {
    console.error('Service Worker: Cache cleanup failed', error);
  }
};

// Nettoyer le cache quotidiennement
setInterval(cleanupCache, 24 * 60 * 60 * 1000);