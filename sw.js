if(!self.define){let e,i={};const s=(s,n)=>(s=new URL(s+".js",n).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,r)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(i[c])return;let o={};const t=e=>s(e,c),l={module:{uri:c},exports:o,require:t};i[c]=Promise.all(n.map((e=>l[e]||t(e)))).then((e=>(r(...e),o)))}}define(["./workbox-e20531c6"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-BlCw_mWt.css",revision:null},{url:"assets/index-BZ5hVjcG.js",revision:null},{url:"index.html",revision:"4d3d5b42ffebe0e5ea7057aa8ecc4039"},{url:"registerSW.js",revision:"a2c29b0be31603e859544fa82859b700"},{url:"service-worker.js",revision:"7e8abb344ba9430533c9736c01f3b00c"},{url:"manifest.webmanifest",revision:"7a6c1a673489fbb714fede7de1b0486f"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute((({url:e})=>e.pathname.startsWith("/bookings")),new e.NetworkFirst({cacheName:"firebase-api-cache",plugins:[new e.ExpirationPlugin({maxEntries:20,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>"res.cloudinary.com"===e.hostname),new e.CacheFirst({cacheName:"cloudinary-image-cache",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:604800})]}),"GET")}));