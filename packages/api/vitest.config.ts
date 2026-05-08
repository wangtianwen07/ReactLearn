import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@react-learn/auth': fileURLToPath(new URL('../auth/src/index.ts', import.meta.url)),
      '@react-learn/shared': fileURLToPath(new URL('../shared/src/index.ts', import.meta.url)),
    },
  },
});
