export type PricingPlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  blurb: string;
  credits: string;
  highlighted?: boolean;
  ctaLabel: string;
  ctaHref: "signup" | "contact";
  features: string[];
};

export type PricingFaq = {
  question: string;
  answer: string;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "to start",
    blurb: "Explore the console and ship your first voice prototype.",
    credits: "Starter credits included",
    ctaLabel: "Start free",
    ctaHref: "signup",
    features: [
      "Speech to text playground",
      "Text to speech playground",
      "Live + file transcription demos",
      "Community support",
      "No credit card required",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹2,499",
    period: "/ month",
    blurb: "For teams building production voice and language features.",
    credits: "Higher monthly credit pool",
    highlighted: true,
    ctaLabel: "Upgrade in portal",
    ctaHref: "signup",
    features: [
      "Everything in Free",
      "Higher STT & TTS quotas",
      "Priority generation throughput",
      "Export TXT / SRT / VTT / JSON",
      "Email support",
      "Usage dashboard",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    blurb: "Security, volume, and dedicated support for large rollouts.",
    credits: "Custom credit & SLA packages",
    ctaLabel: "Talk to sales",
    ctaHref: "contact",
    features: [
      "Everything in Pro",
      "SSO & advanced access controls",
      "Volume discounts",
      "Dedicated success engineer",
      "Custom SLAs & invoicing",
      "Private deployment options",
    ],
  },
];

export const pricingFaqs: PricingFaq[] = [
  {
    question: "What are credits?",
    answer:
      "Credits power STT minutes, TTS characters, and related usage in the portal. Your Free plan starts with a starter balance; Pro and Enterprise increase capacity.",
  },
  {
    question: "Can I try before paying?",
    answer:
      "Yes. Create a free account, use the playgrounds, and upgrade when you’re ready to scale.",
  },
  {
    question: "Do prices include taxes?",
    answer:
      "Listed prices are indicative and may exclude applicable taxes. Final billing appears in the portal or enterprise agreement.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "You can move from Free to Pro in the portal. Enterprise changes are handled with our team.",
  },
];

export const pricingHighlights = [
  "Credits for STT, TTS, and studio usage",
  "Same APIs from prototype to production",
  "Upgrade anytime from the portal",
];
