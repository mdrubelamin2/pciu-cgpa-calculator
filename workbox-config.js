module.exports = {
  globDirectory: 'public',
  globPatterns: [
    '**/*.{html,js,css,png,svg,ico,json,txt,map,jpg,jpeg,webp,gif,woff,woff2,eot,ttf,otf}'
  ],
  swDest: 'public/sw.js',
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/, // Cache all HTTP/S requests
      handler: 'NetworkFirst',
      options: {
        cacheName: 'http-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
};
