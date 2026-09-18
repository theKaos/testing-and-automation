import { useState } from "react";

export function CheckoutForm(){

    // handle for address field Errors
    const [addressError, setAddressError] = useState("");

    function submitForm(e: React.SubmitEvent) {
        e.preventDefault();

        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        
        const addressValue = formData.get("address");
        // name and payment not used yet
        //const nameValue = formData.get("name");
        //const paymentValue = formData.get("payment");

        const addressPattern = /^\p{L}+(?:[ -]\p{L}+)* \d+[a-zA-Z]?$/u;
        const addressInput = form.elements.namedItem("address");

        // address field must be included
        if (!(addressInput instanceof HTMLInputElement)) {
            throw new Error("address field is missing!");
        }

        // check address field if street and house number are included correctly
        if (typeof addressValue !== "string" || !addressPattern.test(addressValue)) {
            setAddressError("Die Adresse muss aus Straßennamen und Hausnummer bestehen.");
            form.reportValidity();
            addressInput.focus();
            return;
        }

        setAddressError("");
        // return a success alert for now
        alert("Deine Bestellung wurde erfolgreich aufgegeben!")
    }

    return(
        <form name="checkoutForm" onSubmit={submitForm}>

            <div>
                <label htmlFor="name">Name:</label>
                <input type="text" name="name" id="name" required />
            </div>

            <div>
                <label htmlFor="address">Adresse:</label>
                <input type="text" name="address" id="address" 
                    required 
                    aria-invalid={Boolean(addressError)}
                    aria-errormessage={addressError ? "error-address" : undefined} />
                {addressError && (
                    <span id="error-address" className="errormessage">{addressError}</span>
                )}
            </div>

            <div>
                <label htmlFor="payment">Zahlungsart:</label>
                <select name="payment" id="payment" defaultValue="paypal" required>
                    <option value="paypal">Paypal</option>
                    <option value="credit">Kreditkarte</option>
                    <option value="wero">Wero</option>
                </select>
            </div>

            <div>
                <button type="submit">Absenden</button>
            </div>

        </form>
    )
}