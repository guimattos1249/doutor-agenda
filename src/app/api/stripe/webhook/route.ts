import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Chave secreta do Stripe não encontradas");
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Webhook signature not found", { status: 400 });
  }

  const text = await request.text();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
  });

  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  switch (event.type) {
    case "invoice.paid": {
      if (!event.data.object.id) {
        throw new Error("Invoice ID not found");
      }
      console.log(event.data.object.parent);
      console.log(event.data.object.customer);
      const { subscription_details } = event.data.object.parent as unknown as {
        subscription_details: {
          subscription: string;
          metadata: {
            userId: string;
          };
        };
      };

      const customer = event.data.object.customer as string;

      if (!subscription_details.subscription) {
        throw new Error("Subscription not found");
      }

      const userId = subscription_details.metadata.userId;

      if (!userId) {
        throw new Error("User ID not found");
      }

      await db
        .update(usersTable)
        .set({
          stripeSubscriptionId: subscription_details.subscription,
          stripeCustomerId: customer as string,
          plan: "essential",
        })
        .where(eq(usersTable.id, userId));
      break;
    }
    case "customer.subscription.deleted": {
      if (!event.data.object.id) {
        throw new Error("Invoice ID not found");
      }

      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id,
      );

      if (!subscription) {
        throw new Error("Subscription not found");
      }

      const userId = subscription.metadata.userId;

      if (!userId) {
        throw new Error("User ID not found");
      }

      await db
        .update(usersTable)
        .set({
          stripeSubscriptionId: null,
          stripeCustomerId: null,
          plan: null,
        })
        .where(eq(usersTable.id, userId));
      break;
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
};
