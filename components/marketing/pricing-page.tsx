"use client";

import { ArrowRight, Check, ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import {
  pricingFaqs,
  pricingHighlights,
  pricingPlans,
} from "@/content/pricing";
import { container, cx } from "@/lib/cn";
import { portalSignupUrl, supportEmail } from "@/lib/site";

export function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const contactHref = `mailto:${supportEmail}?subject=ebma%20AI%20Enterprise%20pricing`;

  return (
    <main className="overflow-hidden bg-bg">
      <SiteHeader />

      <section className="relative pt-20 max-[820px]:pt-[68px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(91,79,233,.12),transparent_42%)]" />
        <div className={cx(container, "relative py-[90px] text-center max-[820px]:py-[70px]")}>
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[rgba(155,92,246,.3)] bg-[rgba(91,79,233,.1)] px-3 py-2 text-[12px] font-[750] uppercase tracking-[0.1em] text-[#6b5ce6]">
            <Sparkles size={14} /> Pricing
          </div>
          <h1 className="mx-auto mt-6 max-w-[780px] font-heading text-[clamp(40px,5vw,64px)] font-[650] leading-[1.05] tracking-[-0.05em] text-[#121528]">
            Simple plans for
            <br />
            <span className="bg-[linear-gradient(100deg,#8c7ff7,#bd71ed_75%)] bg-clip-text text-transparent">
              voice that ships.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-[560px] text-lg leading-[1.7] text-[#5c6478] max-[560px]:text-[15px]">
            Start free in the portal, scale with Pro credits, or go Enterprise when
            security and volume matter.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] text-[#7a8299]">
            {pricingHighlights.map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-success" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#d5dbea] bg-bg-deep pb-[100px] max-[820px]:pb-[72px]">
        <div className={container}>
          <div className="grid grid-cols-3 gap-4 max-[980px]:grid-cols-1">
            {pricingPlans.map((plan) => {
              const href =
                plan.ctaHref === "contact" ? contactHref : portalSignupUrl;
              return (
                <article
                  key={plan.id}
                  className={cx(
                    "relative flex flex-col rounded-[20px] border p-6 transition duration-250",
                    plan.highlighted
                      ? "border-[#7c3aed] bg-[linear-gradient(160deg,rgba(91,79,233,.08),#ffffff_45%)] shadow-[0_24px_60px_rgba(91,79,233,.12)]"
                      : "border-[#d5dbea] bg-white shadow-[0_8px_24px_rgba(18,21,40,.08)] hover:border-[#c5cce0]",
                  )}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-6 rounded-full bg-[linear-gradient(90deg,#5b4fe9,#9b5cf6)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
                      Most popular
                    </span>
                  )}
                  <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#6b5ce6]">
                    {plan.name}
                  </p>
                  <div className="mt-4 flex items-end gap-1.5">
                    <span className="font-heading text-[42px] font-semibold leading-none tracking-[-0.04em] text-[#121528]">
                      {plan.price}
                    </span>
                    <span className="pb-1 text-[13px] text-[#6b7389]">{plan.period}</span>
                  </div>
                  <p className="mt-4 text-[13px] leading-[1.65] text-[#5c6478]">
                    {plan.blurb}
                  </p>
                  <p className="mt-4 rounded-xl border border-[#e2e7f2] bg-[#f8fafc] px-3 py-2 text-[12px] font-semibold text-[#121528]">
                    {plan.credits}
                  </p>
                  <ul className="mt-5 mb-8 flex-1 space-y-2.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-[13px] text-[#5c6478]"
                      >
                        <Check size={14} className="mt-0.5 shrink-0 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.highlighted ? "primary" : "quiet"}
                    large
                    href={href}
                    className="w-full"
                  >
                    {plan.ctaLabel} <ArrowRight size={16} />
                  </Button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-bg py-[90px] max-[820px]:py-[70px]">
        <div className={cx(container, "grid grid-cols-2 gap-10 max-[820px]:grid-cols-1")}>
          <div>
            <span className="text-[12px] font-extrabold uppercase tracking-[0.13em] text-[#6b5ce6]">
              How billing works
            </span>
            <h2 className="mt-3 font-heading text-[clamp(28px,3.4vw,40px)] font-semibold tracking-[-0.035em] text-[#121528]">
              Credits that map to real usage
            </h2>
            <p className="mt-4 text-[14px] leading-[1.75] text-[#5c6478]">
              Use the same STT, TTS, and studio surfaces from Free to Enterprise.
              Watch remaining credits in the portal sidebar, then upgrade when you
              need more capacity.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              {
                title: "Speech to text",
                detail: "Live streaming and file jobs consume credits by audio duration.",
              },
              {
                title: "Text to speech",
                detail: "Generations consume credits by characters and voice mode.",
              },
              {
                title: "LLM Studio",
                detail: "Studio usage will draw from the same credit wallet as it launches.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[14px] border border-[#d5dbea] bg-white px-5 py-4 shadow-[0_4px_16px_rgba(18,21,40,.06)]"
              >
                <h3 className="text-[15px] font-semibold text-[#121528]">{item.title}</h3>
                <p className="mt-1.5 text-[13px] leading-[1.65] text-[#5c6478]">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#d5dbea] bg-bg-deep py-[100px] max-[820px]:py-[72px]">
        <div className={container}>
          <div className="mb-10 max-w-[560px]">
            <span className="text-[12px] font-extrabold uppercase tracking-[0.13em] text-[#6b5ce6]">
              FAQ
            </span>
            <h2 className="mt-3 font-heading text-[clamp(28px,3.4vw,40px)] font-semibold tracking-[-0.035em] text-[#121528]">
              Pricing questions
            </h2>
          </div>
          <div className="grid gap-3">
            {pricingFaqs.map((faq, index) => {
              const open = openFaq === index;
              return (
                <div
                  key={faq.question}
                  className={cx(
                    "rounded-[14px] border bg-white transition-colors",
                    open ? "border-[#7c3aed]/45 bg-[rgba(124,58,237,.06)]" : "border-[#d5dbea]",
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-[15px] font-semibold text-[#121528]">
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

      <section className="relative grid place-items-center overflow-hidden bg-[linear-gradient(135deg,#4033bd,#6d42d7_55%,#834ad9)] py-[90px] max-[560px]:py-[70px]">
        <div className={cx(container, "relative z-[2] text-center")}>
          <h2 className="font-heading text-[clamp(32px,4vw,46px)] font-[620] leading-[1.1] tracking-[-0.04em] text-white">
            Start free. Scale when it clicks.
          </h2>
          <p className="mx-auto mt-4 mb-8 max-w-[520px] text-sm leading-[1.7] text-[#d4d0ec]">
            Create an account to use the playgrounds, or talk to us about Enterprise.
          </p>
          <div className="flex justify-center gap-3 max-[560px]:flex-col max-[560px]:items-stretch">
            <Button variant="light" large href={portalSignupUrl}>
              Start building free <ArrowRight size={18} />
            </Button>
            <Button variant="glass" large href={contactHref}>
              Talk to sales
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
