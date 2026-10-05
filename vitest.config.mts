import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // Playwright's own *.spec.ts files live under tests/ and must not be
    // picked up by Vitest's default include pattern (which also matches *.spec.ts).
    exclude: ['node_modules/**', 'tests/**'],
  },
});