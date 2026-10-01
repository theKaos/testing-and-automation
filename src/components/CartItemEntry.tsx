"use client"

import { CartItem, formatCurrency } from "@/lib/cart/cart";
import { QuantitySelector } from "@/components/QuantitySelector";

export default function CartItemEntry({ cartItem, onChange }: { cartItem: CartItem, onChange: (id: string, nextQuantity: number) => void }){

    return(
        <div>
            <div>
                Produkt ID: {cartItem.id}
            </div>
            <div>
                Einzelpreis: {formatCurrency(cartItem.price)}
            </div>
            <QuantitySelector cartItem={cartItem} onChange={onChange} />
        </div>
    );
}