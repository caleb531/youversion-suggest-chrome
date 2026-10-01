import { defineConfig } from 'vite';
import webExtension from 'vite-plugin-web-extension';

// Build the popup and options pages declared in the extension manifest
export default defineConfig({
  plugins: [webExtension({ disableAutoLaunch: true })],
  // Compile JSX with Mithril's element and fragment factories
  oxc: {
    // We need to use _m as the imported name so that it doesn't collide with
    // explicitly importing _m, while still allowing us to have organizeImports
    // strip out "unused" mithril imports
    jsxInject: "import _m from 'mithril'",
    jsx: { runtime: 'classic', pragma: '_m', pragmaFrag: '_m.Fragment' }
  },
  build: {
    // Clear old chunks before the plugin builds the extension's pages
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000
  }
});
