import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import CartItemEntry from "./CartItemEntry";
import { CartItem } from "@/lib/cart/cart";
import { getCart } from "@/lib/cart/cartProvider";

const cartItem: CartItem = { id: "1", price: 12.99, count: 1 };

test("useOptimistic and updateCartQuantity correctly display quantity at their time", async () => {
    vi.useFakeTimers();

    try {
        render(<CartItemEntry {...cartItem} />);

        fireEvent.click(screen.getByRole("button", { name: "+" }));
        
        // quantity of 2 expected from useOptimistic
        expect(screen.getByRole("status")).toHaveTextContent("2");
        await expect(getCart()).resolves.toEqual(
            expect.arrayContaining([expect.objectContaining({ id: "1", count: 1 })]),
        );

        // quantity of 1 expected before timeout is finished
        await act(async () => {
            await vi.advanceTimersByTimeAsync(1499);
        });
        await expect(getCart()).resolves.toEqual(
            expect.arrayContaining([expect.objectContaining({ id: "1", count: 1 })]),
        );

        // quantity of 2 expected after updateCartQuantity is completed
        await act(async () => {
            await vi.advanceTimersByTimeAsync(1);
        });
        await expect(getCart()).resolves.toEqual(
            expect.arrayContaining([expect.objectContaining({ id: "1", count: 2 })]),
        );
        expect(screen.getByRole("status")).toHaveTextContent("2");
    } finally {
        vi.useRealTimers();
    }
});