import Stripe from "stripe";
import { env } from "../config/env";

let client: Stripe | null = null;

export const getStripe = () => {
  if (env.PAYMENTS_MODE !== "stripe")
    throw new Error("Stripe is disabled (PAYMENTS_MODE=mock)");
  client ??= new Stripe(env.STRIPE_SECRET_KEY);
  return client;
};
