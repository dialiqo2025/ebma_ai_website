import type { Metadata } from "next";
import { PricingPage } from "@/components/marketing/pricing-page";

export const metadata: Metadata = {
  title: "Pricing — ebma AI",
  description:
    "Simple ebma AI pricing. Start free, upgrade to Pro credits, or talk to sales for Enterprise.",
};

export default function PricingRoute() {
  return <PricingPage />;
}
