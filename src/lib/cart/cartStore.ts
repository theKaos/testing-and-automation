import type { CartItem } from "./cart";

type CartStore = {
    items: CartItem[];
};

const globalForCart = globalThis as typeof globalThis & {
    __storefrontCart?: CartStore;
};

const store = globalForCart.__storefrontCart ??= { items: [] };

export function getCartState(): CartItem[] {
    return store.items;
}

export function replaceCartState(items: CartItem[]): void {
    store.items = items;
}

export function clearCartState(): void {
    store.items = [];
}