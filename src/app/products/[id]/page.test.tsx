import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { getProduct } from "@/lib/products";
import { notFound } from "next/navigation";
import Product from "./page";

// mock products getProduct function
vi.mock("@/lib/products", () => ({
    getProduct: vi.fn(),
}));

// mock next notFound function
vi.mock("next/navigation", () => ({
    notFound: vi.fn(() => {
        throw new Error("NEXT_NOT_FOUND");
    }),
}));

test("calls next notFound function if product wasn'found / is undefined", async () => {
    // mocks product wasn't found
	vi.mocked(getProduct).mockResolvedValue(undefined);

	await expect(
		Product({ params: Promise.resolve({ id: "999" }) }),
	).rejects.toThrow("NEXT_NOT_FOUND");

	expect(notFound).toHaveBeenCalledOnce();
});

test("correctly shows product information when product was found", async () => {
    // mocks product to be found
	vi.mocked(getProduct).mockResolvedValue({ id: 1, name: "Tasse", price: 9.99 });

	render(await Product({ params: Promise.resolve({ id: "1" }) }));

	expect(screen.getByRole("heading", { name: "Tasse" })).toBeInTheDocument();
});