if (!self.define) {
  let e,
    s = {};
  const a = (a, n) => (
    (a = new URL(a + ".js", n).href),
    s[a] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        const e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, t) => {
    const i =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[i]) return;
    const c = {};
    const r = (e) => a(e, i),
      o = { module: { uri: i }, exports: c, require: r };
    s[i] = Promise.all(n.map((e) => o[e] || r(e))).then((e) => (t(...e), c));
  };
}
define(["./workbox-3c9d0171"], (e) => {
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/chunks/259.75d5f768279951ee.js",
          revision: "75d5f768279951ee",
        },
        {
          url: "/_next/static/chunks/278.8deb69fc3589ac85.js",
          revision: "8deb69fc3589ac85",
        },
        {
          url: "/_next/static/chunks/380-2cc22fcc3644a5c7.js",
          revision: "2cc22fcc3644a5c7",
        },
        {
          url: "/_next/static/chunks/659-8585c208fafa6e38.js",
          revision: "8585c208fafa6e38",
        },
        {
          url: "/_next/static/chunks/70-0aac61105c0e5687.js",
          revision: "0aac61105c0e5687",
        },
        {
          url: "/_next/static/chunks/920-851189ab75b0dd39.js",
          revision: "851189ab75b0dd39",
        },
        {
          url: "/_next/static/chunks/app/_global-error/page-2eada64329d93ffe.js",
          revision: "2eada64329d93ffe",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-a009396cb676ad90.js",
          revision: "a009396cb676ad90",
        },
        {
          url: "/_next/static/chunks/app/api/games/%5Bid%5D/pricing/route-2eada64329d93ffe.js",
          revision: "2eada64329d93ffe",
        },
        {
          url: "/_next/static/chunks/app/api/games/%5Bid%5D/steam/route-2eada64329d93ffe.js",
          revision: "2eada64329d93ffe",
        },
        {
          url: "/_next/static/chunks/app/api/games/route-2eada64329d93ffe.js",
          revision: "2eada64329d93ffe",
        },
        {
          url: "/_next/static/chunks/app/game/%5Bid%5D/page-d4ee49e83585ecf4.js",
          revision: "d4ee49e83585ecf4",
        },
        {
          url: "/_next/static/chunks/app/layout-693a258b380d3253.js",
          revision: "693a258b380d3253",
        },
        {
          url: "/_next/static/chunks/app/page-b8aae37aebe95dab.js",
          revision: "b8aae37aebe95dab",
        },
        {
          url: "/_next/static/chunks/app/profile/page-9b32296096a19c00.js",
          revision: "9b32296096a19c00",
        },
        {
          url: "/_next/static/chunks/d3f424c3-c471b0505f5f48db.js",
          revision: "c471b0505f5f48db",
        },
        {
          url: "/_next/static/chunks/fbcf147a-23a277a3631dec3c.js",
          revision: "23a277a3631dec3c",
        },
        {
          url: "/_next/static/chunks/framework-3376b5049f5a82dc.js",
          revision: "3376b5049f5a82dc",
        },
        {
          url: "/_next/static/chunks/main-26607245c660058b.js",
          revision: "26607245c660058b",
        },
        {
          url: "/_next/static/chunks/main-app-5f2732f052c4e39a.js",
          revision: "5f2732f052c4e39a",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/app-error-2eada64329d93ffe.js",
          revision: "2eada64329d93ffe",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/forbidden-2eada64329d93ffe.js",
          revision: "2eada64329d93ffe",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/global-error-2fed011d47096644.js",
          revision: "2fed011d47096644",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/not-found-2eada64329d93ffe.js",
          revision: "2eada64329d93ffe",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/unauthorized-2eada64329d93ffe.js",
          revision: "2eada64329d93ffe",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-5d417ee2da1b5963.js",
          revision: "5d417ee2da1b5963",
        },
        {
          url: "/_next/static/css/86a4f6f14460f16b.css",
          revision: "86a4f6f14460f16b",
        },
        {
          url: "/_next/static/qSImDJ87OYaU5KzHNYoSE/_buildManifest.js",
          revision: "ab63cf5e62fc22335cf0cf454c22e11b",
        },
        {
          url: "/_next/static/qSImDJ87OYaU5KzHNYoSE/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        { url: "/file.svg", revision: "d09f95206c3fa0bb9bd9fefabfd0ea71" },
        { url: "/globe.svg", revision: "2aaafa6a49b6563925fe440891e32717" },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        {
          url: "/swe-worker-5c72df51bb1f6ee0.js",
          revision: "76fdd3369f623a3edcf74ce2200bfdd0",
        },
        { url: "/vercel.svg", revision: "c0af2f507b369b085b35ef4bbe3bcf1e" },
        { url: "/window.svg", revision: "a2760511c65806022ad20adf74370ff3" },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({ response: e }) =>
              e && "opaqueredirect" === e.type
                ? new Response(e.body, {
                    status: 200,
                    statusText: "OK",
                    headers: e.headers,
                  })
                : e,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e, url: { pathname: s } }) =>
        !(!e || s.startsWith("/api/auth/callback") || !s.startsWith("/api/")),
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        "1" === e.headers.get("RSC") &&
        "1" === e.headers.get("Next-Router-Prefetch") &&
        a &&
        !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        "1" === e.headers.get("RSC") && a && !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: { pathname: e }, sameOrigin: s }) => s && !e.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e }) => !e,
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    );
});
