import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    const rawBody = await req.text();

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("❌ Webhook signature error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  // ✅ DEBUG (add this)
  console.log("EVENT TYPE:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("✅ PAYMENT SUCCESS:", session.metadata);

    await connectDb();

    await Order.findByIdAndUpdate(session.metadata?.orderId, {
      isPaid: true,
    });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}