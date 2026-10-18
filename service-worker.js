const PREFIX='clinic-pages-original-'+self.registration.scope;
const CACHE=PREFIX+'-v1';
const local=path=>new URL(path,self.registration.scope).href;
const SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png','./icons/apple-touch-icon.png','./icons/favicon-32.png'].map(local);
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(local('./'),copy)));}return response;}).catch(()=>caches.match(local('./'))));return;}if(SHELL.includes(url.href))event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));});
self.addEventListener('notificationclick',event=>{event.notification.close();const view=event.notification.data?.view==='personal'?'personal':'alerts';event.waitUntil(self.clients.openWindow(local('./?view='+view)));});
