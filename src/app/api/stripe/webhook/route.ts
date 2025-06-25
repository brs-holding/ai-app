// src/app/api/stripe/webhook/route.ts
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ Stripe webhook error:", err);
    return new Response("Webhook Error", { status: 400 });
  }

  let userId = "";
  let priceId = "";

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    userId = session.metadata?.userId;
    priceId = session.items?.data?.[0]?.price?.id;
  } else if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as any;
    userId = subscription.metadata?.userId;
    priceId = subscription.items?.data?.[0]?.price?.id;
  } else if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as any;
    userId = subscription.metadata?.userId;

    if (userId) {
      await db
        .update(usersTable)
        .set({
          plan: "free",
          creditsRemaining: 5,
          lastCreditReset: new Date(),
        })
        .where(eq(usersTable.id, userId));

      console.log(` Downgraded user ${userId} to free`);
    }

    return new Response("Success", { status: 200 });
  }

  if (!userId || !priceId) {
    console.warn(" Missing userId or priceId");
    return new Response("Missing metadata", { status: 400 });
  }

  let plan: "free" | "pro" | "team" = "free";
  if (priceId === process.env.STRIPE_PRICE_ID_PRO) plan = "pro";
  if (priceId === process.env.STRIPE_PRICE_ID_TEAM) plan = "team";

  const credits = plan === "free" ? 5 : 100;

  await db
    .update(usersTable)
    .set({
      plan,
      creditsRemaining: credits,
      lastCreditReset: new Date(),
    })
    .where(eq(usersTable.id, userId));

  console.log(` Synced plan '${plan}' for user ${userId}`);

  return new Response("Success", { status: 200 });
}
