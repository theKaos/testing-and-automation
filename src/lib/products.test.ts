import { expect, test, vi } from "vitest";
import { getProduct, getProductPrice, getProducts } from "@/lib/products";

test("returns the product catalog after the loading delay", async () => {
    vi.useFakeTimers();

    try {
        const productsPromise = getProducts();
        await vi.advanceTimersByTimeAsync(3000);

        await expect(productsPromise).resolves.toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 1, name: "Tasse", price: 9.99 }),
                expect.objectContaining({ id: 2, name: "Poster", price: 4.99 }),
                expect.objectContaining({ id: 3, name: "Figur", price: 49.99 }),
            ]),
        );
    } finally {
        vi.useRealTimers();
    }
});

test("retries the temporarily corrupted product and then returns it", async () => {
    vi.useFakeTimers();

    try {
        const firstAttempt = expect(getProduct(1)).rejects.toThrow("Error: Product Corrupted");
        await vi.advanceTimersByTimeAsync(3000);
        await firstAttempt;

        const secondAttempt = expect(getProduct(1)).rejects.toThrow("Error: Product Corrupted");
        await vi.advanceTimersByTimeAsync(3000);
        await secondAttempt;

        const thirdAttempt = getProduct(1);
        await vi.advanceTimersByTimeAsync(3000);
        await expect(thirdAttempt).resolves.toMatchObject({ id: 1, name: "Tasse", price: 9.99 });
    } finally {
        vi.useRealTimers();
    }
});

test("returns undefined for an unknown product and its price", async () => {
    vi.useFakeTimers();

    try {
        const productPromise = getProduct(99);
        await vi.advanceTimersByTimeAsync(3000);
        await expect(productPromise).resolves.toBeUndefined();

        const pricePromise = getProductPrice(99);
        await vi.advanceTimersByTimeAsync(3000);
        await expect(pricePromise).resolves.toBeUndefined();
    } finally {
        vi.useRealTimers();
    }
});

test("returns the price of a known product", async () => {
    vi.useFakeTimers();

    try {
        const pricePromise = getProductPrice(2);
        await vi.advanceTimersByTimeAsync(3000);
        await expect(pricePromise).resolves.toBe(4.99);
    } finally {
        vi.useRealTimers();
    }
});
