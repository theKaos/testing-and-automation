import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/lib/products";
import { addToCartAction } from "@/lib/actions";

vi.mock("@/lib/actions", () => ({
    addToCartAction: vi.fn().mockResolvedValue(undefined),
}));

const cup: Product = { id: 1, name: "Kaffeetasse", price: 12.99 };
const brokenCup: Product = { id: 2, name: "Kaffeetasse", price: 0};

// testing display of Component
test("renders product name and formatted price", () => {
    render(<ProductCard {...cup} />);

    expect(screen.getByRole("heading", { name: "Kaffeetasse" })).toBeInTheDocument();
    expect(screen.getByText("12,99€")).toBeInTheDocument();
});

// testing if to cart Button is available
test("calls onAddToCart when button is clicked", async () => {
    render(<ProductCard {...cup} />);

    expect(screen.getByRole("button", { name: "In den Warenkorb" })).toBeInTheDocument();
});

// testing not supposed price value
test("doesn't render product if price is 0", async () => {
    render(<ProductCard {...brokenCup} />);

    expect(screen.queryByText("Kaffeetasse")).not.toBeInTheDocument();
});

test("shows and clears the success message after adding a product", async () => {
    vi.useFakeTimers();

    try {
        render(<ProductCard {...cup} />);

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: "In den Warenkorb" }));
            await Promise.resolve();
        });

        expect(screen.getByText("Produkt zum Warenkorb hinzugefügt")).toBeInTheDocument();
        await act(async () => {
            await vi.advanceTimersByTimeAsync(4000);
        });
        expect(screen.queryByText("Produkt zum Warenkorb hinzugefügt")).not.toBeInTheDocument();
    } finally {
        vi.useRealTimers();
    }
});

test("shows an error message when adding a product fails", async () => {
    vi.useFakeTimers();

    try {
        vi.mocked(addToCartAction).mockRejectedValueOnce(new Error("network error"));
        render(<ProductCard {...cup} />);

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: "In den Warenkorb" }));
            await Promise.resolve();
        });

        expect(screen.getByRole("alert")).toHaveTextContent("network error");
        await act(async () => {
            await vi.advanceTimersByTimeAsync(4000);
        });
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    } finally {
        vi.useRealTimers();
    }
});