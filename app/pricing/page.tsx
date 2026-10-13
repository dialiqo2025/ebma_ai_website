import type { Metadata } from "next";
import { PricingPage } from "@/components/marketing/pricing-page";

export const metadata: Metadata = {
  title: "Pricing — ebma AI",
  description:
    "Start free with ebma AI, refill your credit wallet as needed, and pay only for STT, TTS, and LLM Assistant usage.",
};

export default function PricingRoute() {
  return <PricingPage />;
}
