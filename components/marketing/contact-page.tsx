"use client";

import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Mail,
  MessageSquareText,
  Mic2,
  Send,
  ShieldCheck,
  Sparkles,
  Volume2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { submitContactInquiry, type ContactInquiry } from "@/lib/contact-api";
import { container, cx } from "@/lib/cn";
import { fetchPublicPricing } from "@/lib/pricing-api";
import { customPricingEmail, portalSignupUrl } from "@/lib/site";

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-[#d9ddea] bg-white px-3.5 text-[13px] text-[#121528] outline-none transition placeholder:text-[#a0a6b7] focus:border-[#6542e8] focus:ring-4 focus:ring-[rgba(101,66,232,.09)]";

const inquiryTypes = [
  { value: "custom_pricing", label: "Custom pricing" },
  { value: "sales", label: "Sales inquiry" },
  { value: "partnership", label: "Partnership" },
  { value: "support", label: "Product support" },
  { value: "general", label: "General inquiry" },
] as const;

const validTopics = new Set(inquiryTypes.map((item) => item.value));

export function ContactPage() {
  const searchParams = useSearchParams();
  const requestedTopic = searchParams.get("topic") || "general";
  const defaultTopic = validTopics.has(requestedTopic as ContactInquiry["inquiryType"])
    ? requestedTopic
    : "general";
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState<string | null>(null);
  const [contactEmail, setContactEmail] = useState(customPricingEmail);

  useEffect(() => {
    const controller = new AbortController();
    void fetchPublicPricing(controller.signal)
      .then((pricing) => {
        if (pricing.customPricingEmail) setContactEmail(pricing.customPricingEmail);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setError("");
    setReference(null);

    const form = new FormData(event.currentTarget);
    try {
      const result = await submitContactInquiry({
        fullName: String(form.get("fullName") || ""),
        workEmail: String(form.get("workEmail") || ""),
        company: String(form.get("company") || ""),
        jobTitle: String(form.get("jobTitle") || ""),
        phone: String(form.get("phone") || ""),
        inquiryType: String(form.get("inquiryType")) as ContactInquiry["inquiryType"],
        services: form.getAll("services") as ContactInquiry["services"],
        monthlyUsage: String(form.get("monthlyUsage")) as ContactInquiry["monthlyUsage"],
        message: String(form.get("message") || ""),
        consent: true,
        website: String(form.get("website") || ""),
      });
      setReference(result.reference || "RECEIVED");
      formRef.current?.reset();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not send your inquiry.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="overflow-hidden bg-bg">
      <SiteHeader />

      <section className="relative pt-20 max-[820px]:pt-[68px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(101,66,232,.16),transparent_34%),radial-gradient(circle_at_90%_22%,rgba(15,123,133,.08),transparent_26%)]" />
        <div
          className={cx(
            container,
            "relative grid grid-cols-[.82fr_1.18fr] items-start gap-16 py-[76px] max-[920px]:grid-cols-1 max-[920px]:gap-10 max-[820px]:py-[58px]",
          )}
        >
          <div className="max-w-[500px] max-[920px]:max-w-[680px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(155,92,246,.3)] bg-[rgba(101,66,232,.1)] px-3 py-2 text-[12px] font-[750] uppercase tracking-[0.1em] text-[#6542e8]">
              <Sparkles size={14} aria-hidden="true" /> Contact ebma AI
            </div>
            <h1 className="mt-6 font-heading text-[clamp(42px,5.5vw,66px)] font-[650] leading-[1.03] tracking-[-0.055em] text-[#121528]">
              Tell us what you&apos;re
              <span className="bg-[linear-gradient(100deg,#6542e8,#a75fda_75%)] bg-clip-text text-transparent">
                {" "}building.
              </span>
            </h1>
            <p className="mt-6 text-[16px] leading-[1.75] text-[#5c6478]">
              Share your use case, expected usage, and timeline. Your inquiry goes
              directly to the contact address configured for pricing and business requests.
            </p>

            <div className="mt-9 grid gap-3">
              {[
                { icon: MessageSquareText, title: "Describe the use case", text: "Tell us what the experience should do for your users." },
                { icon: Building2, title: "Add business context", text: "Company, expected scale, and timeline help us route your request." },
                { icon: ShieldCheck, title: "Sent securely", text: "The backend validates and rate-limits every public submission." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-3 rounded-[16px] border border-[#ddd6f5] bg-white/80 p-4 shadow-[0_6px_18px_rgba(18,21,40,.05)]">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f3f0ff] text-[#6542e8]">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="text-[13px] font-bold text-[#121528]">{item.title}</h2>
                      <p className="mt-1 text-[11px] leading-[1.6] text-[#7a8299]">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 rounded-[16px] border border-[#d8d2ee] bg-[rgba(101,66,232,.07)] p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6542e8]">Email destination</p>
              <p className="mt-1.5 text-[13px] font-semibold text-[#343247]">{contactEmail}</p>
              <p className="mt-1 text-[11px] leading-[1.6] text-[#7a8299]">Loaded from the same backend configuration used when the form is submitted.</p>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#d8d2ee] bg-white p-7 shadow-[0_26px_70px_rgba(53,41,112,.14)] max-[560px]:p-5">
            {reference ? (
              <div className="grid min-h-[620px] place-items-center text-center">
                <div className="max-w-[430px]">
                  <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#e9f8f0] text-[#147449]">
                    <CheckCircle2 size={31} aria-hidden="true" />
                  </span>
                  <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#147449]">Inquiry sent</p>
                  <h2 className="mt-3 font-heading text-[32px] font-semibold tracking-[-0.04em] text-[#121528]">Thanks for reaching out.</h2>
                  <p className="mt-4 text-[14px] leading-[1.7] text-[#667085]">Your details have been delivered to our team. Keep this reference if you need to follow up.</p>
                  <div className="mx-auto mt-5 w-max rounded-xl border border-[#d8d2ee] bg-[#f8f7ff] px-4 py-3 font-mono text-sm font-bold tracking-[0.12em] text-[#6542e8]">{reference}</div>
                  <div className="mt-8 flex justify-center gap-3 max-[460px]:flex-col">
                    <Button href="/" variant="outline">Back to home</Button>
                    <Button href={portalSignupUrl}>Start building <ArrowRight size={16} /></Button>
                  </div>
                </div>
              </div>
            ) : (
              <form ref={formRef} onSubmit={onSubmit} className="grid gap-5">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#6542e8]">Send an inquiry</p>
                  <h2 className="mt-2 font-heading text-[28px] font-semibold tracking-[-0.035em] text-[#121528]">How can we help?</h2>
                  <p className="mt-2 text-[12px] leading-[1.65] text-[#7a8299]">Fields marked with * are required.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-[620px]:grid-cols-1">
                  <label className="text-[12px] font-semibold text-[#343247]">Full name *<input className={inputClass} name="fullName" autoComplete="name" required minLength={2} maxLength={100} placeholder="Your full name" /></label>
                  <label className="text-[12px] font-semibold text-[#343247]">Work email *<input className={inputClass} name="workEmail" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" /></label>
                  <label className="text-[12px] font-semibold text-[#343247]">Company *<input className={inputClass} name="company" autoComplete="organization" required minLength={2} maxLength={120} placeholder="Company name" /></label>
                  <label className="text-[12px] font-semibold text-[#343247]">Job title<input className={inputClass} name="jobTitle" autoComplete="organization-title" maxLength={100} placeholder="Your role" /></label>
                  <label className="text-[12px] font-semibold text-[#343247]">Phone number<input className={inputClass} name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="+91 98765 43210" /></label>
                  <label className="text-[12px] font-semibold text-[#343247]">Inquiry type *<select className={inputClass} name="inquiryType" defaultValue={defaultTopic} required>{inquiryTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
                </div>

                <fieldset>
                  <legend className="text-[12px] font-semibold text-[#343247]">Services of interest</legend>
                  <div className="mt-2 grid grid-cols-3 gap-2 max-[560px]:grid-cols-1">
                    {[
                      { value: "stt", label: "Speech to Text", icon: Mic2 },
                      { value: "tts", label: "Text to Speech", icon: Volume2 },
                      { value: "llm", label: "LLM Assistant", icon: Bot },
                    ].map((service) => {
                      const Icon = service.icon;
                      return (
                        <label key={service.value} className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#d9ddea] bg-[#fafbfe] px-3 py-3 text-[11px] font-semibold text-[#4f566b] transition hover:border-[#bdb1ee] has-[:checked]:border-[#6542e8] has-[:checked]:bg-[#f3f0ff] has-[:checked]:text-[#4d32c8]">
                          <input className="size-3.5 accent-[#6542e8]" type="checkbox" name="services" value={service.value} />
                          <Icon size={14} aria-hidden="true" /> {service.label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <label className="text-[12px] font-semibold text-[#343247]">Expected monthly usage<select className={inputClass} name="monthlyUsage" defaultValue="not_sure"><option value="not_sure">Not sure yet</option><option value="exploring">Exploring / prototype</option><option value="small">Up to 1,000 units</option><option value="growing">1,000–10,000 units</option><option value="high_volume">More than 10,000 units</option></select></label>

                <label className="text-[12px] font-semibold text-[#343247]">Tell us about your requirements *<textarea className="mt-2 min-h-36 w-full resize-y rounded-xl border border-[#d9ddea] bg-white px-3.5 py-3 text-[13px] leading-[1.65] text-[#121528] outline-none transition placeholder:text-[#a0a6b7] focus:border-[#6542e8] focus:ring-4 focus:ring-[rgba(101,66,232,.09)]" name="message" required minLength={20} maxLength={4000} placeholder="What are you building, what scale do you expect, and what would a successful outcome look like?" /></label>

                <div className="absolute -left-[9999px]" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>

                <label className="flex items-start gap-2.5 text-[11px] leading-[1.6] text-[#667085]"><input className="mt-0.5 size-4 shrink-0 accent-[#6542e8]" type="checkbox" name="consent" required />I agree that ebma AI may use these details to respond to my inquiry.</label>

                {error && <p role="alert" className="rounded-xl border border-[#f0c6cf] bg-[#fff1f3] px-4 py-3 text-[12px] text-[#a11d3f]">{error}</p>}

                <button type="submit" disabled={sending} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-[14px] bg-brand-gradient px-6 text-sm font-bold text-white shadow-[0_10px_28px_rgba(101,66,232,.26)] transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">
                  {sending ? "Sending inquiry…" : "Send inquiry"} <Send size={16} aria-hidden="true" />
                </button>
                <p className="flex items-center justify-center gap-1.5 text-center text-[10px] text-[#8a92a8]"><Mail size={12} aria-hidden="true" /> Delivered to the configured ebma AI contact inbox</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
