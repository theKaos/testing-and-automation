import CartItemList from "@/components/CartItemList";
import { CartItem } from "@/lib/cart/cart";
import { getCart } from "@/lib/cart/cartProvider";
import { getCartSessionId } from "@/lib/cart/cartSession";

export default async function Cart(){
    const cart: CartItem[] = await getCart(await getCartSessionId());

    return(
        <div>
            <CartItemList cart={cart} />
        </div>
    );
}