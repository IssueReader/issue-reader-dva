"use strict";var precacheConfig=[["/index.html","97ca4e43b821e48e2ecbf309b13ae28d"],["/static/css/2.6af0096d.chunk.css","86a81d2f09254b05daf82f14ac264b63"],["/static/css/4.6be64644.chunk.css","a569ecef129ff05a5907b19556ed0862"],["/static/css/main.c7faebca.chunk.css","4d453b24b501e0dd5d17d9555ec54a11"],["/static/css/vendors.65964478.chunk.css","9c58c4467c2fbfc8b2ef9468bfce335c"],["/static/js/1.0aab4cc6.chunk.js","b5e5804764d210d43309f12b15864be0"],["/static/js/2.bce49913.chunk.js","d6b6442f5c9c5f7c0edf29e8f7bcafbd"],["/static/js/3.b3bf6f3f.chunk.js","da086dd778d5df33db616fdeed81852e"],["/static/js/4.24fa69ff.chunk.js","eaf8e2d57fa1bdc5c1587bd698b81008"],["/static/js/5.1e266981.chunk.js","f99c79a78cac770a66bc0910d093f100"],["/static/js/6.7c400a21.chunk.js","1ebc97743da66ffa8d3800cfbb878d31"],["/static/js/7.e8dd0422.chunk.js","e046f1c94a7bac03d1cb12692e6e892e"],["/static/js/8.68b673b4.chunk.js","927c46d1f15cc4c736482e1c7a023cda"],["/static/js/main.2c626bd3.chunk.js","939aed5a23d8dc2e9e3ea7a0a6229656"],["/static/js/runtime~main.6e20bbfb.js","96a2e1bd7689b3cf65f358f2388702c6"],["/static/js/vendors.7c15f6d9.chunk.js","ae675580a8eaab7ff352f6c65ea8731f"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=t),n.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(t){return new Response(t,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,t,n,c){var a=new URL(e);return c&&a.pathname.match(c)||(a.search+=(a.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(n)),a.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var n=new URL(t).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,t){var n=new URL(e);return n.hash="",n.search=n.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return t.every(function(t){return!t.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),n.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],n=e[1],c=new URL(t,self.location),a=createCacheKey(c,hashParamName,n,/\.\w{8}\./);return[c.toString(),a]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(n){if(!t.has(n)){var c=new Request(n,{credentials:"same-origin"});return fetch(c).then(function(t){if(!t.ok)throw new Error("Request for "+n+" returned a response with status "+t.status);return cleanResponse(t).then(function(t){return e.put(n,t)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(n){return Promise.all(n.map(function(n){if(!t.has(n.url))return e.delete(n)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var t,n=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);(t=urlsToCacheKeys.has(n))||(n=addDirectoryIndex(n,"index.html"),t=urlsToCacheKeys.has(n));0,t&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(t){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,t),fetch(e.request)}))}});