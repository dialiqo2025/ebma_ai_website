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
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20_000);
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/contact/inquiries`, {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Email delivery took too long. Please email our team directly.");
    }
    throw new Error("We could not reach the contact service. Please email our team directly.");
  } finally {
    window.clearTimeout(timeout);
  }

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<{
    reference: string | null;
  }> | null;
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || "We could not send your inquiry. Please email our team directly.");
  }
  return payload.data;
}
