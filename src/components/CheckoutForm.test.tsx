import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { http, HttpResponse } from "msw";
import { CheckoutForm, getAddressInput } from "./CheckoutForm";
import { server } from "@/mocks/server";

test("form is not valid when fields are empty", async () => {
    const user = userEvent.setup();

    render(<CheckoutForm />);
    await user.click(screen.getByRole("button", { name: "Absenden" }));
    expect(screen.getByRole("form")).not.toBeValid();
});

test("form was successfully submitted with correct input entries", async () => {
    const user = userEvent.setup();

    render(<CheckoutForm />);

    await user.type(screen.getByRole("textbox", { name: "Name:" }), "Max Mustermann");
    await user.type(screen.getByRole("textbox", { name: "Adresse:" }), "Musterstraße 11");
    await user.click(screen.getByRole("button", { name: "Absenden" }));

    expect(screen.getByRole("form")).toBeValid();

    expect(await screen.findByText("Bestellung erhalten!")).toBeInTheDocument();

});

test("address input field accepts housnumbers with a letter correctly", async () => {
    const user = userEvent.setup();

    render(<CheckoutForm />);

    await user.type(screen.getByRole("textbox", { name: "Name:" }), "Max Mustermann");
    await user.type(screen.getByRole("textbox", { name: "Adresse:" }), "Musterstraße 11a");
    await user.selectOptions(screen.getByRole("combobox", { name: "Zahlungsart:" }), "credit");
    await user.click(screen.getByRole("button", { name: "Absenden" }));

    expect(screen.getByRole("form")).toBeValid();

    expect(await screen.findByText("Bestellung erhalten!")).toBeInTheDocument();
});

test("error is shown when address has not the correct format", async () => {
    
    render(<CheckoutForm />);

    const addressInput = screen.getByRole("textbox", { name: "Adresse:" });
    const user = userEvent.setup();

    await user.type(screen.getByRole("textbox", { name: "Name:" }), "Max Mustermann");
    await user.type(addressInput, "Musterstraße");
    await user.selectOptions(screen.getByRole("combobox", { name: "Zahlungsart:" }), "credit");

    expect(screen.getByRole("form")).toBeValid();

    await user.click(screen.getByRole("button", { name: "Absenden" }));

    expect(addressInput).toBeInvalid();
    expect(
        screen.getByText("Die Adresse muss aus Straßennamen und Hausnummer bestehen.")
    ).toBeInTheDocument();
});

test("correct Error Text is shown on HTTP 500 Response Error", async () => {
    const user = userEvent.setup();

    server.use(
        http.post("/api/checkout", () => {
            return HttpResponse.json(
                { message: "Interner Serverfehler" },
                { status: 500 }
            )
        })
    );

    render(<CheckoutForm />);

    await user.type(screen.getByRole("textbox", { name: "Name:" }), "Max Mustermann");
    await user.type(screen.getByRole("textbox", { name: "Adresse:" }), "Musterstraße 11");
    await user.click(screen.getByRole("button", { name: "Absenden" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Der Server ist momentan nicht verfügbar.");
});

test("correct Error Text is shown on HTTP 401 Response", async () => {
    const user = userEvent.setup();

    server.use(
        http.post("/api/checkout", () => {
            return HttpResponse.json(
                { message: "Interner Serverfehler" },
                { status: 401 }
            )
        })
    );

    render(<CheckoutForm />);

    await user.type(screen.getByRole("textbox", { name: "Name:" }), "Max Mustermann");
    await user.type(screen.getByRole("textbox", { name: "Adresse:" }), "Musterstraße 11");
    await user.click(screen.getByRole("button", { name: "Absenden" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Die Bestellung konnte nicht verarbeitet werden.");
});

test("correct Error Text is shown on Network Error", async () => {
    const user = userEvent.setup();

    server.use(
        http.post("/api/checkout", () => {
            return HttpResponse.error();
        })
    );

    render(<CheckoutForm />);

    await user.type(screen.getByRole("textbox", { name: "Name:" }), "Max Mustermann");
    await user.type(screen.getByRole("textbox", { name: "Adresse:" }), "Musterstraße 11");
    await user.click(screen.getByRole("button", { name: "Absenden" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Checkout fehlgeschlagen: Bitte prüfe deine Verbindung.");
});

test("correct Error Text is shown if address field is void", async () => {
    const form = document.createElement("form");

    expect(getAddressInput(form)).toBeNull();
});