"use client"

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }){
    return (
        <div>
            <h3>Etwas ist schiefgelaufen</h3>
            <div>{error.message}</div>
            <button onClick={() => retry()}>
                Erneut versuchen
            </button>
        </div>
    );
}