import type { Metadata } from "next";
import { AboutPage } from "@/components/marketing/about-page";

export const metadata: Metadata = {
  title: "About us — ebma AI",
  description: "Meet ebma AI, the voice and language intelligence platform helping teams build products that listen, speak, understand, and respond.",
};

export default function AboutRoute() {
  return <AboutPage />;
}
