import { test, expect } from '@playwright/test';

test.describe('ログイン画面のテスト', () => {
  test('入力値に不備がある場合、エラーメッセージが表示される', async ({ page }) => {
    // ログインページに移動
    await page.goto('http://localhost:5173/login');

    // メールアドレスとパスワードを入力
    await page.fill('input[type="email"]', 'invalid-email@mail.com');
    await page.fill('input[type="password"]', 'short');
    // await page.fill('input[type="email"]', 'test@example.com');
    // await page.fill('input[type="password"]', 'password123');

    // ログインボタンをクリック
    await page.click('button[type="submit"]');

    // エラーメッセージが表示されることを確認
    const errorMessage = page.locator('.text-red-500');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    await expect(errorMessage).toHaveText('メールアドレスまたはパスワードが間違っています');
  });

  test('入力値に不備がない場合、エラーメッセージが表示されない', async ({ page }) => {
    // ログインページに移動
    await page.goto('http://localhost:5173/login');

    // 正しいメールアドレスとパスワードを入力
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    // await page.fill('input[type="email"]', 'invalid-email@mail.com');
    // await page.fill('input[type="password"]', 'short');

    // ログインボタンをクリック
    await page.click('button[type="submit"]');

    // エラーメッセージが表示されないことを確認
    const errorMessage = page.locator('.text-red-500');
    await expect(errorMessage).toBeHidden({ timeout: 5000 });

    // const validMessage = page.locator('.text-green-500');
    // await expect(validMessage).toBeVisible({ timeout: 5000 });
    // await expect(validMessage).toHaveText('ログインに成功しました');
  });
});