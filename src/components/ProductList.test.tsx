import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { Product } from "@/lib/products";
import ProductList from "@/components/ProductList";

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
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const user = userEvent.setup();

    render(<ProductList products={products} />);

    await user.click(
        screen.getAllByText('In den Warenkorb')[0]
    );
    
    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy).toHaveBeenCalledWith(
        "Produkt Nr. 1 in Warenkorb gelegt"
    );
});