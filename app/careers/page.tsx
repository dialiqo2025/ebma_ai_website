import type { Metadata } from "next";
import { CareersPage } from "@/components/marketing/careers-page";

export const metadata: Metadata = {
  title: "Careers — ebma AI",
  description: "Learn about careers at ebma AI and check for current opportunities to help build useful voice and language intelligence.",
};

export default function CareersRoute() {
  return <CareersPage />;
}
