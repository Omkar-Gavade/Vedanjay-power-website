import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { devApi } from './dev-api.js';

export default defineConfig({
  // devApi is `apply: 'serve'` — it runs the real Worker in dev and is
  // never part of a production build.
  plugins: [react(), devApi()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        /**
         * THE DATA LAYER IS ITS OWN CHUNK, explicitly.
         *
         * data/seo.js composes every page's title and description from the
         * modules that own the figures — awards, downloads, partners, projects,
         * portfolio and the rest — and <Seo> renders on every route including
         * the home page. So the whole data layer sits in the initial import
         * graph whether it is split out or not.
         *
         * Left to itself, rolldown's shared-chunk heuristic moved that ~14 kB
         * gzipped in and out of the entry bundle depending on how many lazy
         * chunks happened to share it — a component-level edit could swing the
         * measured entry size by 14 kB with no change in what a visitor
         * downloads. Naming the chunk makes the split deterministic, so
         * scripts/check-size.mjs measures the app and not the heuristic.
         */
        manualChunks(id) {
          if (id.includes('/src/data/')) return 'data';
          return null;
        },
      },
    },
  },
});
