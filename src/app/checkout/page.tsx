//import Image from "next/image";

import CartItemList from "@/components/CartItemList";
import { CheckoutForm } from "@/components/CheckoutForm";
import { getCart } from "@/lib/cart/cartProvider";
import { getCartSessionId } from "@/lib/cart/cartSession";

export default async function Checkout() {

    const cart = await getCart(await getCartSessionId());

    return (
        <div>
            <CartItemList key={JSON.stringify(cart)} cart={cart} showQuantitySelector={false} />
            <CheckoutForm />
        </div>
    );
}

