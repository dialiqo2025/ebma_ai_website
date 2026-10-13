import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";
import { policyUpdated, privacySections } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — ebma AI",
  description: "Learn how ebma AI collects, uses, shares, and protects personal information across its website, platform, and AI services.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="A clear overview of the information we handle, why we need it, and the choices available to you when using ebma AI."
      updated={policyUpdated}
      sections={privacySections}
    />
  );
}
