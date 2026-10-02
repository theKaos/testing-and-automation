//import Image from "next/image";

import CartItemList from "@/components/CartItemList";
import { CheckoutForm } from "@/components/CheckoutForm";
import { getCart } from "@/lib/cart/cartProvider";

export default async function Checkout() {

    const cart = await getCart();

    return (
        <div>
            <CartItemList key={JSON.stringify(cart)} cart={cart} showQuantitySelector={false} />
            <CheckoutForm />
        </div>
    );
}

