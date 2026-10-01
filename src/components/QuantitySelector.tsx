"use client"

import { CartItem } from "@/lib/cart";
import { startTransition, useOptimistic } from "react";

export function QuantitySelector({ cartItem, onChange }: { cartItem: CartItem; onChange: (id: string, next: number) => void }){
    const [optimisticCount, setOptimisticCount] = useOptimistic(cartItem.count);
    // only accept integer values from count
    if (!Number.isInteger(cartItem.count)) {
        throw new Error("count must be an integer value!");
    }

    // if count is less or equal than 1, disable decrease Button
    // not allowed to decrease count under 1
    const isDisabled = cartItem.count <= 1;

    const decreaseQuantity = () =>{
        const nextCount = cartItem.count - 1;

        startTransition(async () => {
            setOptimisticCount(nextCount);
            await onChange(cartItem.id, nextCount);
        });
    }

    const increaseQuantity = () =>{
        const nextCount = cartItem.count + 1;

        startTransition(async () => {
            setOptimisticCount(nextCount);
            await onChange(cartItem.id, nextCount);
        });
    }
    
    return(
        <div>
            <button onClick={() => decreaseQuantity()} disabled={isDisabled}>-</button> 
            <span role="status">{optimisticCount}</span>
            <button onClick={() => increaseQuantity()}>+</button>
        </div>
    )
}