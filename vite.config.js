import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Clinic Dashboard',
        short_name: 'Dashboard',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        id: '/doctor-dashboard/',
        start_url: '/doctor-dashboard/',
        icons: [
          {
            src: '/doctor-dashboard/pwa-icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/doctor-dashboard/logo-pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        screenshots: [
          {
            src: '/doctor-dashboard/screenshots/mobile1.png',
            sizes: '640x1136',
            type: 'image/png',
          },
          {
            src: '/doctor-dashboard/screenshots/desktop1.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
          },
        ]
      },
      workbox: {
        runtimeCaching: [
          // Caching Firebase API requests (e.g., teamMembers.json)
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/bookings'),
            handler: 'NetworkFirst',  // Use the NetworkFirst strategy to prioritize the network
            options: {
              cacheName: 'firebase-api-cache',
              expiration: {
                maxEntries: 20,  // Cache up to 20 API responses
                maxAgeSeconds: 60 * 60 * 24, // Cache expires after 1 day
              },
            },
          },
          // Caching images
          {
            urlPattern: ({ url }) => url.hostname === 'res.cloudinary.com',  // Match Cloudinary image URLs
            handler: 'CacheFirst',
            options: {
              cacheName: 'cloudinary-image-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
            },
          },
        ],
      },
    }),
  ],
  base: "/doctor-dashboard/"
});