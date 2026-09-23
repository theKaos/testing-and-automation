import { formatCurrency } from "@/lib/cart";
import { getProduct } from "@/lib/products";
import { notFound } from 'next/navigation'

export default async function Product({ params }: { params: Promise<{ id: string }> }) {
    const { id: productId } = await params;
    const id = parseInt(productId, 10);
    const product = await getProduct(id);

    if(!product){
        notFound();
    }

    return(
        <div>
            <h1>{product.name}</h1>
            <div>{formatCurrency(product.price)}</div>
        </div>
    )
}