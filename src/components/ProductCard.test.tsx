import { render, screen } from "@testing-library/react";
import { expect, test} from "vitest";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/lib/products";

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