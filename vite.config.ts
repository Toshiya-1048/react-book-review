import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [
    react()
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  test: {
    // ユニットテストのみを含めるパターン
    include: ['src/tests/unit/**/*.test.tsx'],
    
    // E2Eテストディレクトリを除外
    exclude: ['src/tests/e2e/**'],
    
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupTests.ts'
  },
});
