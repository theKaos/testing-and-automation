import { expect, test as base } from '@playwright/test';

type Fixtures = {
    cleanCart: void;
};

export const test = base.extend<Fixtures>({
    cleanCart: [
        async ({ page }, use) => {
        const resetCart = async () => {
            const response = await page.request.post(
            'http://localhost:3000/api/test/reset-cart',
            );
            expect(response.ok()).toBeTruthy();
        };

        // reset cart before test
        await resetCart();
        // actual test
        await use();
        // reset cart after test
        await resetCart();
        },
        { auto: true },
    ],
});

export { expect } from '@playwright/test';