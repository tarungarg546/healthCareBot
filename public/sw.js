var cacheName='offFinal';
var requiredFiles=[
  'offlinePage.html',
  'css/materialize.min.css',
  'js/jquery-2.1.1.min.js',
  'js/materialize.min.js',
  'https://cdn.socket.io/socket.io-1.3.7.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];
self.addEventListener('install', function(event) {
  // Perform install step:  loading each required file into caches
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(requiredFiles);
    })
  );
});
self.addEventListener('fetch', function(event) {
  var request = event.request;
  if (request.method === 'GET') {
    event.respondWith(
      caches.open(cacheName).then(function(cache) {
        return cache.match(event.request).then(function (response) {
          return response || fetch(event.request.clone()).then(function(response) {
            return response;
          }).catch(function(){
            return cache.match('offlinePage.html');
          });
        });
      })
    );
  }
});
this.addEventListener('activate', function(event) {
  var cacheWhitelist = [cacheName];
  event.waitUntil(
    caches.keys().then(function(keyList) {
      console.log(keyList);
      return Promise.all(keyList.map(function(key) {
        console.log(key);
        if (cacheWhitelist.indexOf(key) <= -1) {
          return caches.delete(key);
        }
      })
      );
    })
  );
});