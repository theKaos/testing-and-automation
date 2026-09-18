import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { QuantitySelector } from "./QuantitySelector";
import { useState } from "react";

function TestWrapper(){
    const [currentQuantity, setCurrentQuantity] = useState<number>(2);
    const changeQuantitiy = (newQuantity: number) => {
        setCurrentQuantity(newQuantity);
    }

    return <QuantitySelector count={currentQuantity} onChange={changeQuantitiy} />;
}

function TestWrapperInitDisabled(){
    const [currentQuantity, setCurrentQuantity] = useState<number>(1);
    const changeQuantitiy = (newQuantity: number) => {
        setCurrentQuantity(newQuantity);
    }

    return <QuantitySelector count={currentQuantity} onChange={changeQuantitiy} />;
}

function TestWrapperInitWrongQuantity(){
    const [currentQuantity, setCurrentQuantity] = useState<number>(1.5);
    const changeQuantitiy = (newQuantity: number) => {
        setCurrentQuantity(newQuantity);
    }

    return <QuantitySelector count={currentQuantity} onChange={changeQuantitiy} />;
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