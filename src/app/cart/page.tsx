import CartItemList from "@/components/CartItemList";
import { CartItem } from "@/lib/cart/cart";
import { getCart } from "@/lib/cart/cartProvider";

export default async function Cart(){
    const cart: CartItem[] = await getCart();

    return(
        <div>
            <CartItemList cart={cart} />
        </div>
    );
}