import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: 'llm-tree-to-fs',

  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
});
