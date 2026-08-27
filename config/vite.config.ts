import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    // This config lives below the project root, so source paths resolve one directory upward.
    alias: { '@': fileURLToPath(new URL('../src', import.meta.url)) },
  },
  server: {
    host: true, // binds to 0.0.0.0
    port: 5173,
    strictPort: true,

    proxy: {
      '/api': {
        target: 'http://dev01:8000',
        changeOrigin: true,
      },
      '/media': {
        target: 'http://dev01:8000',
        changeOrigin: true,
      },
    },

    // You can keep allowedHosts as-is
    allowedHosts: ['localhost', '127.0.0.1', 'dev01', 'dev01.wheelerhome.dev'],

    hmr: {
      host: 'dev01', // must match what the browser uses in the URL bar
      protocol: 'ws',
      port: 5173,
    },
  },
})
