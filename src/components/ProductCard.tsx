"use client";
import { formatCurrency } from "@/lib/cart";
import { Product } from "@/lib/products";

export function ProductCard(product: Product){
    
    function onAddToCart(product: Product) {
        // placeholder function till connection is enabled
        console.log(`Produkt Nr. ${product.id} in Warenkorb gelegt`);
    }

    //only show products wit a price above 0;
    if(product.price > 0){
        return(
            <div>
                <h4>{product.name}</h4>
                <span>{formatCurrency(product.price)}</span>
                <button onClick={()=>onAddToCart(product)}>In den Warenkorb</button>
            </div>
        );
    }else{
        return(
            null
        )
    }
}