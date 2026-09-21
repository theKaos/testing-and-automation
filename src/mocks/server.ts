import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const handlers = [
    http.post("/api/checkout", () => {
        return HttpResponse.json({ success: true });
    })
];

export const server = setupServer(...handlers);