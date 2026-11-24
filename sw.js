const CACHE_NAME = 'instalacion-nativa-v1';
const ARCHIVOS_BASE = ['./', './index.html', './styles.css', './app.js', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS_BASE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((claves) => Promise.all(claves.filter((clave) => clave !== CACHE_NAME).map((clave) => caches.delete(clave)))));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(caches.match(event.request).then((respuesta) => respuesta || fetch(event.request)));
});
