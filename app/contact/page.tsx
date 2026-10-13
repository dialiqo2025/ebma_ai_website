import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactPage } from "@/components/marketing/contact-page";

export const metadata: Metadata = {
  title: "Contact us — ebma AI",
  description:
    "Contact ebma AI about custom pricing, sales, partnerships, product support, or your voice and language AI requirements.",
};

export default function ContactRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <ContactPage />
    </Suspense>
  );
}
