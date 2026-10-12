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

test('order multiple products only with keyboard input successfully', async ({ page }) => {
    // tab till product button has focus
    const tabToProductButton = async (productName: string) => {
        const button = page.getByRole('heading', { name: productName })
            .locator('..')
            .getByRole('button', { name: 'In den Warenkorb' });

        // tab max. 10 times
        for (let tabCount = 0; tabCount < 10; tabCount++) {
            if (await button.evaluate(element => element === document.activeElement)) {
                break;
            }
            await page.keyboard.press('Tab');
        }

        await expect(button).toBeFocused();
        await page.keyboard.press('Enter');
    };

    await page.goto('http://localhost:3000/');
    await tabToProductButton('Poster');
    await expect(page.getByText('Produkt zum Warenkorb hinzugefügt')).toBeVisible();
    await page.goto('http://localhost:3000/cart');
    await expect(page.locator('#subTotal')).toContainText('Zwischensumme: 4,99€');

    // check increase Button
    const increaseButton = page.getByRole('button', { name: 'Produktanzahl erhöhen' });
    await page.keyboard.press('Tab');
    await expect(increaseButton).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toHaveText('2');
    await expect(page.locator('#subTotal')).toContainText('Zwischensumme: 9,98€');

    // check decrease Button
    const decreaseButton = page.getByRole('button', { name: 'Produktanzahl verringern' });
    await expect(decreaseButton).toBeEnabled();
    for (let tabCount = 0; tabCount < 10; tabCount++) {
        if (await decreaseButton.evaluate(element => element === document.activeElement)) {
            break;
        }
        await page.keyboard.press('Shift+Tab');
    }
    await expect(decreaseButton).toBeFocused();
    const quantityUpdate = page.waitForResponse(response =>
        response.request().method() === 'POST' &&
        'next-action' in response.request().headers()
    );
    await page.keyboard.press('Enter');
    await quantityUpdate;
    await expect(page.getByRole('status')).toHaveText('1');
    await expect(page.locator('#subTotal')).toContainText('Zwischensumme: 4,99€');

    await page.goto('http://localhost:3000/');
    await tabToProductButton('Figur');
    await expect(page.getByText('Produkt zum Warenkorb hinzugefügt')).toBeVisible();
    await page.goto('http://localhost:3000/cart');
    await expect(page.locator('#subTotal')).toContainText('Zwischensumme: 54,98€');
    await page.goto('http://localhost:3000/checkout');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('textbox', { name: 'Name:' })).toBeFocused();
    await page.keyboard.type('Hans Wurst');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('textbox', { name: 'Adresse:' })).toBeFocused();
    await page.keyboard.type('Teststraße 1');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('combobox', { name: 'Zahlungsart:' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status').filter({ hasText: 'Bestellung erhalten!' })).toBeVisible();
});