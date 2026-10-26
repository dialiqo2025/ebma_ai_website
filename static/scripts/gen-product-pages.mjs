import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../pages/products");

const products = [
  {
    slug: "speech-to-text",
    file: "speech-to-text.html",
    title: "Speech to Text | ebma AI",
    glow: "rgba(2,132,199,.12)",
    text: "text-[#0284c7]",
    border: "border-[rgba(2,132,199,.28)]",
    soft: "bg-[rgba(2,132,199,.08)]",
    eyebrow: "Speech to text",
    h1: "Turn speech into",
    highlight: "accurate, structured text.",
    description:
      "Live microphone streaming and long-form file transcription with speaker labels, multilingual output modes, and export-ready captions—built for real conversations, accents, and noisy environments.",
    primaryLabel: "Try in playground",
    secondaryLabel: "Start building free",
    secondaryHref: "{{ROOT}}index.html#contact",
    highlights: [
      "Live WebSocket streaming",
      "File upload up to hours of audio",
      "Speaker diarization",
      "TXT · SRT · VTT · JSON export",
    ],
    demoRoot: "stt-demo-root",
    demoScripts: ["data/demos.js", "js/stt-demo.js"],
    related: [
      {
        href: "text-to-speech.html",
        eyebrow: "Text to speech",
        title: "Voices that feel natural - and shippable.",
      },
      {
        href: "llm.html",
        eyebrow: "LLM Studio",
        title: "Language intelligence with context that sticks.",
      },
    ],
  },
  {
    slug: "text-to-speech",
    file: "text-to-speech.html",
    title: "Text to Speech | ebma AI",
    glow: "rgba(124,58,237,.12)",
    text: "text-[#6542e8]",
    border: "border-[rgba(124,58,237,.28)]",
    soft: "bg-[rgba(124,58,237,.08)]",
    eyebrow: "Text to speech",
    h1: "Voices that feel",
    highlight: "natural - and shippable.",
    description:
      "Generate expressive speech from text with language-aware controls, playback while generating, and optional voice clone workflows when your backend supports them.",
    primaryLabel: "Try in playground",
    secondaryLabel: "Start building free",
    secondaryHref: "{{ROOT}}index.html#contact",
    highlights: [
      "Natural multilingual speech",
      "Speed & pitch controls",
      "Play while generating",
      "Voice clone UI (when enabled)",
    ],
    demoRoot: "tts-demo-root",
    demoScripts: ["data/demos.js", "js/tts-demo.js"],
    related: [
      {
        href: "speech-to-text.html",
        eyebrow: "Speech to text",
        title: "Turn speech into accurate, structured text.",
      },
      {
        href: "llm.html",
        eyebrow: "LLM Studio",
        title: "Language intelligence with context that sticks.",
      },
    ],
  },
  {
    slug: "llm",
    file: "llm.html",
    title: "LLM Studio | ebma AI",
    glow: "rgba(219,39,119,.12)",
    text: "text-[#db2777]",
    border: "border-[rgba(219,39,119,.28)]",
    soft: "bg-[rgba(219,39,119,.08)]",
    eyebrow: "LLM Studio",
    h1: "Language intelligence",
    highlight: "with context that sticks.",
    description:
      "Build assistants that understand your domain—summarize conversations, answer with grounding, and connect tools—powered by modern LLM capabilities in the ebma stack.",
    primaryLabel: "Join the waitlist",
    secondaryLabel: "Talk to our team",
    secondaryHref: "{{ROOT}}contact.html",
    highlights: [
      "Gemini-powered reasoning",
      "Long-context workflows",
      "Tool-ready agents",
      "Voice + language stack",
    ],
    demoRoot: "llm-demo-root",
    demoScripts: ["data/demos.js", "js/llm-demo.js"],
    related: [
      {
        href: "speech-to-text.html",
        eyebrow: "Speech to text",
        title: "Turn speech into accurate, structured text.",
      },
      {
        href: "text-to-speech.html",
        eyebrow: "Text to speech",
        title: "Voices that feel natural - and shippable.",
      },
    ],
  },
];

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-[14px] min-h-[52px] px-6 text-sm font-bold cursor-pointer transition duration-[250ms] whitespace-nowrap hover:-translate-y-px border-0 text-white bg-brand-gradient shadow-[0_9px_28px_rgba(101,66,232,.25),inset_0_1px_rgba(255,255,255,.15)] max-[560px]:w-full";
const btnQuiet =
  "inline-flex items-center justify-center gap-2 rounded-[14px] min-h-[52px] px-6 text-sm font-bold cursor-pointer transition duration-[250ms] whitespace-nowrap hover:-translate-y-px border border-black/8 bg-black/[0.03] text-[#1d1b2e] max-[560px]:w-full";
const btnLight =
  "inline-flex items-center justify-center gap-2 rounded-[14px] min-h-[52px] px-6 text-sm font-bold border-0 bg-white text-[#4d32c8]";
const btnGlass =
  "inline-flex items-center justify-center gap-2 rounded-[14px] min-h-[52px] px-6 text-sm font-bold border border-white/35 bg-white/15 text-white";

fs.mkdirSync(outDir, { recursive: true });

for (const p of products) {
  const highlights = p.highlights
    .map(
      (h) =>
        `<span class="inline-flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-success"><path d="M20 6 9 17l-5-5"/></svg> ${h}</span>`,
    )
    .join("\n              ");
  const related = p.related
    .map(
      (r) => `
              <a href="${r.href}" class="rounded-[16px] border border-[#d5dbea] bg-white p-5 shadow-[0_8px_24px_rgba(18,21,40,.08)] transition duration-250 hover:-translate-y-0.5 hover:border-[#c5cce0] hover:shadow-[0_12px_32px_rgba(18,21,40,.1)]">
                <span class="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#6542e8]">${r.eyebrow}</span>
                <p class="mt-2 font-heading text-[20px] font-semibold text-[#121528]">${r.title}</p>
                <span class="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold text-[#5c6478]">Explore <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>
              </a>`,
    )
    .join("");
  const scripts = p.demoScripts
    .map((s) => `<script src="{{ROOT}}${s}"></script>`)
    .join("\n");

  const html = `<!-- title: ${p.title} -->
{{HEADER}}
<main class="overflow-hidden bg-bg" data-product-slug="${p.slug}">
  <section class="relative pt-20 max-[820px]:pt-[68px]" style="background: radial-gradient(circle at 78% 18%, ${p.glow}, transparent 28%), linear-gradient(180deg,#f7f8fc,#eef1f8);">
    <div class="mx-auto w-[min(1180px,calc(100%-48px))] max-[820px]:w-[calc(100%-32px)] relative grid grid-cols-[1.1fr_0.9fr] items-center gap-16 py-[60px] max-[1050px]:gap-10 max-[820px]:grid-cols-1 max-[820px]:py-[70px]">
      <div class="max-[820px]:text-center">
        <div class="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[12px] font-[750] uppercase tracking-[0.1em] ${p.border} ${p.soft} ${p.text}">${p.eyebrow}</div>
        <h1 class="my-[26px] mb-5 font-heading text-[clamp(40px,5vw,64px)] font-[650] leading-[1.05] tracking-[-0.05em] text-[#121528]">
          ${p.h1}<br />
          <span class="bg-[linear-gradient(100deg,#8c7ff7,#bd71ed_75%)] bg-clip-text text-transparent">${p.highlight}</span>
        </h1>
        <p class="m-0 max-w-[560px] text-lg leading-[1.7] text-[#5c6478] max-[820px]:mx-auto max-[560px]:text-[15px]">${p.description}</p>
        <div class="mt-8 flex gap-3 max-[820px]:justify-center max-[560px]:flex-col">
          <a data-product-primary-cta href="#" class="${btnPrimary}">${p.primaryLabel} <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
          <a href="${p.secondaryHref}" class="${btnQuiet}">${p.secondaryLabel}</a>
        </div>
        <div class="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-[#7a8299] max-[820px]:justify-center">
              ${highlights}
        </div>
      </div>
      <div id="product-code-panel-root"></div>
    </div>
  </section>

  <section class="border-t border-[#d5dbea] bg-bg py-[70px] max-[820px]:py-[60px]">
    <div class="mx-auto w-[min(1180px,calc(100%-48px))] max-[820px]:w-[calc(100%-32px)]">
      <div class="mb-8 max-w-[640px] max-[820px]:mx-auto max-[820px]:text-center">
        <span class="text-[12px] font-extrabold uppercase tracking-[0.13em] ${p.text}">Interactive preview</span>
        <h2 class="mt-3 font-heading text-[clamp(28px,3.4vw,40px)] font-semibold tracking-[-0.035em] text-[#121528]">Test it before you sign in</h2>
        <p class="mt-3 text-[14px] leading-[1.7] text-[#6b7389]">Try a live browser preview on this page. Full production quality continues in the portal.</p>
      </div>
      <div id="${p.demoRoot}"></div>
    </div>
  </section>

  <div id="product-interactive-root" data-product-slug="${p.slug}"></div>

  <section class="bg-bg-deep py-[60px] max-[820px]:py-[60px]">
    <div class="mx-auto w-[min(1180px,calc(100%-48px))] max-[820px]:w-[calc(100%-32px)]">
      <h2 class="mb-6 font-heading text-[28px] font-semibold tracking-[-0.03em] text-[#121528]">More from ebma</h2>
      <div class="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">${related}
      </div>
    </div>
  </section>

  <section class="relative grid place-items-center overflow-hidden bg-[linear-gradient(135deg,#4d32c8,#6542e8_55%,#6542e8)] py-[90px] max-[560px]:py-[70px]">
    <div class="mx-auto w-[min(1180px,calc(100%-48px))] max-[820px]:w-[calc(100%-32px)] relative z-[2] text-center">
      <h2 class="font-heading text-[clamp(32px,4vw,46px)] font-[620] leading-[1.1] tracking-[-0.04em] text-white">Ready to try ${p.eyebrow.toLowerCase()}?</h2>
      <p class="mx-auto mt-4 mb-8 max-w-[520px] text-sm leading-[1.7] text-[#d4d0ec]">Open the portal playground or create a free account to start building.</p>
      <div class="flex justify-center gap-3 max-[560px]:flex-col max-[560px]:items-stretch">
        <a data-product-primary-cta href="#" class="${btnLight}">${p.primaryLabel} <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
        <a data-ebma-href="portalSignupUrl" href="#" class="${btnGlass}">Create free account</a>
      </div>
    </div>
  </section>
</main>
{{FOOTER}}
<script src="{{ROOT}}data/products.js"></script>
${scripts}
<script src="{{ROOT}}js/product-interactive.js"></script>
`;

  fs.writeFileSync(path.join(outDir, p.file), html, "utf8");
  console.log("wrote", p.file);
}
