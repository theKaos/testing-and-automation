import { beforeEach, expect, test, vi } from "vitest";
import { addToCart, emptyCart, getCart, updateCartQuantity } from "@/lib/cart/cartProvider";
import { getProductPrice } from "@/lib/products";

vi.mock("@/lib/products", () => ({
    getProductPrice: vi.fn(),
}));

beforeEach(async () => {
    await emptyCart();
    vi.mocked(getProductPrice).mockImplementation(async (id) => id === 1 ? 12.99 : 9.99);
    await addToCart(1);
    await addToCart(2);
});

test("returns the current cart", async () => {
    await expect(getCart()).resolves.toEqual(
        expect.arrayContaining([
            expect.objectContaining({ id: "1", price: 12.99, count: 1 }),
            expect.objectContaining({ id: "2", price: 9.99, count: 1 }),
        ]),
    );
});

test("updates a cart item's quantity after the delay", async () => {
    vi.useFakeTimers();

    try {
        const updatePromise = updateCartQuantity("1", 5);

        await vi.advanceTimersByTimeAsync(1500);

        await expect(updatePromise).resolves.toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: "1", count: 5 }),
            ]),
        );
    } finally {
        vi.useRealTimers();
    }
});

test("rejects an invalid product id", async () => {
    await expect(addToCart("not-a-number")).rejects.toThrow("invalid product id: not-a-number");
});

test("increases the quantity when the product is already in the cart", async () => {
    vi.useFakeTimers();

    try {
        const addPromise = addToCart("1");
        await vi.advanceTimersByTimeAsync(1500);
        await addPromise;

        await expect(getCart()).resolves.toEqual(
            expect.arrayContaining([expect.objectContaining({ id: "1", count: 2 })]),
        );
    } finally {
        vi.useRealTimers();
    }
});

test("adds a product that is not already in the cart", async () => {
    vi.mocked(getProductPrice).mockResolvedValue(8.5);

    await addToCart(3);

    await expect(getCart()).resolves.toEqual(
        expect.arrayContaining([expect.objectContaining({ id: "3", price: 8.5, count: 1 })]),
    );
});

test("rejects a product when its price lookup returns undefined", async () => {
    vi.mocked(getProductPrice).mockResolvedValue(undefined);

    await expect(addToCart(4)).rejects.toThrow("product with id 4 was not found");
});

test("empties the cart", async () => {
    await emptyCart();

    await expect(getCart()).resolves.toEqual([]);
});