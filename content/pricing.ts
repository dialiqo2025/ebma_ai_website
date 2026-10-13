export type UsageService = "stt" | "tts" | "llm";

export type UsageClassification = {
  service: UsageService;
  label: string;
  shortLabel: string;
  description: string;
  rateUnit: string;
  measuredBy: string;
};

export type BillingStep = {
  number: string;
  title: string;
  detail: string;
};

export type PricingFaq = {
  question: string;
  answer: string;
};

export const usageClassifications: UsageClassification[] = [
  {
    service: "stt",
    label: "Speech to Text",
    shortLabel: "STT",
    description: "Live conversations and uploaded audio are transcribed into text.",
    rateUnit: "per audio minute",
    measuredBy: "Audio duration",
  },
  {
    service: "tts",
    label: "Text to Speech",
    shortLabel: "TTS",
    description: "Written content is converted into natural-sounding speech.",
    rateUnit: "per 1,000 characters",
    measuredBy: "Characters generated",
  },
  {
    service: "llm",
    label: "LLM Assistant",
    shortLabel: "LLM",
    description: "Assistant prompts and responses are processed by the language model.",
    rateUnit: "per 1,000 tokens",
    measuredBy: "Tokens processed",
  },
];

export const billingSteps: BillingStep[] = [
  {
    number: "01",
    title: "Create your free account",
    detail: "Get starter credits and explore STT, TTS, and LLM Assistant without a card.",
  },
  {
    number: "02",
    title: "Add credits when needed",
    detail: "Refill your wallet from the portal. One credit is equal to ₹1.",
  },
  {
    number: "03",
    title: "Use any AI service",
    detail: "Use one wallet across speech recognition, voice generation, and assistance.",
  },
  {
    number: "04",
    title: "Pay only for usage",
    detail: "Credits are deducted using the service-specific measurement shown above.",
  },
];

export const pricingFaqs: PricingFaq[] = [
  {
    question: "Is there a monthly subscription?",
    answer:
      "No. The standard offering is pay as you go. Start with free credits, then refill your wallet whenever you need more capacity.",
  },
  {
    question: "What is a credit worth?",
    answer:
      "One credit equals ₹1. Your wallet balance is shared across Speech to Text, Text to Speech, and LLM Assistant usage.",
  },
  {
    question: "How is my usage calculated?",
    answer:
      "STT is measured by audio duration, TTS by generated characters, and LLM Assistant by processed tokens. Your portal shows usage records and remaining credits.",
  },
  {
    question: "What happens when my wallet runs low?",
    answer:
      "You can add more credits from the portal and continue using the same APIs and playgrounds.",
  },
  {
    question: "When should I request custom pricing?",
    answer:
      "Contact us when you need volume rates, dedicated support, or SLA options. Share your expected usage and requirements through the contact form so we can propose the right setup.",
  },
];

export const pricingHighlights = [
  "No monthly subscription",
  "1 credit = ₹1",
  "One wallet for STT, TTS, and LLM",
];
