"use client"

import { CartItem } from "@/lib/cart";
import { startTransition, useOptimistic } from "react";

export function QuantitySelector({ cartItem, onChange, showQuantitySelector = true }: { cartItem: CartItem; onChange: (id: string, next: number) => void, showQuantitySelector?: boolean }){
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
            {showQuantitySelector &&
                <button onClick={() => decreaseQuantity()} disabled={isDisabled} aria-label="Produktanzahl verringern">-</button> 
            }
            <div>Anzahl: <span role="status">{optimisticCount}</span></div>
            {showQuantitySelector &&
                <button onClick={() => increaseQuantity()} aria-label="Produktanzahl erhöhen">+</button>
            }
        </div>
    )
}