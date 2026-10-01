"use client"

import { useActionState, useState } from "react";
import { submitFormAction } from "@/lib/actions";


export function CheckoutForm(){
    const [state, formAction, isPending] = useActionState(submitFormAction, null);
    const [values, setValues] = useState({name: "", address: "", payment: "paypal"});

    return(
        <form name="checkoutForm" action={formAction}>
            
            <div>
                <label htmlFor="name">Name:</label>
                <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    value={values.name}
                    aria-invalid={Boolean(state?.nameError)}
                    aria-errormessage={state?.nameError ? "error-name" : undefined} 
                    required
                    onChange={(e) => setValues({ ...values, name: e.target.value })} 
                />
                {state?.nameError && (
                    <span id="error-name" className="errormessage">{state?.nameError}</span>
                )}
            </div>

            <div>
                <label htmlFor="address">Adresse:</label>
                <input 
                    type="text" 
                    name="address" 
                    id="address" 
                    required
                    value={values.address} 
                    aria-invalid={Boolean(state?.addressError)}
                    aria-errormessage={state?.addressError ? "error-address" : undefined}
                    onChange={(e) => setValues({ ...values, address: e.target.value })}  
                />
                {state?.addressError && (
                    <span id="error-address" className="errormessage">{state?.addressError}</span>
                )}
            </div>

            <div>
                <label htmlFor="payment">Zahlungsart:</label>
                {/* Known issue: after a failed submission, the native form reset briefly displays the select element incorrectly, though the internal state remains correct. */}
                <select 
                    name="payment" 
                    id="payment" 
                    value={values.payment}
                    aria-invalid={Boolean(state?.paymentError)}
                    aria-errormessage={state?.paymentError ? "error-payment" : undefined} 
                    required
                    onChange={(e) => setValues({ ...values, payment: e.target.value })} 
                >
                    <option value="paypal">Paypal</option>
                    <option value="credit">Kreditkarte</option>
                    <option value="wero">Wero</option>
                </select>
                {state?.paymentError && (
                    <span id="error-payment" className="errormessage">{state?.paymentError}</span>
                )}
            </div>

            <div>
                <button type="submit" disabled={isPending}>
                    {isPending ? "Wird verarbeitet..." : "Absenden"}
                </button>
            </div>

            {state?.success && 
                <div role="status">{state?.success}</div>
            }

            {state?.submitError &&
                <div role="alert">{state?.submitError}</div>
            }

        </form>
    )
}