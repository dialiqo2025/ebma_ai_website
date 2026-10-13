import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";
import { policyUpdated, securitySections } from "@/content/legal";

export const metadata: Metadata = {
  title: "Security — ebma AI",
  description: "Learn about ebma AI's approach to platform security, data handling, access protection, resilience, and vulnerability reporting.",
};

export default function SecurityPage() {
  return (
    <LegalPage
      eyebrow="Trust & safety"
      title="Security at ebma AI"
      description="How we think about protecting accounts, service content, APIs, and the systems behind our voice and language platform."
      updated={policyUpdated}
      sections={securitySections}
      security
    />
  );
}
