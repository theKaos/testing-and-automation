import { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export default function ProductList({products}: {products: Product[]}){
 
    return (
        <div>
            {products.map((product) => {
                return <ProductCard key={product.id} {...product} />;
            })}
        </div>
    );
}