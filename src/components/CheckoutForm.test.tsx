import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { CheckoutForm } from "./CheckoutForm";

test("form is not valid when fields are empty", async () => {
    const user = userEvent.setup();

    render(<CheckoutForm />);
    await user.click(screen.getByRole("button", { name: "Absenden" }));
    expect(screen.getByRole("form")).not.toBeValid();
});

test("form was successfully submitted with correct input entries", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<CheckoutForm />);

    await user.type(screen.getByRole("textbox", { name: "Name:" }), "Max Mustermann");
    await user.type(screen.getByRole("textbox", { name: "Adresse:" }), "Musterstraße 11");
    await user.selectOptions(screen.getByRole("combobox", { name: "Zahlungsart:" }), "credit");

    expect(screen.getByRole("form")).toBeValid();

    await user.click(screen.getByRole("button", { name: "Absenden" }));

    expect(
        screen.queryByText("Die Adresse muss aus Straßennamen und Hausnummer bestehen.")
    ).not.toBeInTheDocument();
    expect(window.alert).toHaveBeenCalledWith("Deine Bestellung wurde erfolgreich aufgegeben!");
});

test("address input field accepts housnumbers with a letter correctly", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<CheckoutForm />);

    await user.type(screen.getByRole("textbox", { name: "Name:" }), "Max Mustermann");
    await user.type(screen.getByRole("textbox", { name: "Adresse:" }), "Musterstraße 11a");
    await user.selectOptions(screen.getByRole("combobox", { name: "Zahlungsart:" }), "credit");

    expect(screen.getByRole("form")).toBeValid();

    await user.click(screen.getByRole("button", { name: "Absenden" }));

    expect(
        screen.queryByText("Die Adresse muss aus Straßennamen und Hausnummer bestehen.")
    ).not.toBeInTheDocument();
    expect(window.alert).toHaveBeenCalledWith("Deine Bestellung wurde erfolgreich aufgegeben!");
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