const PREFIX='fieldtrip-student-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+'d82971230b73';
const FILES=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
const URLS=new Set(FILES.map(p=>new URL(p,self.registration.scope).href));
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||!URLS.has(e.request.url))return;e.respondWith(caches.open(CACHE).then(async cache=>{const found=await cache.match(e.request);if(found)return found;const response=await fetch(e.request);if(response.ok)await cache.put(e.request,response.clone());return response;}));});
