var V='egi-1.5',TJS='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(V).then(function(c){
    return Promise.all([c.add('./').catch(function(){}),c.add(new Request(TJS,{mode:'no-cors'})).catch(function(){})]);
  }).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;
  var u=new URL(r.url);
  if(u.origin===location.origin){
    e.respondWith(fetch(r).then(function(res){
      if(res&&res.ok){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)})}
      return res;
    }).catch(function(){
      return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match('./')});
    }));
  }else if(u.href===TJS){
    e.respondWith(caches.match(r).then(function(m){return m||fetch(r)}));
  }
});
