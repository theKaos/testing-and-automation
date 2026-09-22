export type Product = {
    id: number,
    name: string,
    price: number
}

export async function getProducts(): Promise<Product[]>{
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
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
            ]);
        }, 3000);
    });
}