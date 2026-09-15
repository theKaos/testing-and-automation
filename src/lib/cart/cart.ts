export type CartItem = {
    id: string,
    price: number,
    count: number
}

export function calculateSubtotal(items: CartItem[]): number{
    return parseFloat(
        items.reduce((n, item) => n + (item.price * item.count), 0).toFixed(2)
    )
}

export function updateQuantity(cart: CartItem[], id: string, quantity: number): CartItem[]{
    let updatedCartItem:CartItem[];
    // Always round quantity up to the next highest number as a form of defensive programming.
    const roundedQuantity: number = Math.ceil(quantity);
    // if quantity 0 or smaller -> remove from cart Array
    if(roundedQuantity > 0){
        //update count value of entry with same id property
        updatedCartItem = cart.map(item => {
            if(item.id === id){
                return {...item, count: roundedQuantity};
            }
            return item;
        });
    }else{
        // remove entries with same id property value
        updatedCartItem = cart.filter(item => item.id !== id);
    }
    return updatedCartItem;
}

export function applyTieredDiscount(subtotal: number, quantity: number): number{
    // Always round quantity up to the next highest number as a form of defensive programming.
    const amount: number = Math.ceil(quantity);
    let result: number = subtotal;
    // calculate volume discount: 
    // quantity: 1-4 = 0%
    // quantity: 5-9 = 5%
    // quantity: 10+ = 10%
    if(amount>=5 && amount<=9){
        result = subtotal * 0.95;
    }else if(amount>=10){
        result = subtotal * 0.9;
    }
    // round the result to two decimal places using standard commercial rounding.
    return Math.round(result * 100) / 100;
}

export function formatCurrency(amount: number): string{
    // Displays amount directly adjacent to the currency symbol (common e-commerce convention), not the default Intl spacing.
    return new Intl.NumberFormat("de-DE", {style: "currency", currency: "EUR"}).format(amount).replace(/\u00A0/g, "");
}