import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { CheckoutForm } from "./CheckoutForm";
import { submitFormAction } from "@/lib/actions";
import * as actions from "@/lib/actions";

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

    expect(await screen.findByRole("status")).toHaveTextContent("Bestellung erhalten!");
});

test("address input field accepts housnumbers with a letter correctly", async () => {
    const user = userEvent.setup();

    render(<CheckoutForm />);

    await user.type(screen.getByRole("textbox", { name: "Name:" }), "Max Mustermann");
    await user.type(screen.getByRole("textbox", { name: "Adresse:" }), "Musterstraße 11a");
    await user.selectOptions(screen.getByRole("combobox", { name: "Zahlungsart:" }), "credit");
    await user.click(screen.getByRole("button", { name: "Absenden" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Bestellung erhalten!");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

// check address field input
test("error is shown when address has not the correct format", async () => {
    render(<CheckoutForm />);

    const addressInput = screen.getByRole("textbox", { name: "Adresse:" });
    const user = userEvent.setup();

    await user.type(screen.getByRole("textbox", { name: "Name:" }), "Max Mustermann");
    await user.type(addressInput, "Musterstraße");
    await user.selectOptions(screen.getByRole("combobox", { name: "Zahlungsart:" }), "credit");

    await user.click(screen.getByRole("button", { name: "Absenden" }));

    expect(await screen.findByText("Die Adresse muss aus Straßennamen und Hausnummer bestehen.")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

// check name field input
test("error is shown when name has not the correct format", async () => {
    render(<CheckoutForm />);

    const addressInput = screen.getByRole("textbox", { name: "Adresse:" });
    const user = userEvent.setup();

    await user.type(screen.getByRole("textbox", { name: "Name:" }), " ");
    await user.type(addressInput, "Musterstraße 11");
    await user.selectOptions(screen.getByRole("combobox", { name: "Zahlungsart:" }), "credit");

    await user.click(screen.getByRole("button", { name: "Absenden" }));

    expect(await screen.findByText("Gültiger Name muss angegeben werden")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

// check payment field input
test("return error when payment has not the correct format", async () => {
    const formData = new FormData();

    formData.append("name", "Max Mustermann");
    formData.append("address", "Musterstraße 11");
    formData.append("payment", "klarna");

    await expect(
        submitFormAction(null, formData)
    ).resolves.toEqual({
        paymentError: "ungültige Bezahlmethode angegeben",
    });
});

test("general submit error is shown as an alert", async () => {
    const errorMessage = "Checkout fehlgeschlagen: Bei der Verarbeitung ist ein Fehler aufgetreten.";
    const actionSpy = vi.spyOn(actions, "submitFormAction").mockResolvedValue({
        submitError: errorMessage,
    });
    const user = userEvent.setup();

    render(<CheckoutForm />);

    await user.type(screen.getByRole("textbox", { name: "Name:" }), "Max Mustermann");
    await user.type(screen.getByRole("textbox", { name: "Adresse:" }), "Musterstraße 11");
    await user.click(screen.getByRole("button", { name: "Absenden" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(errorMessage);
    actionSpy.mockRestore();
});

test("submitFormAction returns a general server error when reading the address fails", async () => {
    const formData = new FormData();
    formData.append("address", "Musterstraße 11");

    const getSpy = vi.spyOn(formData, "get").mockImplementation(() => {
        throw new Error("Unexpected read failure");
    });

    await expect(submitFormAction(null, formData)).resolves.toEqual({
        submitError: "Checkout fehlgeschlagen: Bei der Verarbeitung ist ein Fehler aufgetreten.",
    });

    getSpy.mockRestore();
});