import { CartItem, updateQuantity } from "@/lib/cart/cart";
import { getProductPrice } from "@/lib/products";
import { clearCartState, getCartState, replaceCartState } from "@/lib/cart/cartStore";

export async function updateCartQuantity(sessionId: string, id: string, quantity: number): Promise<CartItem[]>{
    const cart = getCartState(sessionId);

    // return error if id not found in cart
    if(!cart.find(item => item.id === id)){
        throw new Error(`item with id ${id} was not found in cart!`);
    }

    return new Promise((resolve) => {
        // artificial delay of 1.5 seconds
        setTimeout(() => {
            const updatedCart = updateQuantity(cart, id, quantity);
            replaceCartState(sessionId, updatedCart);
            resolve(updatedCart);
        }, 1500);
    });
}

export async function getCart(sessionId: string | undefined): Promise<CartItem[]>{
    return sessionId ? getCartState(sessionId) : [];
}

export async function addToCart(sessionId: string, id: string | number): Promise<void>{
    // convert string id to number
    const numberId = Number(id);
    // error if not convertable into number
    if(!Number.isInteger(numberId)){
        throw new Error(`invalid product id: ${id}`);
    }

    const stringId = String(numberId);
    const cart = getCartState(sessionId);
    const existingItem = cart.find(item => item.id === stringId);

    if (existingItem) {
        replaceCartState(
            sessionId,
            updateQuantity(cart, stringId, existingItem.count + 1),
        );
        return;
    }

    const price = await getProductPrice(numberId);

    if (price === undefined) {
        throw new Error(`product with id ${numberId} was not found`);
    }

    replaceCartState(sessionId, [
        ...cart,
        { id: stringId, price, count: 1 },
    ]);
}

export async function emptyCart(sessionId: string | undefined): Promise<void> {
    if (sessionId) {
        clearCartState(sessionId);
    }
}