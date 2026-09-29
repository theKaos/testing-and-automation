import { expect, test, vi } from "vitest";
import { getCart, updateCartQuantity } from "@/lib/cart/cartProvider";

test("returns the current cart", async () => {
    await expect(getCart()).resolves.toEqual(
        expect.arrayContaining([expect.objectContaining({ id: "1" })]),
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