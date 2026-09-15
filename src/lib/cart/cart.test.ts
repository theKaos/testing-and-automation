import { expect, test } from "vitest";
import { applyTieredDiscount, calculateSubtotal, formatCurrency, updateQuantity } from "./cart";
import { CartItem } from "./cart";

const cartItem1:CartItem = { id: "1", price: 12.99, count: 1 };
const cartItem2:CartItem = { id: "2", price: 7.00, count: 2 };
const cartItem3:CartItem = { id: "3", price: 0.29, count: 3 };

const cartArray:CartItem[] = [cartItem1, cartItem2, cartItem3];

// Tests for calculateSubtotal function
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


// Tests for updateQuantity function
test('Updating a cart item to quantity of 0 removes it from the cartItem array', () => {
    expect(updateQuantity(cartArray,"1",0)).toEqual([cartItem2, cartItem3]);
});

test('Updating a cart item with a negative quantity removes it from the cartItem array', () => {
    expect(updateQuantity(cartArray,"1",-1)).toEqual([cartItem2, cartItem3]);
});

test('Updating a cart item quantity with a non integer value updates it with a rounded quantity value', () => {
    expect(updateQuantity(cartArray,"1",1.5)).toEqual([{id: "1", price: 12.99, count: 2},cartItem2, cartItem3]);
});

test('Updating a cart item does not mutate the original cart item array', () => {
    const snapshotCartArray = cartArray.map(item => ({ ...item }));
    updateQuantity(cartArray,"1",2);
    expect(cartArray).toEqual(snapshotCartArray);
});


// Test for formatCurrency function
test('rounds amount with 3 decimal numbers correctly before display as currency-string', () => {
    expect(formatCurrency(19.995)).toEqual("20,00€");
});

test('display amount with 2 decimal numbers correctly as currency-string without rounding', () => {
    expect(formatCurrency(19.99)).toEqual("19,99€");
});


// Test for applyTieredDiscount function
test('applies no discount at the lower edge of the first tier (quantity 1)', () => {
    expect(applyTieredDiscount(99.95, 1)).toBe(99.95);
});

test('applies no discount at the upper edge of the first tier (quantity 4)', () => {
    expect(applyTieredDiscount(99.95, 4)).toBe(99.95);
});

test('applies 5% discount at the lower edge of the second tier (quantity 5)', () => {
    expect(applyTieredDiscount(99.95, 5)).toBe(94.95);
});

test('applies 5% discount at the upper edge of the second tier (quantity 9)', () => {
    expect(applyTieredDiscount(99.95, 9)).toBe(94.95);
});

test('applies 10% discount at the lower edge of the third tier (quantity 10)', () => {
    expect(applyTieredDiscount(99.95, 10)).toBe(89.96);
});

test('rounds result correctly with no discount within the first tier (quantity 2)', () => {
    expect(applyTieredDiscount(19.995, 2)).toBe(20.00);
});