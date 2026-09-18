import { formatCurrency } from "@/lib/cart";

export type ProductCardProps = {
    name: string;
    price: number;
    onAddToCart: () => void;
}

export function ProductCard(product: ProductCardProps){
    return(
        <div>
            <h4>{product.name}</h4>
            <span>{formatCurrency(product.price)}</span>
            <button onClick={product.onAddToCart}>In den Warenkorb</button>
        </div>
    );
}