import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    environment: 'node',
    fileParallelism: false, // Run sequentially so the singleton Prisma client doesn't conflict
  },
});
