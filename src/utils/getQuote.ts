export default async function getQuote(inputToken: string, outputToken: string, amount: number) {
  const quoteResponse = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputToken}&outputMint=${outputToken}&amount=${amount}&maxAccounts=64`
  )
  const data = await quoteResponse.json()
  return data
}
