"use client"

import { CartItem, formatCurrency } from "@/lib/cart/cart";
import { QuantitySelector } from "@/components/QuantitySelector";
import { useState } from "react";
import { updateCartQuantity } from "@/lib/cart/cartProvider";

export default function CartItemEntry(cartItem: CartItem){
    const [currentQuantity, setCurrentQuantity] = useState<number>(cartItem.count);

    async function handleQuantityChange(nextQuantity: number) {
        const updatedCart = await updateCartQuantity(cartItem.id, nextQuantity);
        const updatedItem = updatedCart.find(item => item.id === cartItem.id);
        if (updatedItem) setCurrentQuantity(updatedItem.count);
    }

    return(
        <div>
            <div>
                Produkt ID: {cartItem.id}
            </div>
            <div>
                Einzelpreis: {formatCurrency(cartItem.price)}
            </div>
            <QuantitySelector count={currentQuantity} onChange={handleQuantityChange} />
        </div>
    );
}