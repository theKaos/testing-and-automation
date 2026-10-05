import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
    const response = await request.post("http://localhost:3000/api/test/reset-cart");
    expect(response.ok()).toBeTruthy();
});

test('put product to the cart', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', { name: 'In den Warenkorb' }).nth(1).click();
    await expect(page.getByText('Produkt zum Warenkorb hinzugefügt')).toBeVisible();
    await page.goto('http://localhost:3000/cart');
    await expect(page.getByText('Zwischensumme: 4,99€')).toBeVisible();
});