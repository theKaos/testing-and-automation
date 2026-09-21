import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { ProductCard, ProductCardProps } from "./ProductCard";

const cup: ProductCardProps = { name: "Kaffeetasse", price: 12.99, onAddToCart:()=>{} };
const brokenCup: ProductCardProps = { name: "Kaffeetasse", price: 0, onAddToCart:()=>{} };

// testing display of Component
test("renders product name and formatted price", () => {
    render(<ProductCard {...cup} />);

    expect(screen.getByRole("heading", { name: "Kaffeetasse" })).toBeInTheDocument();
    expect(screen.getByText("12,99€")).toBeInTheDocument();
});

// testing click function of component
test("calls onAddToCart when button is clicked", async () => {
    const handleAddToCart = vi.fn();
    const user = userEvent.setup();

    render(<ProductCard {...cup} onAddToCart={handleAddToCart} />);

    await user.click(screen.getByRole("button", { name: "In den Warenkorb" }));

    expect(handleAddToCart).toHaveBeenCalledOnce();
});

// testing not supposed price value
test("doesn't render product if price is 0", async () => {
    const handleAddToCart = vi.fn();

    render(<ProductCard {...brokenCup} onAddToCart={handleAddToCart} />);

    expect(screen.queryByText("Kaffeetasse")).not.toBeInTheDocument();
});