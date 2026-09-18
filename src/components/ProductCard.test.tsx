import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { ProductCard, ProductCardProps } from "./ProductCard";

const tasse: ProductCardProps = { name: "Kaffeetasse", price: 12.99, onAddToCart:()=>{} };

// testing display of Component
test("renders product name and formatted price", () => {
    render(<ProductCard {...tasse} />);

    expect(screen.getByRole("heading", { name: "Kaffeetasse" })).toBeInTheDocument();
    expect(screen.getByText("12,99€")).toBeInTheDocument();
});

// testing click function of component
test("calls onAddToCart when button is clicked", async () => {
    const handleAddToCart = vi.fn();
    const user = userEvent.setup();

    render(<ProductCard {...tasse} onAddToCart={handleAddToCart} />);

    await user.click(screen.getByRole("button", { name: "In den Warenkorb" }));

    expect(handleAddToCart).toHaveBeenCalledOnce();
})