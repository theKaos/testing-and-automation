"use client"

import { formatCurrency } from "@/lib/cart/cart";

export default function CartSubtotal({subTotal}: {subTotal: number}){
    return(
        <div id="subTotal">
            Zwischensumme: {formatCurrency(subTotal)}
        </div>
    )
}