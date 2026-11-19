const PREFIX='fieldtrip-student-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+'bd39e8db7101';
const FILES=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
const URLS=new Set(FILES.map(p=>new URL(p,self.registration.scope).href));
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(p=>new Request(p,{cache:'reload'}))))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||!URLS.has(e.request.url))return;e.respondWith(caches.open(CACHE).then(async cache=>{const found=await cache.match(e.request);if(found)return found;const response=await fetch(e.request);if(response.ok)await cache.put(e.request,response.clone());return response;}));});
self.addEventListener('message',e=>{if(e.data?.type!=='TRIP_OFFLINE_STATUS'||!e.ports?.[0])return;e.waitUntil(caches.open(CACHE).then(async c=>{const found=await Promise.all(FILES.map(p=>c.match(new URL(p,self.registration.scope).href)));e.ports[0].postMessage({type:'TRIP_OFFLINE_STATUS',ready:found.every(Boolean),version:CACHE});}).catch(()=>e.ports[0].postMessage({type:'TRIP_OFFLINE_STATUS',ready:false})));});
