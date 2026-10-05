import { NextResponse } from "next/server";
import { emptyCart } from "@/lib/cart/cartProvider";

// api route to reset cart in playwright tests
export async function POST() {
    if (process.env.NODE_ENV === "production") {
        return new NextResponse(null, { status: 404 });
    }

    await emptyCart();
    return NextResponse.json({ ok: true });
}