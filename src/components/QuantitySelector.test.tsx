import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { QuantitySelector } from "./QuantitySelector";
import { CartItem } from "@/lib/cart/cart";
import { useState } from "react";

function TestWrapper(){
    const [currentQuantity, setCurrentQuantity] = useState<number>(2);
    const currentCartItem: CartItem = { id: "test", price: 0, count: currentQuantity };
    const changeQuantity = (_itemId: string, newQuantity: number) => {
        setCurrentQuantity(newQuantity);
    }

    return <QuantitySelector cartItem={currentCartItem} onChange={changeQuantity} />;
}

function TestWrapperInitDisabled(){
    const [currentQuantity, setCurrentQuantity] = useState<number>(1);
    const currentCartItem: CartItem = { id: "test", price: 0, count: currentQuantity };
    const changeQuantity = (_itemId: string, newQuantity: number) => {
        setCurrentQuantity(newQuantity);
    }

    return <QuantitySelector cartItem={currentCartItem} onChange={changeQuantity} />;
}

function TestWrapperInitWrongQuantity(){
    const [currentQuantity, setCurrentQuantity] = useState<number>(1.5);
    const currentCartItem: CartItem = { id: "test", price: 0, count: currentQuantity };
    const changeQuantity = (_itemId: string, newQuantity: number) => {
        setCurrentQuantity(newQuantity);
    }

    return <QuantitySelector cartItem={currentCartItem} onChange={changeQuantity} />;
}

test("increase quantity through plus button", async () => {
    render(<TestWrapper />)
    
    await userEvent.click(screen.getByRole("button", {name: "+"}));
    expect(screen.getByRole("status")).toHaveTextContent("3"); 
    
});

test("decrease quantity through minus button", async () => {
    render(<TestWrapper />)
    
    await userEvent.click(screen.getByRole("button", {name: "-"}));
    expect(screen.getByRole("status")).toHaveTextContent("1"); 
});

test("disable minus button if quantity gets to 1 or lower", async () => {
    render(<TestWrapper />)
    
    await userEvent.click(screen.getByRole("button", {name: "-"}));
    await userEvent.click(screen.getByRole("button", {name: "-"}));
    expect(screen.getByRole("button", {name: "-"})).toHaveAttribute("disabled");
});

test("minus button disable if init quantity is 1 or lower", async () => {
    render(<TestWrapperInitDisabled />)
    
    expect(screen.getByRole("button", {name: "-"})).toHaveAttribute("disabled");
});

test("throw error if not allowed count value is used", async () => {
    expect(() => {
        render(<TestWrapperInitWrongQuantity />);
    }).toThrow();
});

test("hides quantity controls when showQuantitySelector is false", () => {
    const cartItem: CartItem = { id: "test", price: 0, count: 2 };

    render(
        <QuantitySelector
            cartItem={cartItem}
            onChange={() => {}}
            showQuantitySelector={false}
        />,
    );

    expect(screen.queryByRole("button", { name: "+" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "-" })).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("2");
});