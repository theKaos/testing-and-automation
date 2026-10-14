import ProductList from "@/components/ProductList";
import { getProducts } from "@/lib/products";

export const dynamic = 'force-dynamic';

export default async function Home() {

  const products = await getProducts();

  return (
    <div>
      <ProductList products={products} />
    </div>
  );
}

