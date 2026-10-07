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

test('order multiple products successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', { name: 'In den Warenkorb' }).nth(1).click();
    await expect(page.getByText('Produkt zum Warenkorb hinzugefügt')).toBeVisible();
    await expect(page.getByText('Produkt zum Warenkorb hinzugefügt')).not.toBeVisible();
    await page.getByRole('button', { name: 'In den Warenkorb' }).nth(2).click();
    await expect(page.getByText('Produkt zum Warenkorb hinzugefügt')).toBeVisible();
    await page.goto('http://localhost:3000/cart');
    await expect(page.locator('#subTotal')).toContainText('Zwischensumme: 54,98€');
    await page.goto('http://localhost:3000/checkout');
    await page.getByRole('textbox', { name: 'Name:' }).click();
    await page.getByRole('textbox', { name: 'Name:' }).fill('Hans Wurst');
    await page.getByRole('textbox', { name: 'Adresse:' }).click();
    await page.getByRole('textbox', { name: 'Adresse:' }).fill('Teststraße 1');
    await page.getByLabel('Zahlungsart:').selectOption('wero');
    await page.getByRole('button', { name: 'Absenden' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Bestellung erhalten!' })).toBeVisible();
});

test('order with wrong address shows error', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', { name: 'In den Warenkorb' }).nth(1).click();
    await expect(page.getByRole('status')).toContainText('Produkt zum Warenkorb hinzugefügt');
    await page.goto('http://localhost:3000/cart');
    await expect(page.locator('#subTotal')).toContainText('Zwischensumme: 4,99€');
    await page.goto('http://localhost:3000/checkout');
    await page.getByRole('textbox', { name: 'Name:' }).click();
    await page.getByRole('textbox', { name: 'Name:' }).fill('Hans Wurst');
    await page.getByRole('textbox', { name: 'Name:' }).press('Tab');
    await page.getByRole('textbox', { name: 'Adresse:' }).fill('Teststraße');
    await page.getByRole('button', { name: 'Absenden' }).click();
    await expect(page.locator('#error-address')).toContainText('Die Adresse muss aus Straßennamen und Hausnummer bestehen.');
    await expect(page.locator('#subTotal')).toContainText('Zwischensumme: 4,99€');
});

test('cart still correct after browsing another product', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', { name: 'In den Warenkorb' }).nth(1).click();
    await expect(page.getByRole('status')).toContainText('Produkt zum Warenkorb hinzugefügt');
    await page.goto('http://localhost:3000/cart');
    await expect(page.locator('#subTotal')).toContainText('Zwischensumme: 4,99€');
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Produktdetails' }).nth(2).click();
    await expect(
    page.getByRole('heading', { name: 'Figur', level: 1, exact: true })).toBeVisible();
    await expect(page.locator('body')).toContainText('49,99€');
    await page.goto('http://localhost:3000/cart');
    await expect(page.locator('#subTotal')).toContainText('Zwischensumme: 4,99€');
});