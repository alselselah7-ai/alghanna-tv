importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
// Service worker: offline shell only. Never caches API/YouTube/GitHub requests.
const V="alghanna-v3",SHELL=["./","icon-192.png","icon-512.png","favicon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=="GET"||u.origin!==location.origin)return;
 if(r.mode==="navigate"){e.respondWith(fetch(r).then(x=>{const y=x.clone();caches.open(V).then(c=>c.put("./",y));return x}).catch(()=>caches.match("./")));return}
 e.respondWith(fetch(r).then(x=>{if(x.ok&&/\.(png|css|js|json|webmanifest)$/.test(u.pathname)){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x}).catch(()=>caches.match(r)));
});
