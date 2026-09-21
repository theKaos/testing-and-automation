import { formatCurrency } from "@/lib/cart";

export type ProductCardProps = {
    name: string;
    price: number;
    onAddToCart: () => void;
}

export function ProductCard(product: ProductCardProps){
    //only show products wit a price above 0;
    if(product.price > 0){
        return(
            <div>
                <h4>{product.name}</h4>
                <span>{formatCurrency(product.price)}</span>
                <button onClick={product.onAddToCart}>In den Warenkorb</button>
            </div>
        );
    }else{
        return(
            null
        )
    }
}