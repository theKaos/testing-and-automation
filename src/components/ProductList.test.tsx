import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { Product } from "@/lib/products";
import ProductList from "@/components/ProductList";
import { addToCart } from "@/lib/cart/cartProvider";

vi.mock("@/lib/cart/cartProvider", () => ({
    addToCart: vi.fn().mockResolvedValue(undefined),
}));

const products: Product[] = [{
                    id: 1,
                    name: "Tasse",
                    price: 9.99
                },
                {
                    id: 2,
                    name: "Poster",
                    price: 4.99
                },
                {
                    id: 3,
                    name: "Figur",
                    price: 49.99
                }];

test("calls onAddToCart with the clicked product", async () => {
    const user = userEvent.setup();

    render(<ProductList products={products} />);

    await user.click(screen.getAllByRole("button", { name: "In den Warenkorb" })[0]);
    
    expect(addToCart).toHaveBeenCalledOnce();
    expect(addToCart).toHaveBeenCalledWith(1);
});