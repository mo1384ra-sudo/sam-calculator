const CACHE_NAME = 'sam-calculator-v2';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './script.js',
  './style.css',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap',
  // عکس‌ها
  'https://i.ibb.co/RTx5Vrd9/1.jpg',
  'https://i.ibb.co/3YyWNxKx/nozzel.jpg',
  'https://i.ibb.co/5gqjD1dp/distance.jpg'
];

// نصب سرویس ورکر و کش کردن فایل‌ها
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('کش کردن فایل‌ها و عکس‌ها...');
        // از Promise.allSettled استفاده می‌کنیم تا اگر یکی از عکس‌ها لود نشد کل کار خراب نشه
        return Promise.allSettled(
          ASSETS_TO_CACHE.map((url) => cache.add(url).catch((err) => {
            console.warn('نتونست کش کنه:', url, err);
          }))
        );
      })
      .then(() => self.skipWaiting())
  );
});

// فعال‌سازی و پاک کردن کش‌های قدیمی
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('پاک کردن کش قدیمی:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// استراتژی: اول کش → اگر نبود از شبکه بگیر و کش کن
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            // حتی پاسخ‌های opaque (عکس‌های خارجی) رو هم کش کن
            if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch(() => {
            // اگر آفلاین بود
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
            // برای عکس‌ها یا فایل‌های دیگه چیزی برنگردون (یا می‌تونی یه عکس جایگزین بذاری)
          });
      })
  );
});
