
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
    const { priceId } = await req.json();

    if (!priceId) {
        return NextResponse.json({ error: { message: 'Price ID is required' } }, { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.nextUrl.origin}/?payment_success=true`,
            cancel_url: `${req.nextUrl.origin}/?payment_canceled=true`,
        });

        return NextResponse.json({ sessionId: session.id });

    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: { message: err.message } }, { status: 500 });
    }
}
