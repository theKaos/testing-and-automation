"use client";

import { calculateSubtotal, CartItem, updateQuantity } from "@/lib/cart/cart";
import { updateCartQuantityAction } from "@/lib/actions";
import { useOptimistic, useState } from "react";
import CartItemEntry from "@/components/CartItemEntry";
import CartSubtotal from "@/components/CartSubtotal";

export default function CartItemList({ cart, showQuantitySelector = true }: { cart: CartItem[], showQuantitySelector?: boolean }){

    // State of Cart
    const [cartState, setCartState] = useState<CartItem[]>(cart);
    // Optimistic Subtotal value
    const [optimisticSubtotal, setOptimisticSubtotal] = useOptimistic<number>(calculateSubtotal(cartState));

    async function handleQuantityChange(id: string, nextQuantity: number) {
        const optimisticCart = updateQuantity(cartState, id, nextQuantity);
        setOptimisticSubtotal(calculateSubtotal(optimisticCart));

        const updatedCart = await updateCartQuantityAction(id, nextQuantity);
        setCartState(updatedCart);
    }

    return(
        <div>
            {cartState.map((cartItem) => (
                <CartItemEntry key={cartItem.id} cartItem={cartItem} onChange={handleQuantityChange} showQuantitySelector={showQuantitySelector} />
            ))}
            <CartSubtotal subTotal={optimisticSubtotal} />
        </div>
    )
}