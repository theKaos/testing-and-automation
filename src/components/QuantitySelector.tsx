"use client"

import { startTransition, useOptimistic } from "react";

export function QuantitySelector({ count, onChange }: { count: number; onChange: (next: number) => void }){
    const [optimisticCount, setOptimisticCount] = useOptimistic(count);
    // only accept integer values from count
    if (!Number.isInteger(count)) {
        throw new Error("count must be an integer value!");
    }

    // if count is less or equal than 1, disable decrease Button
    // not allowed to decrease count under 1
    const isDisabled = count <= 1;

    const decreaseQuantity = () =>{
        const nextCount = count - 1;

        startTransition(async () => {
            setOptimisticCount(nextCount);
            await onChange(nextCount);
        });
    }

    const increaseQuantity = () =>{
        const nextCount = count + 1;

        startTransition(async () => {
            setOptimisticCount(nextCount);
            await onChange(nextCount);
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