const CACHE='powercap-v4-1';
const ASSETS=['./','./index.html','./css/style.css','./js/app.js','./js/calculations.js','./js/harmonics.js','./js/products.js','./js/reports.js','./js/database.js','./manifest.json','./data/weg.json','./data/abb.json','./data/schneider.json','./assets/icons/icon-192.png','./assets/icons/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('./index.html'))))});
