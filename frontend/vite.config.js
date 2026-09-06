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
    // Vite 8 / rolldown handles vendor splitting well by default; a manual
    // chunking function here bought nothing measurable for a site this size.
  },
});
