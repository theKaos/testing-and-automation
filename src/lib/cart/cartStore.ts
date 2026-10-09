import type { CartItem } from "./cart";

type CartStore = Map<string, CartItem[]>;


const globalForCart = globalThis as typeof globalThis & {
    __storefrontCart?: CartStore;
};

const carts = globalForCart.__storefrontCart ??= new Map();

export function getCartState(sessionId: string): CartItem[] {
    return carts.get(sessionId) ?? [];
}

export function replaceCartState(sessionId: string, items: CartItem[]): void {
    carts.set(sessionId, items);
}

export function clearCartState(sessionId: string): void {
    carts.delete(sessionId);
}