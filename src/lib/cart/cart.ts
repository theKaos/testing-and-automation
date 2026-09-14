export type CartItem = {
    price: number,
    count: number
}

export function calculateSubtotal(items: CartItem[]): number{
    return parseFloat(
        items.reduce((n, item) => n + (item.price * item.count), 0).toFixed(2)
    )
}