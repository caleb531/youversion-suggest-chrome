// vite.config.js
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

export default defineConfig({
  // Enable JSX processing
  esbuild: {
    // We need to use _m as the imported name so that it doesn't collide with
    // explicitly importing _m, while still allowing us to have organizeImports
    // strip out "unused" mithril imports
    jsxInject: "import _m from 'mithril'",
    jsxFactory: '_m',
    jsxFragment: '_m.Fragment'
  },
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
