export function QuantitySelector({ count, onChange }: { count: number; onChange: (next: number) => void }){
    // only accept integer values from count
    if (!Number.isInteger(count)) {
        throw new Error("count must be an integer value!");
    }

    // if count is less or equal than 1, disable decrease Button
    // not allowed to decrease count under 1
    const isDisabled = count <= 1;

    const decreaseQuantity = () =>{
        onChange(count-1);
    }

    const increaseQuantity = () =>{
        onChange(count+1);
    }
    
    return(
        <div>
            <button onClick={() => decreaseQuantity()} disabled={isDisabled}>-</button> 
            <span role="status">{count}</span>
            <button onClick={() => increaseQuantity()}>+</button>
        </div>
    )
}