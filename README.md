Tiny E-Commerce-Storefront in Next.js/Typescript, created as a learning project focused on automated testing, CI, and Next.js in detail.

## Setup

install:

```bash
npm install
```

## Development

run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Testing

The tests are performed using React Testing Library and MSW.

run once:

```bash
npm run test
```

run in watch mode:

```bash
npm run test:watch
```

run Coverage Report:

```bash
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
