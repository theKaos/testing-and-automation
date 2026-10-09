import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { getProduct, getProductPrice, getProducts } from "@/lib/products";

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
});

test("returns the product catalog", async () => {
    const products = getProducts();
    await vi.advanceTimersByTimeAsync(3000);

    await expect(products).resolves.toEqual(
        expect.arrayContaining([
            expect.objectContaining({ id: 1, name: "Tasse", price: 9.99 }),
            expect.objectContaining({ id: 2, name: "Poster", price: 4.99 }),
            expect.objectContaining({ id: 3, name: "Figur", price: 49.99 }),
        ]),
    );
});

test("retries the temporarily corrupted product and then returns it", async () => {
    const firstAttempt = expect(getProduct(1)).rejects.toThrow("Error: Product Corrupted");
    await vi.advanceTimersByTimeAsync(3000);
    await firstAttempt;

    const secondAttempt = expect(getProduct(1)).rejects.toThrow("Error: Product Corrupted");
    await vi.advanceTimersByTimeAsync(3000);
    await secondAttempt;

    const thirdAttempt = getProduct(1);
    await vi.advanceTimersByTimeAsync(3000);
    await expect(thirdAttempt).resolves.toMatchObject({ id: 1, name: "Tasse", price: 9.99 });
});

test("returns undefined for an unknown product and its price", async () => {
    const product = getProduct(99);
    await vi.advanceTimersByTimeAsync(3000);
    await expect(product).resolves.toBeUndefined();

    const price = getProductPrice(99);
    await vi.advanceTimersByTimeAsync(3000);
    await expect(price).resolves.toBeUndefined();
});

test("returns the price of a known product", async () => {
    const price = getProductPrice(2);
    await vi.advanceTimersByTimeAsync(3000);
    await expect(price).resolves.toBe(4.99);
});
