import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    // Vite 8 / rolldown handles vendor splitting well by default; a manual
    // chunking function here bought nothing measurable for a site this size.
  },
});
