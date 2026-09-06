import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['worker/test/**/*.test.{js,jsx}', 'frontend/test/**/*.test.{js,jsx}'],
    environment: 'node',
  },
});
