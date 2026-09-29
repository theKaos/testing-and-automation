"use server"

import { CartItem, updateQuantity } from "@/lib/cart/cart";

// S.S.O.T Cart starting value
let cart: CartItem[] = [{ id: "1", price: 12.99, count: 1 }, { id: "2", price: 9.99, count: 2 }];

export async function updateCartQuantity(id: string, quantity: number): Promise<CartItem[]>{
    return new Promise((resolve) => {
        // artificial delay of 1.5 seconds
        setTimeout(() => {
            cart = updateQuantity(cart, id, quantity);
            resolve(cart);
        }, 1500);
    });
}

export async function getCart(): Promise<CartItem[]>{
    return new Promise((resolve) => resolve(cart));
}