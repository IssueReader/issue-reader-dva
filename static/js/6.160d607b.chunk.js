(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{529:function(e,t,a){"use strict";function r(e){return function(e){if(Array.isArray(e)){for(var t=0,a=new Array(e.length);t<e.length;t++)a[t]=e[t];return a}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}a.d(t,"a",function(){return r})},925:function(e,t,a){"use strict";a.r(t);var r=a(529),n=a(27),s=a(3),u=a.n(s),c=a(75),o=a.n(c),p=a(35);t.default={namespace:"all",state:{list:[],loading:!1,total:void 0,page:1,pageSize:20},subscriptions:{setup:function(e){var t=e.dispatch;return e.history.listen(function(e){var a=e.pathname,r=e.search;if("/all"===a)return t({type:"load",payload:{search:r}})})}},effects:{load:u.a.mark(function e(t,a){var r,n,s,c,i,l,d,f,b,y;return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.payload,n=a.call,s=a.put,c=a.select,i=o.a.parse(r.search),l=parseInt(i.page||1,10),e.next=6,c(function(e){return e.all});case 6:if(d=e.sent,f=d.pageSize,!d.loading){e.next=11;break}return e.abrupt("return");case 11:return e.next=13,s({type:"save",payload:{list:[],loading:!0,page:l}});case 13:return e.next=15,n(p.a.getIssues,(l-1)*f,f);case 15:return b=e.sent,y=b.data,e.next=19,s({type:"save",payload:{loading:!1,list:y&&y.list||null,total:y&&y.total}});case 19:case"end":return e.stop()}},e,this)}),subscribe:u.a.mark(function e(t,a){var r,s,c;return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r=t.payload,s=a.put,a.call,!r.loading){e.next=4;break}return e.abrupt("return");case 4:return e.next=6,s.resolve({type:"update",payload:Object(n.a)({},r,{loading:!0})});case 6:return e.next=8,s.resolve({type:"app/subscribe",payload:r});case 8:return c=e.sent,e.next=11,s.resolve({type:"update",payload:Object(n.a)({},r,{loading:!1,watch:c})});case 11:case"end":return e.stop()}},e,this)}),unsubscribe:u.a.mark(function e(t,a){var r,s,c;return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r=t.payload,s=a.put,a.call,!r.loading){e.next=4;break}return e.abrupt("return");case 4:return e.next=6,s.resolve({type:"update",payload:Object(n.a)({},r,{loading:!0})});case 6:return e.next=8,s.resolve({type:"app/unsubscribe",payload:r});case 8:return c=e.sent,e.next=11,s.resolve({type:"update",payload:Object(n.a)({},r,{loading:!1,watch:!c})});case 11:case"end":return e.stop()}},e,this)}),update:u.a.mark(function e(t,a){var s,c,o,p,i,l,d;return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return s=t.payload,c=a.put,o=a.select,e.next=4,o(function(e){return e.watching});case 4:if(p=e.sent,i=p.list){e.next=8;break}return e.abrupt("return");case 8:if(-1!==(l=i.findIndex(function(e){return s.owner===e.owner&&s.repo===e.repo}))){e.next=11;break}return e.abrupt("return");case 11:return(d=Object(r.a)(i))[l]=Object(n.a)({},d[l],s),e.next=15,c({type:"save",payload:{list:d}});case 15:case"end":return e.stop()}},e,this)}),updateIssue:u.a.mark(function e(t,a){var s,c,o,i,l,d,f,b;return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return s=t.payload,c=a.put,o=a.call,i=a.select,e.next=4,o(p.a.updateIssue,s);case 4:return e.next=6,i(function(e){return e.all});case 6:if(l=e.sent,d=l.list,-1===(f=d.findIndex(function(e){return e.owner===s.owner&&e.repo===s.repo&&e.number===s.number}))){e.next=14;break}return(b=Object(r.a)(d))[f]=Object(n.a)({},b[f],s),e.next=14,c({type:"save",payload:{list:b}});case 14:case"end":return e.stop()}},e,this)})},reducers:{save:function(e,t){return Object(n.a)({},e,t.payload)}}}}}]);
//# sourceMappingURL=6.160d607b.chunk.js.map