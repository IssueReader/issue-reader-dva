(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{824:function(e,t,r){"use strict";r.r(t);var n=r(6),a=r.n(n),u=r(161);function o(e){return function(e){if(Array.isArray(e)){for(var t=0,r=new Array(e.length);t<e.length;t++)r[t]=e[t];return r}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},n=Object.keys(r);"function"===typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(r).filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable}))),n.forEach(function(t){c(e,t,r[t])})}return e}function c(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}t.default={namespace:"watching",state:{list:[],loading:!1},subscriptions:{setup:function(e){var t=e.dispatch;return e.history.listen(function(e){var r=e.pathname,n=e.search;if("/user/watching"===r)return t({type:"load",payload:{search:n}})})}},effects:{load:a.a.mark(function e(t,r){var n,o,c,i,p,l,f,d,y;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t.payload,n=r.call,o=r.put,c=r.select,e.next=4,c(function(e){return e.watching});case 4:if(i=e.sent,!i.loading){e.next=8;break}return e.abrupt("return");case 8:return e.next=10,o({type:"save",payload:{list:void 0,loading:!0}});case 10:return e.next=12,n(u.a.getWatching);case 12:return p=e.sent,l=p.data,e.next=16,o({type:"save",payload:{loading:!1}});case 16:if(l){e.next=20;break}return e.next=19,o({type:"save",payload:{list:null}});case 19:return e.abrupt("return",e.sent);case 20:return e.next=22,c(function(e){return e.app});case 22:return f=e.sent,d=f.repos,y=l.list.map(function(e){var t=d.findIndex(function(t){return e.repo===t.repo&&e.owner===t.owner});return s({},e,{watch:-1!==t})}),e.next=27,o({type:"save",payload:{list:y}});case 27:return e.abrupt("return",e.sent);case 28:case"end":return e.stop()}},e,this)}),subscribe:a.a.mark(function e(t,r){var n,u,o;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(n=t.payload,u=r.put,r.call,!n.loading){e.next=4;break}return e.abrupt("return");case 4:return e.next=6,u.resolve({type:"update",payload:s({},n,{loading:!0})});case 6:return e.next=8,u.resolve({type:"app/subscribe",payload:n});case 8:return o=e.sent,e.next=11,u.resolve({type:"update",payload:s({},n,{loading:!1,watch:o})});case 11:case"end":return e.stop()}},e,this)}),unsubscribe:a.a.mark(function e(t,r){var n,u,o;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(n=t.payload,u=r.put,r.call,!n.loading){e.next=4;break}return e.abrupt("return");case 4:return e.next=6,u.resolve({type:"update",payload:s({},n,{loading:!0})});case 6:return e.next=8,u.resolve({type:"app/unsubscribe",payload:n});case 8:return o=e.sent,e.next=11,u.resolve({type:"update",payload:s({},n,{loading:!1,watch:!o})});case 11:case"end":return e.stop()}},e,this)}),update:a.a.mark(function e(t,r){var n,u,c,i,p,l,f;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.payload,u=r.put,c=r.select,e.next=4,c(function(e){return e.watching});case 4:if(i=e.sent,p=i.list){e.next=8;break}return e.abrupt("return");case 8:if(-1!==(l=p.findIndex(function(e){return n.owner===e.owner&&n.repo===e.repo}))){e.next=11;break}return e.abrupt("return");case 11:return(f=o(p))[l]=s({},f[l],n),e.next=15,u({type:"save",payload:{list:f}});case 15:case"end":return e.stop()}},e,this)})},reducers:{save:function(e,t){return s({},e,t.payload)}}}}}]);
//# sourceMappingURL=3.435f8bbd.chunk.js.map