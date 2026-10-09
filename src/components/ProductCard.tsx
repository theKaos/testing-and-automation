"use client";
import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/cart";
import { addToCartAction } from "@/lib/actions";
import { Product } from "@/lib/products";

export function ProductCard(product: Product){

    const [successState, setSuccessState] = useState<string>("");
    const [failState, setFailState] = useState<string>("");
    
    async function onAddToCart(product: Product) {
        try {
            await addToCartAction(product.id);
            // show success message for 4 seconds
            setSuccessState("Produkt zum Warenkorb hinzugefügt");
            setTimeout(() => setSuccessState(""), 4000);
        } catch (error) {
            // show error message for 4 seconds
            setFailState(`Produkt konnte nicht zum Warenkorb hinzugefügt werden: ${error}`);
            setTimeout(() => setFailState(""), 4000);
        }
    }

    //only show products wit a price above 0;
    if(product.price > 0){
        return(
            <div>
                <h4>{product.name}</h4>
                <span>{formatCurrency(product.price)}</span>
                <button onClick={()=>onAddToCart(product)}>In den Warenkorb</button>
                <Link href={`/products/${product.id}`}>Produktdetails</Link>
                {successState && 
                    <div role="status">
                        {successState}
                    </div>
                }
                {failState && 
                    <div role="alert">
                        {failState}
                    </div>
                }
            </div>
        );
    }else{
        return(
            null
        )
    }
}