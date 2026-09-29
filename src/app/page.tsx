//import Image from "next/image";

import { CheckoutForm } from "@/components/CheckoutForm";
import ProductList from "@/components/ProductList";
import { getProducts } from "@/lib/products";

export default async function Home() {

  const products = await getProducts();

  return (
    <div>
      <ProductList products={products} />
      <CheckoutForm />
    </div>
  );
}

