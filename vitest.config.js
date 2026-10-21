import { defineConfig } from 'vitest/config';

// No React plugin: every test exercises plain-JS data, utils and the Worker,
// and nothing in that import graph is JSX. The plugin lives only in
// frontend/node_modules, so importing it here failed on any fresh clone.
export default defineConfig({
  test: {
    include: ['worker/test/**/*.test.{js,jsx}', 'frontend/test/**/*.test.{js,jsx}'],
    environment: 'node',
  },
});
