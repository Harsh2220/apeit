import getQuote from "@/utils/getQuote";
import getTokenInfo from "@/utils/getTokenInfo";
import getTransaction from "@/utils/getTransaction";
import {
    ACTIONS_CORS_HEADERS,
    ActionGetResponse,
    ActionPostRequest,
    ActionPostResponse
} from "@solana/actions";
import { PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {

    const address = req.nextUrl.pathname.split("/api/")[1]

    const data = await getTokenInfo(address);

    const payload: ActionGetResponse = {
        icon: data?.result?.image,
        description:
            `${data.result.description}`,
        title: `Buy ${data.result.name} (${data.result.symbol})`,
        label: `Buy ${data.result.symbol}`,
        links: {
            actions: [
                {
                    href: `/api/${address}?amount={amount}`,
                    label: `Buy ${data.result.symbol}`,
                    parameters: [
                        {
                            name: "amount",
                            label: "Enter amount",
                        },
                    ],
                },
            ],
        },
    };

    return Response.json(payload, {
        headers: ACTIONS_CORS_HEADERS,
    });
};

export async function POST(req: NextRequest) {
    try {
        const body: ActionPostRequest = await req.json();

        const USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        const user = new PublicKey(body.account);
        const address = req.nextUrl.pathname.split("/api/")[1]

        const url = new URL(req.url)

        const amount = url.searchParams.get("amount")

        if (amount) {
            const amountWithDecimal = parseInt(amount) * Math.pow(10, 6)

            const quote = await getQuote(USDC, address, amountWithDecimal)

            const data = await getTransaction(quote, user.toString())

            const payload: ActionPostResponse = {
                transaction: data?.swapTransaction,
                message: "Bought",
            };

            return NextResponse.json(payload);
        }
    } catch (err) {
        return new Response("Invalid account provided", {
            status: 400,
            headers: ACTIONS_CORS_HEADERS,
        });
    }
}
