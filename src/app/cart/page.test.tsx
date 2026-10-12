import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { calculateSubtotal, CartItem } from "@/lib/cart/cart";
import { getCart } from "@/lib/cart/cartProvider";
import CartItemList from "@/components/CartItemList";

const mockCartState = vi.hoisted(() => ({
    items: [] as Array<{ id: string; price: number; count: number }>,
}));

vi.mock("@/lib/cart/cartProvider", () => ({
    getCart: vi.fn(async () => mockCartState.items),
}));

vi.mock("@/lib/actions", () => ({
    updateCartQuantityAction: vi.fn((id: string, quantity: number) =>
        new Promise<Array<{ id: string; price: number; count: number }>>((resolve) => {
            setTimeout(() => {
                mockCartState.items = mockCartState.items.map((item) =>
                    item.id === id ? { ...item, count: quantity } : item,
                );
                resolve(mockCartState.items);
            }, 1500);
        }),
    ),
}));

test("useOptimistic and handleQuantityChange correctly display subtotal at their time", async () => {
    vi.useFakeTimers();

    const cart: CartItem[] = [{ id: "1", price: 12.99, count: 1 }, { id: "2", price: 9.99, count: 2 }];

    try {
        mockCartState.items = cart.map((item) => ({ ...item }));
        render(
            <CartItemList cart={cart} />
        );

        fireEvent.click(screen.getAllByRole("button", { name: "Produktanzahl erhöhen" })[0]);
        
        // subtotal of 45.96 expected from useOptimistic
        expect(screen.getByText(/Zwischensumme:/)).toHaveTextContent("Zwischensumme: 45,96€");

        // subtotal of 32.97 expected before timeout is finished
        await act(async () => {
            await vi.advanceTimersByTimeAsync(1499);
        });
        await expect(
            getCart("cart-page-test-session").then((cart) => calculateSubtotal(cart))
        ).resolves.toBe(32.97);

        // quantity of 2 expected after updateCartQuantity is completed
        await act(async () => {
            await vi.advanceTimersByTimeAsync(1);
        });
        await expect(
            getCart("cart-page-test-session").then((cart) => calculateSubtotal(cart))
        ).resolves.toBe(45.96);
        expect(screen.getByText(/Zwischensumme:/)).toHaveTextContent("Zwischensumme: 45,96€");
    } finally {
        vi.useRealTimers();
    }
});