import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "storefront_cart_session";

export async function getCartSessionId(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value;
}

export async function getOrCreateCartSessionId(): Promise<string> {
    const cookieStore = await cookies();
    const existingId = cookieStore.get(COOKIE_NAME)?.value;

    if (existingId) {
        return existingId;
    }

    const sessionId = randomUUID();

    cookieStore.set(COOKIE_NAME, sessionId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production" && process.env.PLAYWRIGHT_TEST !== "true",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    });

    return sessionId;
}