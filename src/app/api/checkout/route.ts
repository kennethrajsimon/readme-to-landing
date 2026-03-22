import { NextRequest, NextResponse } from "next/server";
import { stripe, PRICE_ID } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured. Set STRIPE_SECRET_KEY in environment variables." },
        { status: 503 }
      );
    }

    if (!PRICE_ID) {
      return NextResponse.json(
        { error: "Stripe Price ID is not configured. Set STRIPE_PRICE_ID in environment variables." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { email } = body;

    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/app?session_id={CHECKOUT_SESSION_ID}&upgraded=true`,
      cancel_url: `${baseUrl}/app?cancelled=true`,
      metadata: {
        product: "readme-to-landing-pro",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
