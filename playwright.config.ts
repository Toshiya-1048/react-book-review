import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests/e2e', // E2E テストディレクトリ
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
  },
  // テストファイルのパターンを指定
  testMatch: '**/*.spec.ts',
});