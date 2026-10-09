import { test, expect } from '@playwright/test';

test('home page lists the store products', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await expect(page.getByRole('heading', { name: 'Tasse', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Poster', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Figur', exact: true })).toBeVisible();
});
