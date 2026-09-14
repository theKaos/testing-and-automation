import { expect, test } from "vitest";
import { calculateSubtotal } from "./cart";
import { CartItem } from "./cart";

const cartItem1:CartItem = { price: 12.99, count: 1 }
const cartItem2:CartItem = { price: 7.00, count: 2 }
const cartItem3:CartItem = { price: 0.29, count: 3 }

test('corectly returns 0 as sum of empty cart', () => {
    expect(calculateSubtotal([])).toBe(0);
});

test('rounds correctly when price × count produces floating point drift', () => {
    expect(calculateSubtotal([cartItem3])).toBe(0.87);
});

test('calculates correctly sum of multiple items with varying quantities', () => {
    expect(calculateSubtotal([cartItem1, cartItem2])).toBe(26.99);
});

test('keeps correct rounding when a drifting item is combined with clean items', () => {
    expect(calculateSubtotal([cartItem1, cartItem2, cartItem3])).toBe(27.86);
});