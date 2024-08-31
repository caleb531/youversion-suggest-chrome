// vite.config.js
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        popup: fileURLToPath(new URL('./popup.html', import.meta.url)),
        options: fileURLToPath(new URL('./options.html', import.meta.url))
      },
      // Generate youversion-suggest chunk separately from rest of project
      output: {
        manualChunks: {
          youversion_suggest: ['youversion-suggest']
        }
      }
    }
  }
});
