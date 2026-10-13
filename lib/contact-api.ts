import { API_BASE_URL } from "@/lib/playground-api";

export type ContactInquiry = {
  fullName: string;
  workEmail: string;
  company: string;
  jobTitle?: string;
  phone?: string;
  inquiryType: "custom_pricing" | "sales" | "partnership" | "support" | "general";
  services: Array<"stt" | "tts" | "llm">;
  monthlyUsage: "exploring" | "small" | "growing" | "high_volume" | "not_sure";
  message: string;
  consent: true;
  website?: string;
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function submitContactInquiry(input: ContactInquiry) {
  const response = await fetch(`${API_BASE_URL}/contact/inquiries`, {
    method: "POST",
    credentials: "omit",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as ApiEnvelope<{ reference: string | null }>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "We could not send your inquiry. Please try again.");
  }
  return payload.data;
}
