import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.next/',
        'vitest.config.ts',
        'tailwind.config.ts',
        'postcss.config.mjs',
        'next.config.ts',
        'lib/infrastructure/testing/**', // Exclude testing framework itself from coverage
        '**/types.ts',
      ],
      reportsDirectory: './lib/infrastructure/testing/coverage-reports',
    },
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['node_modules', '.next'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
