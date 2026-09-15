import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'node:url'

// Set BASE_PATH when deploying to a subpath (e.g. a GitHub Pages project site:
// BASE_PATH=/beginner-fitness/ npm run build). Defaults to root for local dev
// and for hosts that serve from the domain root (Vercel, Netlify, etc.).
const base = process.env.BASE_PATH ?? '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: "Maggie's Fitness",
        short_name: 'Fitness',
        description: 'A simple, beautiful workout companion.',
        theme_color: '#0B0F19',
        background_color: '#0B0F19',
        display: 'standalone',
        orientation: 'portrait',
        // Relative to the manifest's own location, so this resolves correctly
        // whether the app is served from the domain root or a subpath.
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,jpg}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: `${base}index.html`,
        // Without these, a newly-deployed service worker installs but sits "waiting" until
        // every open tab for the origin is fully closed before it takes over — on iOS Safari
        // tabs almost never count as fully closed, so updates could appear to never arrive.
        // This makes a new SW activate and take control immediately instead.
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
  },
})
