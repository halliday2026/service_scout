import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/service_scout/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'assets/app-icon.png', 'assets/icon-192.png', 'assets/icon-512.png'],
      manifest: {
        name: 'Service Scout',
        short_name: 'Service Scout',
        description: 'Find nearby oil change, car wash, and tire shops',
        theme_color: '#1D6FE8',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/service_scout/',
        start_url: '/service_scout/',
        icons: [
          {
            src: 'assets/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'assets/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      },
      devOptions: {
        enabled: false
      }
    })
  ]
})
