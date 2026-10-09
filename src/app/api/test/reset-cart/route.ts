import { NextResponse } from "next/server";
import { emptyCart } from "@/lib/cart/cartProvider";
import { getCartSessionId } from "@/lib/cart/cartSession";

// api route to reset cart in playwright tests
export async function POST() {
    if (process.env.NODE_ENV === "production" && process.env.PLAYWRIGHT_TEST !== "true") {
        return new NextResponse(null, { status: 404 });
    }

    await emptyCart(await getCartSessionId());
    return NextResponse.json({ ok: true });
}