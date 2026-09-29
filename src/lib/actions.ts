"use server"

export async function submitFormAction(previousState: unknown, formData: FormData){
    try{
        // name and payment not used yet
        //const nameValue = formData.get("name");
        //const paymentValue = formData.get("payment");
        const addressValue = formData.get("address");
        const addressPattern = /^\p{L}+(?:[ -]\p{L}+)* \d+[a-zA-Z]?$/u;
        
        // check address field if street and house number are included correctly
        if (typeof addressValue !== "string" || !addressPattern.test(addressValue)) {
            return { addressError: "Die Adresse muss aus Straßennamen und Hausnummer bestehen."};
        }

        return { success: "Bestellung erhalten!"};
    }catch(error){
        // Server Error
        console.log(`Server Error: ${error}`);
        return { submitError: "Checkout fehlgeschlagen: Bei der Verarbeitung ist ein Fehler aufgetreten." }
    }
}