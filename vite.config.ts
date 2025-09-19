import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
        workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,ts}'],
        },
      manifest: {
        short_name: "Zerrium Tools",
        name: 'Zerrium Tools',
          icons: [
            {
              src: "favicon.ico",
              sizes: "64x64 32x32 24x24 16x16",
              type: "image/x-icon"
            },
            {
              src: "logo192.png",
              type: "image/png",
              sizes: "192x192"
            },
            {
              src: "logo512.png",
              type: "image/png",
              sizes: "512x512"
            }
          ],
          start_url: ".",
          display: "standalone",
          theme_color: "#000000",
          background_color: "#ffffff",
      },
      devOptions: {
          enabled: true,
          type: 'module',
      }
    }),
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: ['0.0.0.0'],
  },
  resolve: {
    alias: {
      process: 'process/browser',
    },
  },
  optimizeDeps: {
    include: ['process'],
  },
});
