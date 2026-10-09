import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { LlmSampleDemo } from "@/components/marketing/llm-sample-demo";
import {
  ProductCodePanel,
  ProductInteractiveBody,
} from "@/components/marketing/product-interactive";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { SttSampleDemo } from "@/components/marketing/stt-sample-demo";
import { TtsSampleDemo } from "@/components/marketing/tts-sample-demo";
import { Button } from "@/components/ui/button";
import type { ProductPageContent } from "@/content/products";
import { products } from "@/content/products";
import { container, cx } from "@/lib/cn";
import {
  portalPlatformUrl,
  portalSignupUrl,
  portalSttUrl,
  portalTtsUrl,
} from "@/lib/site";

const accentMap = {
  cyan: {
    glow: "rgba(2,132,199,.12)",
    text: "text-[#0284c7]",
    border: "border-[rgba(2,132,199,.28)]",
    soft: "bg-[rgba(2,132,199,.08)]",
  },
  violet: {
    glow: "rgba(124,58,237,.12)",
    text: "text-[#7c3aed]",
    border: "border-[rgba(124,58,237,.28)]",
    soft: "bg-[rgba(124,58,237,.08)]",
  },
  pink: {
    glow: "rgba(219,39,119,.12)",
    text: "text-[#db2777]",
    border: "border-[rgba(219,39,119,.28)]",
    soft: "bg-[rgba(219,39,119,.08)]",
  },
} as const;

function resolveCta(hrefKey: ProductPageContent["primaryCta"]["hrefKey"]) {
  switch (hrefKey) {
    case "stt":
      return portalSttUrl;
    case "tts":
      return portalTtsUrl;
    case "platform":
      return portalPlatformUrl;
    default:
      return portalSignupUrl;
  }
}

function ProductDemo({ slug }: { slug: string }) {
  if (slug === "speech-to-text") return <SttSampleDemo />;
  if (slug === "text-to-speech") return <TtsSampleDemo />;
  if (slug === "llm") return <LlmSampleDemo />;
  return null;
}

export function ProductPage({ product }: { product: ProductPageContent }) {
  const accent = accentMap[product.accent];
  const primaryHref = resolveCta(product.primaryCta.hrefKey);
  const related = products.filter((p) => p.slug !== product.slug);

  return (
    <main className="overflow-hidden bg-bg">
      <SiteHeader />

      <section
        className="relative pt-20 max-[820px]:pt-[68px]"
        style={{
          background: `radial-gradient(circle at 78% 18%, ${accent.glow}, transparent 28%), linear-gradient(180deg,#f7f8fc,#eef1f8)`,
        }}
      >
        <div
          className={cx(
            container,
            "relative grid grid-cols-[1.1fr_0.9fr] items-center gap-16 py-[60px] max-[1050px]:gap-10 max-[820px]:grid-cols-1 max-[820px]:py-[70px]",
          )}
        >
          <div className="max-[820px]:text-center">
            <div
              className={cx(
                "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[12px] font-[750] uppercase tracking-[0.1em]",
                accent.border,
                accent.soft,
                accent.text,
              )}
            >
              {product.eyebrow}
            </div>
            <h1 className="my-[26px] mb-5 font-heading text-[clamp(40px,5vw,64px)] font-[650] leading-[1.05] tracking-[-0.05em] text-[#121528]">
              {product.title}
              <br />
              <span className="bg-[linear-gradient(100deg,#8c7ff7,#bd71ed_75%)] bg-clip-text text-transparent">
                {product.highlight}
              </span>
            </h1>
            <p className="m-0 max-w-[560px] text-lg leading-[1.7] text-[#5c6478] max-[820px]:mx-auto max-[560px]:text-[15px]">
              {product.description}
            </p>
            <div className="mt-8 flex gap-3 max-[820px]:justify-center max-[560px]:flex-col">
              <Button variant="primary" large href={primaryHref} className="max-[560px]:w-full">
                {product.primaryCta.label} <ArrowRight size={18} />
              </Button>
              <Button
                variant="quiet"
                large
                href={product.secondaryCta.href}
                className="max-[560px]:w-full"
              >
                {product.secondaryCta.label}
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-[#7a8299] max-[820px]:justify-center">
              {product.highlights.map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-success" /> {item}
                </span>
              ))}
            </div>
          </div>

          <ProductCodePanel product={product} accentClass={accent.text} />
        </div>
      </section>

      <section className="border-t border-[#d5dbea] bg-bg py-[70px] max-[820px]:py-[60px]">
        <div className={container}>
          <div className="mb-8 max-w-[640px] max-[820px]:mx-auto max-[820px]:text-center">
            <span className={cx("text-[12px] font-extrabold uppercase tracking-[0.13em]", accent.text)}>
              Interactive preview
            </span>
            <h2 className="mt-3 font-heading text-[clamp(28px,3.4vw,40px)] font-semibold tracking-[-0.035em] text-[#121528]">
              Test it before you sign in
            </h2>
            <p className="mt-3 text-[14px] leading-[1.7] text-[#6b7389]">
              Try a live browser preview on this page. Full production quality continues in
              the portal.
            </p>
          </div>
          <ProductDemo slug={product.slug} />
        </div>
      </section>

      <ProductInteractiveBody product={product} />

      <section className="bg-bg-deep py-[60px] max-[820px]:py-[60px]">
        <div className={container}>
          <h2 className="mb-6 font-heading text-[28px] font-semibold tracking-[-0.03em] text-[#121528]">
            More from ebma
          </h2>
          <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/products/${item.slug}`}
                className="rounded-[16px] border border-[#d5dbea] bg-white p-5 shadow-[0_8px_24px_rgba(18,21,40,.08)] transition duration-250 hover:-translate-y-0.5 hover:border-[#c5cce0] hover:shadow-[0_12px_32px_rgba(18,21,40,.1)]"
              >
                <span className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#6b5ce6]">
                  {item.eyebrow}
                </span>
                <p className="mt-2 font-heading text-[20px] font-semibold text-[#121528]">
                  {item.title} {item.highlight}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold text-[#5c6478]">
                  Explore <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative grid place-items-center overflow-hidden bg-[linear-gradient(135deg,#4033bd,#6d42d7_55%,#834ad9)] py-[90px] max-[560px]:py-[70px]">
        <div className={cx(container, "relative z-[2] text-center")}>
          <h2 className="font-heading text-[clamp(32px,4vw,46px)] font-[620] leading-[1.1] tracking-[-0.04em] text-white">
            Ready to try {product.eyebrow.toLowerCase()}?
          </h2>
          <p className="mx-auto mt-4 mb-8 max-w-[520px] text-sm leading-[1.7] text-[#d4d0ec]">
            Open the portal playground or create a free account to start building.
          </p>
          <div className="flex justify-center gap-3 max-[560px]:flex-col max-[560px]:items-stretch">
            <Button variant="light" large href={primaryHref}>
              {product.primaryCta.label} <ArrowRight size={18} />
            </Button>
            <Button variant="glass" large href={portalSignupUrl}>
              Create free account
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
