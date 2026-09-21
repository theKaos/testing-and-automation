import { useState } from "react";

// helper function to check correct address input field
export function getAddressInput(addressField: Element | RadioNodeList | null) {
    const addressInput = addressField;

    if (!(addressInput instanceof HTMLInputElement)) {
        return null;
    }

    return addressInput;
}

export function CheckoutForm(){

    // handle for address field Errors
    const [addressError, setAddressError] = useState("");
    const [successfullyCalled, setSuccessfullyCalled] = useState(false);
    const [submitErrorMessage, setSubmitErrorMessage] = useState("");

    async function submitForm(e: React.SubmitEvent) {
        e.preventDefault();

        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        const addressValue = formData.get("address");
        // name and payment not used yet
        //const nameValue = formData.get("name");
        //const paymentValue = formData.get("payment");

        const addressPattern = /^\p{L}+(?:[ -]\p{L}+)* \d+[a-zA-Z]?$/u;
        const addressInput = getAddressInput(form.elements.namedItem("address"));

        if (addressInput === null) {
            setSubmitErrorMessage("Die Adresse ist ungültig!");
            return;
        }        

        // check address field if street and house number are included correctly
        if (typeof addressValue !== "string" || !addressPattern.test(addressValue)) {
            setAddressError("Die Adresse muss aus Straßennamen und Hausnummer bestehen.");
            form.reportValidity();
            addressInput.focus();
            return;
        }

        setAddressError("");

        try{
            const response = await fetch("/api/checkout", {
                method: "POST",
                body: JSON.stringify(Object.fromEntries(formData)),
            });
            
            // Server Error
            if(!response.ok){
                if(response.status >= 500){
                    setSubmitErrorMessage("Der Server ist momentan nicht verfügbar.");
                }else{
                    setSubmitErrorMessage("Die Bestellung konnte nicht verarbeitet werden.");
                }
                return;
            }

            const result = await response.json();
            setSuccessfullyCalled(true);
            return result;
        }catch{
            // Network Error
            setSubmitErrorMessage("Checkout fehlgeschlagen: Bitte prüfe deine Verbindung.");
        }

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

            {successfullyCalled && 
                <div role="status">Bestellung erhalten!</div>
            }

            {submitErrorMessage &&
                <div role="alert">{submitErrorMessage}</div>
            }

        </form>
    )
}