// vite.config.js
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        popup: fileURLToPath(new URL('./src/popup.html', import.meta.url)),
        options: fileURLToPath(new URL('./src/options.html', import.meta.url)),
      },
      // Generate youversion-suggest chunk separately from rest of project
      output: {
        manualChunks: {
          youversion_suggest: ['youversion-suggest']
        }
      }
    },
  },
})
