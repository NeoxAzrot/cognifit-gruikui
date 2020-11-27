// nom du cache
var cacheName = 'hello-pwa'; 

// liste des fichiers à mettre en cache
var filesToCache = [
  './',
  'index.html',
  'css/style.css',
  'js/main.js'
];

// Lance le service worker and met en cache tout le contenu de l'application
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

// Sert le contenu hors ligne
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
