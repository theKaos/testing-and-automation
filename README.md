Tiny E-Commerce-Storefront in Next.js/Typescript, created as a learning project focused on automated testing, CI, and Next.js in detail.

## Setup

install:

```
npm install
```

## Development

run the development server:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Testing

The tests are performed using React Testing Library and MSW.

run once:

```
npm run test
```

run in watch mode:

```
npm run test:watch
```

run Coverage Report:

```
npm run test:coverage
```

## Architecture

The Components in this Project are getting devided between server side and client side Components by the following rules in general:

**Server Side**:

A Component shall be Server Side if data needs to be loaded, database or API calls made, or little to none JavaScript shall be sent to the browser.

e.g.: `page.tsx`, `loading.tsx`, `ProductList.tsx`

**Client Side**:

Anything that needs to respond to user actions or manage browser state like localStorage, shall be a Cleint Side Component.

e.g: `ProductCard.tsx`, `error.tsx`, `QuantitySelector.tsx`

Server side components can include client side components beacause Next.js hands over the client component as an interactive Section to the browser.

The reverse is not possible because client side components are executet in the browser, wich has no direkt access to Databaes, Files or secret Server logic.

#### Special Page Files

**loading.tsx**

the content of these files are getting displayed for their respective page.tsx pages (on the same folder level),

if the content of the page.tsx needs a longer time to generate. This is to prevent an empty screen for the user.

If a page.tsx file does not have a loading.tsx file on the same level, the loading.tsx file of the above folder

(till the loading.tsx file of the highest app folder if no found) is used for their content display.

**error.tsx**

The same principle as the loading page, expect it shows an Error Content with a Retry functionality if an error happend

while generating the content of their respective page.tsx pages

## State Management

This project only uses Reacts own state management tools. This project doesn't use external state Managements like e.g. Zustand to maintain the internal server persistance and prevent an additional State instance witch deviates from the internal ones. Otherwiese this would lead to e.g. changes in the cart not beeing consistently be saved on the only designated place the `cartProvider.ts`. 

The introduction of Zustand had inadvertently broken server-side persistence entirely. An independent HTTP request demonstrated that the Zustand store instance running in the browser was completely different from the one Next.js used for server-side rendering; they existed in separate JavaScript environments and shared no memory.

### local States

#### CheckoutForms.tsx

Contains the Values of the checout input fields in a values useSate ->

```typescript
const [values, setValues] = useState({name: "", address: "", payment: "paypal"});
```

### State lifting chain

CartItemList.tsx -> CartItemEntry.tsx -> QuantitySlector.tsx

#### CartItemList.tsx   
Contains the state of the global Cart Object holded by the cartProvider.ts, as well as a obtimistic state of the carts price subtotal value ->

```typescript
// State of Cart 
const [cartState, setCartState] = useState<CartItem[]>(cart);

// Optimistic Subtotal value 
const [optimisticSubtotal, setOptimisticSubtotal] = useOptimistic<number>(calculateSubtotal(cartState));
```

the subtotal is stored as a useOptimistic value to display a changed subtotal value immediatly, even when the calculation by a quantity change of a cartItem is still in progress. This is to avoid a temporary wrong display of the subtotal value by a delayed quantity changed of a cart Item. 

Optimistic values are used as a kind of bridge between the values that are visible immediately in the browser and the values that are actualy confirmed on the server. Between the e.g. artifical delay of the quantity cahnge the values are seen differently on purpose until they converge.

#### CartItemEntry.tsx

Doesn't hold any own states. Only gets the cart items from the cart state and a onChange function to update the cart and optimistic subtotal states as props from the parent `CartItemList.tsx`

#### QuantitySlector.tsx

Like it's parent `CartItemEntry.tsx` gets the cart items from the cart state and a onChange function to update the cart and optimistic subtotal states as props from the parent `CartItemEntry.tsx`.

In addition holds an own optimistic state value of the cart item count. it's used for the same base purpose as `optimisticSubtotal` variable in `CartItemList.tsx`, to display a changed quantity value immediatly, even when the calculation by a quantity change of a cartItem is still in progress.

### Server-side States

`src\lib\cart\cartProvider.ts`

This File contains the cart informations as the single source of truth as a server state object for the entire project and is the only place to persist the cart information:

```typescript
// S.S.O.T Cart starting value
let cart: CartItem[] = [{ id: "1", price: 12.99, count: 1 }, { id: "2", price: 9.99, count: 2 }];
```

its available in the project by the getter function getCart():

```typescript
export async function getCart(): Promise<CartItem[]>{
    return new Promise((resolve) => resolve(cart));
}
```