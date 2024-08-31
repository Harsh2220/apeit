export default async function getTransaction(quoteResponse: string, userPublicKey: string) {
    const response = await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quoteResponse: quoteResponse,
            userPublicKey: userPublicKey,
            wrapAndUnwrapSol: true,
        })
    })
    const data = await response.json()
    return data
}
