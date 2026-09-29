import CartItemEntry from "@/components/CartItemEntry";
import { CartItem } from "@/lib/cart/cart";
import { getCart } from "@/lib/cart/cartProvider";

export default async function Cart(){
    const cart: CartItem[] = await getCart();

    return(
        <div>
            {cart.map((cartItem) => (
                <CartItemEntry key={cartItem.id} {...cartItem} />
            ))}
        </div>
    );
}