"use client";

import { Check, ChevronDown, Copy } from "lucide-react";
import { useState } from "react";
import type { ProductPageContent } from "@/content/products";
import { container, cx } from "@/lib/cn";

const accentText = {
  cyan: "text-[#38bdf8]",
  violet: "text-[#9b5cf6]",
  pink: "text-[#ef76ca]",
} as const;

const accentBorder = {
  cyan: "border-[#38bdf8]/45 bg-[rgba(56,189,248,.08)]",
  violet: "border-[#9b5cf6]/45 bg-[rgba(155,92,246,.08)]",
  pink: "border-[#ef76ca]/45 bg-[rgba(239,118,202,.08)]",
} as const;

export function ProductCodePanel({
  product,
  accentClass,
}: {
  product: ProductPageContent;
  accentClass: string;
}) {
  const [copied, setCopied] = useState(false);
  const code = product.codeSample?.code ?? "";

  const onCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[18px] border border-[#30385f] bg-[#101425] shadow-[0_35px_80px_rgba(0,0,0,.4)]">
      <div className="flex h-[54px] items-center justify-between border-b border-[#262d4d] px-[18px] text-[12px] text-[#9aa5b8]">
        <span className="text-[#d2d5e7]">{product.codeSample?.language ?? "API"}</span>
        <div className="flex items-center gap-3">
          <span className={accentClass}>Ready</span>
          <button
            type="button"
            onClick={() => void onCopy()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#2c3457] bg-[#171c33] px-2.5 py-1.5 text-[12px] text-[#aeb6c9] transition hover:text-white"
          >
            {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <pre className="m-0 min-h-[280px] overflow-auto p-[24px_26px] font-mono text-[12px] leading-[1.9] text-[#abb1cc] max-[560px]:px-4">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function ProductInteractiveBody({
  product,
}: {
  product: ProductPageContent;
}) {
  const accent = product.accent;
  const [featureIndex, setFeatureIndex] = useState(0);
  const [useCaseIndex, setUseCaseIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const activeFeature = product.features[featureIndex] ?? product.features[0];
  const activeUseCase = product.useCases[useCaseIndex] ?? product.useCases[0];

  return (
    <>
      <section className="border-t border-white/[0.04] bg-[#0d1020] py-[100px] max-[820px]:py-[72px]">
        <div className={container}>
          <div className="mb-12 max-w-[640px] max-[820px]:mx-auto max-[820px]:text-center">
            <span className={cx("text-[12px] font-extrabold uppercase tracking-[0.13em]", accentText[accent])}>
              Capabilities
            </span>
            <h2 className="mt-3 font-heading text-[clamp(30px,3.5vw,42px)] font-semibold tracking-[-0.035em]">
              Built for real products
            </h2>
            <p className="mt-3 text-[14px] text-[#8d94b4]">
              Click a capability to explore what it unlocks.
            </p>
          </div>

          <div className="grid grid-cols-[0.95fr_1.05fr] gap-5 max-[820px]:grid-cols-1">
            <div className="grid gap-2">
              {product.features.map((feature, index) => {
                const active = index === featureIndex;
                return (
                  <button
                    key={feature.title}
                    type="button"
                    onClick={() => setFeatureIndex(index)}
                    className={cx(
                      "rounded-[14px] border px-4 py-3.5 text-left transition duration-250",
                      active
                        ? accentBorder[accent]
                        : "border-[#283052] bg-[#12172b] hover:border-[#3a4570]",
                    )}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-heading text-[15px] font-semibold text-white">
                        {feature.title}
                      </span>
                      <span className="text-[11px] font-bold text-[#7f8aa5]">
                        0{index + 1}
                      </span>
                    </span>
                    <span
                      className={cx(
                        "mt-1 block text-[12px] leading-relaxed text-[#a8b4c8] transition-[max-height,opacity] duration-300",
                        active ? "max-h-24 opacity-100" : "max-h-0 overflow-hidden opacity-0",
                      )}
                    >
                      {feature.description}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              key={activeFeature.title}
              className="animate-[fade-up_.35s_ease_both] rounded-[18px] border border-[#283052] bg-[linear-gradient(145deg,#151a31,#111528)] p-6"
            >
              <p className={cx("text-[12px] font-extrabold uppercase tracking-[0.12em]", accentText[accent])}>
                Spotlight
              </p>
              <h3 className="mt-3 font-heading text-[28px] font-semibold tracking-[-0.03em] text-white max-[560px]:text-[22px]">
                {activeFeature.title}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.75] text-[#aeb6c9]">
                {activeFeature.description}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
                {product.capabilities.slice(0, 4).map((cap) => (
                  <div
                    key={`${activeFeature.title}-${cap.label}`}
                    className="rounded-xl border border-[#2a3358] bg-[#0f1424] px-3.5 py-3"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8b98ae]">
                      {cap.label}
                    </p>
                    <p className="mt-1 text-[13px] text-[#d7daea]">{cap.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg-deep py-[100px] max-[820px]:py-[72px]">
        <div className={container}>
          <div className="mb-8 max-w-[640px]">
            <span className={cx("text-[12px] font-extrabold uppercase tracking-[0.13em]", accentText[accent])}>
              Use cases
            </span>
            <h2 className="mt-3 font-heading text-[clamp(30px,3.5vw,42px)] font-semibold tracking-[-0.035em]">
              Where teams use it
            </h2>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {product.useCases.map((useCase, index) => (
              <button
                key={useCase.title}
                type="button"
                onClick={() => setUseCaseIndex(index)}
                className={cx(
                  "rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition duration-200",
                  index === useCaseIndex
                    ? accentBorder[accent] + " text-white"
                    : "border-[#2f3a5c] text-[#aeb6c9] hover:border-[#454e7d]",
                )}
              >
                {useCase.title}
              </button>
            ))}
          </div>

          <div
            key={activeUseCase.title}
            className="animate-[fade-up_.3s_ease_both] grid grid-cols-[1.2fr_0.8fr] gap-5 rounded-[18px] border border-[#283052] bg-[#12172b] p-6 max-[820px]:grid-cols-1"
          >
            <div>
              <h3 className="font-heading text-[24px] font-semibold text-white">
                {activeUseCase.title}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.75] text-[#aeb6c9]">
                {activeUseCase.description}
              </p>
              <ul className="mt-5 space-y-2">
                {[
                  "Start from a sample workflow in the portal",
                  "Connect STT / TTS / LLM as needed",
                  "Export or automate from your account",
                ].map((step) => (
                  <li key={step} className="flex items-start gap-2 text-[13px] text-[#c5d0e0]">
                    <Check size={14} className="mt-0.5 shrink-0 text-success" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#2a3358] bg-[#0d1220] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8b98ae]">
                Spec snapshot
              </p>
              <div className="mt-3 space-y-2">
                {product.capabilities.slice(0, 3).map((cap) => (
                  <div
                    key={cap.label}
                    className="flex items-center justify-between gap-3 rounded-lg bg-[#151a30] px-3 py-2.5 text-[12px]"
                  >
                    <span className="text-[#9aa5b8]">{cap.label}</span>
                    <span className="text-right text-[#e6e7f1]">{cap.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.04] bg-[#0d1020] py-[100px] max-[820px]:py-[72px]">
        <div className={container}>
          <div className="mb-10 max-w-[560px]">
            <span className={cx("text-[12px] font-extrabold uppercase tracking-[0.13em]", accentText[accent])}>
              FAQ
            </span>
            <h2 className="mt-3 font-heading text-[clamp(30px,3.5vw,42px)] font-semibold tracking-[-0.035em]">
              Common questions
            </h2>
          </div>
          <div className="grid gap-3">
            {product.faqs.map((faq, index) => {
              const open = openFaq === index;
              return (
                <div
                  key={faq.question}
                  className={cx(
                    "rounded-[14px] border bg-[#12172b] transition-colors duration-200",
                    open ? accentBorder[accent] : "border-[#283052]",
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-[15px] font-semibold text-white">{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={cx(
                        "shrink-0 text-[#8b98ae] transition-transform duration-300",
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
                      <p className="px-5 pb-4 text-[13px] leading-[1.7] text-[#a8b4c8]">
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
    </>
  );
}
