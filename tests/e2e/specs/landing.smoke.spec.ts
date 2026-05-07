import { test, expect } from '@playwright/test';

test.describe('Landing (smoke)', () => {
  test('shows hero heading', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /Open Integration Studio/i,
      }),
    ).toBeVisible({ timeout: 15_000 });
  });
});
