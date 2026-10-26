import { API_BASE_URL } from "@/lib/playground-api";

export type PublicPricing = {
  creditToInr: number;
  signupFreeCredits: number;
  customPricingEmail: string;
  plan: { code: string; name: string } | null;
  rates: {
    ttsCreditsPer1000Chars: number;
    sttCreditsPerMinute: number;
    llmCreditsPer1000Tokens: number;
    tts?: { credits: number; chars: number };
    stt?: { credits: number; minutes: number };
    llm?: { credits: number; tokens: number };
  };
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function fetchPublicPricing(signal?: AbortSignal): Promise<PublicPricing> {
  const response = await fetch(`${API_BASE_URL}/billing/public/pricing`, {
    method: "GET",
    cache: "no-store",
    credentials: "omit",
    signal,
  });

  const payload = (await response.json()) as ApiEnvelope<PublicPricing>;
  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || "Current pricing is unavailable");
  }
  return payload.data;
}
