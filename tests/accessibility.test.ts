import { test, expect } from './checkout.fixture';
import AxeBuilder from '@axe-core/playwright';

test('homepage has no automatically detectable a11y issues', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const results = await new AxeBuilder({ page })
                                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                                .analyze();
    expect(results.violations).toEqual([]);
});

test('cart page has no automatically detectable a11y issues', async ({ page }) => {
    await page.goto('http://localhost:3000/cart');
    const results = await new AxeBuilder({ page })
                                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                                .analyze();
    expect(results.violations).toEqual([]);
});

test('checkout page has no automatically detectable a11y issues', async ({ page }) => {
    await page.goto('http://localhost:3000/checkout');
    const results = await new AxeBuilder({ page })
                                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                                .analyze();
    expect(results.violations).toEqual([]);
});

test('checkout page error message has no automatically detectable a11y issues', async ({ page }) => {
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
    const results = await new AxeBuilder({ page })
                                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                                .analyze();
    expect(results.violations).toEqual([]);
});