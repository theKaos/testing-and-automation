import { afterEach, expect, test } from "vitest";
import {
    clearCartState,
    getCartState,
    replaceCartState,
} from "./cartStore";

const sessionA = "test-session-a";
const sessionB = "test-session-b";

afterEach(() => {
    clearCartState(sessionA);
    clearCartState(sessionB);
});

test("divides carts by session ids", () => {
    replaceCartState(sessionA, [
        { id: "1", price: 12.99, count: 1 },
    ]);

    expect(getCartState(sessionA)).toHaveLength(1);
    expect(getCartState(sessionB)).toEqual([]);
});