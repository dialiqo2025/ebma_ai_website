import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";
import { policyUpdated, termsSections } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions — ebma AI",
  description: "Terms governing access to and use of the ebma AI website, APIs, AI services, wallet credits, and generated outputs.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      description="The rules that help keep ebma AI reliable, responsible, and fair for everyone who builds with the platform."
      updated={policyUpdated}
      sections={termsSections}
    />
  );
}
