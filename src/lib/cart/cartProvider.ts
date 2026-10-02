"use server"

import { CartItem, updateQuantity } from "@/lib/cart/cart";
import { getProductPrice } from "@/lib/products";

// S.S.O.T Cart starting value
let cart: CartItem[] = [];

export async function updateCartQuantity(id: string, quantity: number): Promise<CartItem[]>{
    // return error if id not found in cart
    if(!cart.find(item => item.id === id)){
        throw new Error(`item with id ${id} was not found in cart!`);
    }

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

export async function addToCart(id: string | number){
    // convert string id to number
    const numberId = Number(id);
    // error if not convertable into number
    if(!Number.isInteger(numberId)){
        throw new Error(`invalid product id: ${id}`);
    }

    const stringId = String(numberId);
    const product = cart.find(item => item.id === stringId);

    if(product){
        // product with id is already in cart -> increase its quantity
        await updateCartQuantity(stringId, product.count+1);
    }else{
        // add prooduct to cart with quantity 1
        const price = await getProductPrice(numberId);
        if(price === undefined){
            throw new Error(`product with id ${numberId} was not found`);
        }
        cart.push({id: stringId, price, count: 1});
    }
}

export async function emptyCart(){
    cart = [];
}