export type Product = {
    id: number,
    name: string,
    price: number
}

export async function getProducts(): Promise<Product[]>{
    return [
            {
                id: 1,
                name: "Tasse",
                price: 9.99
            },
            {
                id: 2,
                name: "Poster",
                price: 4.99
            },
            {
                id: 3,
                name: "Figur",
                price: 49.99
            }
        ];
}
// Mocked Error Case if product id is 1 and attempted less than 3
let attempt = 0;

export async function getProduct(id: number): Promise<Product | undefined> {
    // Temporary Solution: load products from getProducts function till real Backend solution is build
    const products = await getProducts();
    
    // Mocked Error Case if product id is 1 and attempted less than 3
    if (id === 1 && attempt++ < 2) {
        throw new Error("Error: Product Corrupted");
    }

    return new Promise((resolve) => {
        resolve(products.find(product => {
            return product.id === id;
        }));
    });
}

export async function getProductPrice(id: number): Promise<number | undefined>{
    const product = await getProduct(id);
    return product?.price;
}