import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { useState } from "react";
import CartItemEntry from "./CartItemEntry";
import { CartItem } from "@/lib/cart/cart";
import { getCart, updateCartQuantity } from "@/lib/cart/cartProvider";

const cartItem: CartItem = { id: "1", price: 12.99, count: 1 };

function TestWrapper() {
    const [currentCartItem, setCurrentCartItem] = useState(cartItem);

    return (
        <CartItemEntry
            cartItem={currentCartItem}
            onChange={async (id, nextQuantity) => {
                const updatedCart = await updateCartQuantity(id, nextQuantity);
                const updatedCartItem = updatedCart.find((item) => item.id === id);

                if (updatedCartItem) {
                    setCurrentCartItem(updatedCartItem);
                }
            }}
        />
    );
}

test("throw error if not available cart item is tried to update", async () => {
    render(<TestWrapper />);

    await expect(
        updateCartQuantity("0", 2)
    ).rejects.toThrow("item with id 0 was not found in cart!");
});

test("useOptimistic and updateCartQuantity correctly display quantity at their time", async () => {
    vi.useFakeTimers();

    try {
        render(<TestWrapper />);

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

test("if quantity of cart item is reduced to 0, deelte it from cart", async () => {
    vi.useFakeTimers();
    
    try {
        const updatePromise = updateCartQuantity("1", 0);

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1500);
        });

        await expect(updatePromise).resolves.toEqual(
            expect.not.arrayContaining([
                expect.objectContaining({ id: "1" }),
            ]),
        );
    } finally {
        vi.useRealTimers();
    }
});