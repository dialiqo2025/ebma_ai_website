"use client";

import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  CircleDollarSign,
  Coins,
  Mail,
  Mic2,
  Minus,
  Plus,
  Sparkles,
  Volume2,
  WalletCards,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import {
  billingSteps,
  pricingFaqs,
  pricingHighlights,
  usageClassifications,
  type UsageService,
} from "@/content/pricing";
import { container, cx } from "@/lib/cn";
import { fetchPublicPricing, type PublicPricing } from "@/lib/pricing-api";
import { portalPath, portalSignupUrl } from "@/lib/site";

const serviceStyles: Record<
  UsageService,
  { icon: typeof Mic2; color: string; surface: string; border: string }
> = {
  stt: {
    icon: Mic2,
    color: "text-[#6542e8]",
    surface: "bg-[rgba(101,66,232,.1)]",
    border: "border-[#cfc5f8]",
  },
  tts: {
    icon: Volume2,
    color: "text-[#0f7b85]",
    surface: "bg-[#e8f8f8]",
    border: "border-[#bde4e5]",
  },
  llm: {
    icon: Bot,
    color: "text-[#a33e78]",
    surface: "bg-[#fcecf5]",
    border: "border-[#f0c8df]",
  },
};

function formatCredits(value: number) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

function serviceRate(pricing: PublicPricing, service: UsageService) {
  if (service === "stt") return pricing.rates.sttCreditsPerMinute;
  if (service === "tts") return pricing.rates.ttsCreditsPer1000Chars;
  return pricing.rates.llmCreditsPer1000Tokens;
}

export function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [pricing, setPricing] = useState<PublicPricing | null>(null);
  const [pricingError, setPricingError] = useState(false);
  const contactHref = "/contact?topic=custom_pricing";
  const walletHref = portalPath("/platform/plans?kind=wallet_topup");

  useEffect(() => {
    const controller = new AbortController();
    void fetchPublicPricing(controller.signal)
      .then((currentPricing) => {
        setPricing(currentPricing);
        setPricingError(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setPricingError(true);
      });
    return () => controller.abort();
  }, []);

  const signupCredits = pricing ? formatCredits(pricing.signupFreeCredits) : null;

  return (
    <main className="overflow-hidden bg-bg">
      <SiteHeader />

      <section className="relative pt-20 max-[820px]:pt-[68px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(101,66,232,.15),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(15,123,133,.08),transparent_25%)]" />
        <div
          className={cx(
            container,
            "relative grid grid-cols-[1.08fr_.92fr] items-center gap-16 py-[76px] max-[920px]:grid-cols-1 max-[920px]:gap-10 max-[820px]:py-[58px]",
          )}
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(155,92,246,.3)] bg-[rgba(101,66,232,.1)] px-3 py-2 text-[12px] font-[750] uppercase tracking-[0.1em] text-[#6542e8]">
              <Sparkles size={14} aria-hidden="true" /> Simple usage-based pricing
            </div>
            <h1 className="mt-6 max-w-[720px] font-heading text-[clamp(42px,5.7vw,70px)] font-[650] leading-[1.02] tracking-[-0.055em] text-[#121528]">
              Start free. Pay only for
              <span className="bg-[linear-gradient(100deg,#6542e8,#a75fda_75%)] bg-clip-text text-transparent">
                {" "}what you use.
              </span>
            </h1>
            <p className="mt-6 max-w-[620px] text-[17px] leading-[1.75] text-[#5c6478] max-[560px]:text-[15px]">
              No confusing plan tiers or monthly commitment. Get starter credits,
              refill your wallet when needed, and use one balance across STT, TTS,
              and LLM Assistant.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 max-[560px]:flex-col">
              <Button large href={portalSignupUrl} className="max-[560px]:w-full">
                Start with {signupCredits ? `${signupCredits} free credits` : "free credits"}{" "}
                <ArrowRight size={17} />
              </Button>
              <Button
                variant="outline"
                large
                href={contactHref}
                className="max-[560px]:w-full"
              >
                Request custom pricing <Mail size={17} />
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-[#6b7389]">
              {pricingHighlights.map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-success" /> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[470px]">
            <div className="absolute -inset-10 rounded-full bg-[rgba(101,66,232,.12)] blur-3xl" />
            <div className="relative overflow-hidden rounded-[24px] border border-[#d8d2ee] bg-white p-6 shadow-[0_30px_80px_rgba(53,41,112,.17)] max-[560px]:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[rgba(101,66,232,.1)] text-[#6542e8]">
                    <WalletCards size={21} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a92a8]">
                      Your credit wallet
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-[#121528]">
                      One balance, every service
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-[#e9f8f0] px-2.5 py-1 text-[10px] font-bold text-[#147449]">
                  Pay as you go
                </span>
              </div>

              <div className="mt-6 rounded-[18px] bg-[linear-gradient(135deg,#4d32c8,#6542e8_65%,#8c74ef)] p-5 text-white">
                <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#ddd7ff]">
                  Simple conversion
                </p>
                <div className="mt-2 flex items-baseline justify-between gap-4">
                  <p className="font-heading text-[32px] font-semibold tracking-[-0.04em]">
                    1 credit
                  </p>
                  <p className="text-xl font-bold">= ₹1</p>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-[68%] rounded-full bg-white" />
                </div>
                <p className="mt-2 text-[10px] text-[#ddd7ff]">
                  Track your live balance and usage history in the portal.
                </p>
              </div>

              <div className="mt-5 grid gap-3">
                <div className="flex items-center gap-3 rounded-xl border border-[#e5e2ef] bg-[#faf9ff] px-4 py-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#e9f8f0] text-[#147449]">
                    <Plus size={16} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold text-[#121528]">Refill wallet</p>
                    <p className="mt-0.5 text-[10px] text-[#7a8299]">
                      Add credits whenever your balance runs low
                    </p>
                  </div>
                  <Coins size={18} className="shrink-0 text-[#8c7ff7]" aria-hidden="true" />
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-[#e5e2ef] bg-[#faf9ff] px-4 py-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#fcecf5] text-[#a33e78]">
                    <Minus size={16} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold text-[#121528]">Usage deducted</p>
                    <p className="mt-0.5 text-[10px] text-[#7a8299]">
                      Charged by audio, characters, or tokens
                    </p>
                  </div>
                  <CircleDollarSign size={18} className="shrink-0 text-[#8c7ff7]" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#d5dbea] bg-bg-deep py-[88px] max-[820px]:py-[68px]">
        <div className={container}>
          <div className="max-w-[690px]">
            <span className="text-[12px] font-extrabold uppercase tracking-[0.13em] text-[#6542e8]">
              Usage classification
            </span>
            <h2 className="mt-3 font-heading text-[clamp(30px,4vw,46px)] font-semibold tracking-[-0.04em] text-[#121528]">
              Know exactly what gets measured
            </h2>
            <p className="mt-4 text-[14px] leading-[1.75] text-[#5c6478]">
              Each service uses a unit that matches the work it performs. All charges
              come from the same wallet, so there is no separate balance to manage.
            </p>
          </div>

          <div
            aria-live="polite"
            className={cx(
              "mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-semibold",
              pricing
                ? "border-[#b9ddca] bg-[#e9f8f0] text-[#147449]"
                : pricingError
                  ? "border-[#ead8aa] bg-[#fff8e6] text-[#8a6512]"
                  : "border-[#d8d2ee] bg-white text-[#6b7389]",
            )}
          >
            <span
              className={cx(
                "size-1.5 rounded-full",
                pricing ? "bg-[#147449]" : pricingError ? "bg-[#b88a22]" : "animate-pulse bg-[#8c7ff7]",
              )}
            />
            {pricing
              ? "Live rates synced with the current Pay-as-you-go configuration"
              : pricingError
                ? "Live rates are unavailable right now — confirm current rates in the portal"
                : "Loading current rates from ebma AI…"}
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-[900px]:grid-cols-1">
            {usageClassifications.map((item, index) => {
              const style = serviceStyles[item.service];
              const Icon = style.icon;
              const rate = pricing ? serviceRate(pricing, item.service) : null;
              return (
                <article
                  key={item.service}
                  className={cx(
                    "relative overflow-hidden rounded-[20px] border bg-white p-6 shadow-[0_10px_30px_rgba(18,21,40,.07)]",
                    style.border,
                  )}
                >
                  <span className="absolute right-5 top-3 font-heading text-[58px] font-bold leading-none text-[#f1eefb]">
                    0{index + 1}
                  </span>
                  <span
                    className={cx(
                      "relative grid size-11 place-items-center rounded-xl",
                      style.surface,
                      style.color,
                    )}
                  >
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <p
                    className={cx(
                      "relative mt-5 text-[11px] font-extrabold uppercase tracking-[0.13em]",
                      style.color,
                    )}
                  >
                    {item.shortLabel}
                  </p>
                  <h3 className="relative mt-1 text-xl font-bold text-[#121528]">
                    {item.label}
                  </h3>
                  <p className="relative mt-3 min-h-[66px] text-[13px] leading-[1.7] text-[#5c6478] max-[900px]:min-h-0">
                    {item.description}
                  </p>
                  <div className="relative mt-5 rounded-[14px] border border-[#e3e6ef] bg-[#f8fafc] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#8a92a8]">
                      Standard usage rate
                    </p>
                    <p className="mt-2 font-heading text-[24px] font-semibold tracking-[-0.03em] text-[#121528]">
                      {rate !== null
                        ? `${formatCredits(rate)} ${rate === 1 ? "credit" : "credits"}`
                        : pricingError
                          ? "View in portal"
                          : "Loading…"}
                    </p>
                    <p className="mt-0.5 text-[12px] font-semibold text-[#6542e8]">
                      {item.rateUnit}
                    </p>
                  </div>
                  <div className="relative mt-4 flex items-center justify-between gap-3 border-t border-[#e7eaf2] pt-4 text-[11px]">
                    <span className="text-[#8a92a8]">Measured by</span>
                    <span className="font-bold text-[#121528]">{item.measuredBy}</span>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-[#7a8299]">
            Rates are loaded from the same default Pay-as-you-go configuration used by
            the user portal. Admin updates appear here automatically. Custom agreements
            may use different rates; your portal remains the source of truth for your account.
          </p>
        </div>
      </section>

      <section className="bg-bg py-[92px] max-[820px]:py-[70px]">
        <div className={container}>
          <div className="mx-auto max-w-[660px] text-center">
            <span className="text-[12px] font-extrabold uppercase tracking-[0.13em] text-[#6542e8]">
              How billing works
            </span>
            <h2 className="mt-3 font-heading text-[clamp(30px,4vw,44px)] font-semibold tracking-[-0.04em] text-[#121528]">
              From free account to production usage
            </h2>
          </div>

          <div className="relative mt-12">
            <div
              aria-hidden="true"
              className="absolute left-[12%] right-[12%] top-7 h-px bg-[#d3cbee] max-[900px]:hidden"
            />
            <ol className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
              {billingSteps.map((step) => (
                <li
                  key={step.number}
                  className="relative rounded-[18px] border border-[#d5dbea] bg-white p-5 shadow-[0_6px_22px_rgba(18,21,40,.05)]"
                >
                  <span className="relative grid size-14 place-items-center rounded-full border-4 border-bg bg-[#6542e8] font-heading text-[13px] font-bold text-white shadow-[0_5px_16px_rgba(101,66,232,.25)]">
                    {step.number}
                  </span>
                  <h3 className="mt-5 text-[15px] font-bold text-[#121528]">{step.title}</h3>
                  <p className="mt-2 text-[12px] leading-[1.7] text-[#667085]">{step.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-y border-[#d5dbea] bg-bg-deep py-[88px] max-[820px]:py-[68px]">
        <div className={container}>
          <div className="mx-auto max-w-[650px] text-center">
            <span className="text-[12px] font-extrabold uppercase tracking-[0.13em] text-[#6542e8]">
              Choose your path
            </span>
            <h2 className="mt-3 font-heading text-[clamp(30px,4vw,44px)] font-semibold tracking-[-0.04em] text-[#121528]">
              Self-serve or tailored to your scale
            </h2>
          </div>

          <div className="mx-auto mt-10 grid max-w-[980px] grid-cols-2 gap-5 max-[760px]:grid-cols-1">
            <article className="relative overflow-hidden rounded-[22px] border border-[#6542e8] bg-[linear-gradient(150deg,rgba(101,66,232,.1),#fff_48%)] p-7 shadow-[0_20px_50px_rgba(101,66,232,.12)]">
              <span className="absolute right-5 top-5 rounded-full bg-[#6542e8] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.09em] text-white">
                Default
              </span>
              <span className="grid size-11 place-items-center rounded-xl bg-[rgba(101,66,232,.12)] text-[#6542e8]">
                <WalletCards size={21} aria-hidden="true" />
              </span>
              <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#6542e8]">
                Pay as you go
              </p>
              <h3 className="mt-2 font-heading text-[30px] font-semibold tracking-[-0.04em] text-[#121528]">
                ₹0 monthly fee
              </h3>
              <p className="mt-3 text-[13px] leading-[1.7] text-[#5c6478]">
                Start with free credits, then keep building by refilling one shared wallet.
              </p>
              <ul className="mt-6 grid gap-3 text-[13px] text-[#4f566b]">
                {[
                  signupCredits ? `${signupCredits} free starter credits` : "Free starter credits",
                  "All three AI services",
                  "Usage history in the portal",
                  "Refill whenever needed",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <Check size={15} className="shrink-0 text-success" /> {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 grid grid-cols-2 gap-3 max-[460px]:grid-cols-1">
                <Button large href={portalSignupUrl} className="w-full">
                  Start free <ArrowRight size={16} />
                </Button>
                <Button variant="quiet" large href={walletHref} className="w-full">
                  Refill wallet
                </Button>
              </div>
            </article>

            <article className="rounded-[22px] border border-[#d5dbea] bg-white p-7 shadow-[0_12px_36px_rgba(18,21,40,.08)]">
              <span className="grid size-11 place-items-center rounded-xl bg-[#fcecf5] text-[#a33e78]">
                <Mail size={21} aria-hidden="true" />
              </span>
              <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#a33e78]">
                Custom
              </p>
              <h3 className="mt-2 font-heading text-[30px] font-semibold tracking-[-0.04em] text-[#121528]">
                Built around your requirements
              </h3>
              <p className="mt-3 text-[13px] leading-[1.7] text-[#5c6478]">
                Share your expected usage, service mix, and support needs. We will work
                with you on a suitable commercial setup.
              </p>
              <ul className="mt-6 grid gap-3 text-[13px] text-[#4f566b]">
                {["Custom usage rates", "Volume requirements", "Dedicated support", "SLA options"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <Check size={15} className="shrink-0 text-success" /> {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" large href={contactHref} className="mt-8 w-full">
                Share your requirements <Mail size={16} />
              </Button>
              <p className="mt-3 text-center text-[11px] text-[#8a92a8]">
                Share your usage and support requirements
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-bg py-[82px] max-[820px]:py-[68px]">
        <div
          className={cx(
            container,
            "grid grid-cols-[.75fr_1.25fr] gap-14 max-[820px]:grid-cols-1 max-[820px]:gap-8",
          )}
        >
          <div>
            <span className="text-[12px] font-extrabold uppercase tracking-[0.13em] text-[#6542e8]">
              FAQ
            </span>
            <h2 className="mt-3 font-heading text-[clamp(30px,3.8vw,42px)] font-semibold tracking-[-0.04em] text-[#121528]">
              Pricing, without the guesswork
            </h2>
            <p className="mt-4 text-[13px] leading-[1.75] text-[#667085]">
              Still planning your usage? Contact us and we will help you choose between
              the standard wallet and a custom arrangement.
            </p>
          </div>
          <div className="grid gap-3">
            {pricingFaqs.map((faq, index) => {
              const open = openFaq === index;
              return (
                <div
                  key={faq.question}
                  className={cx(
                    "rounded-[14px] border bg-white transition-colors",
                    open
                      ? "border-[#6542e8]/45 bg-[rgba(124,58,237,.05)]"
                      : "border-[#d5dbea]",
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-[14px] font-semibold text-[#121528]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={cx(
                        "shrink-0 text-[#8a92a8] transition-transform duration-300",
                        open && "rotate-180",
                      )}
                    />
                  </button>
                  <div
                    className={cx(
                      "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="px-5 pb-4 text-[13px] leading-[1.7] text-[#6b7389]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative grid place-items-center overflow-hidden bg-[linear-gradient(135deg,#4d32c8,#6542e8_55%,#765ce4)] py-[88px] max-[560px]:py-[68px]">
        <div className={cx(container, "relative z-[2] text-center")}>
          <h2 className="font-heading text-[clamp(32px,4vw,46px)] font-[620] leading-[1.1] tracking-[-0.04em] text-white">
            Your first credits are on us.
          </h2>
          <p className="mx-auto mt-4 mb-8 max-w-[540px] text-sm leading-[1.7] text-[#ddd8f5]">
            Create your free account, try every service, and refill only when you are
            ready to keep building.
          </p>
          <div className="flex justify-center gap-3 max-[560px]:flex-col max-[560px]:items-stretch">
            <Button variant="light" large href={portalSignupUrl}>
              Start building free <ArrowRight size={18} />
            </Button>
            <Button variant="glass" large href={contactHref}>
              Discuss custom pricing
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
