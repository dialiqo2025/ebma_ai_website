import {
  ArrowRight,
  AudioLines,
  Bot,
  Braces,
  Languages,
  Mic2,
  Sparkles,
  Volume2,
} from "lucide-react";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { container, cx } from "@/lib/cn";
import { portalSignupUrl } from "@/lib/site";

const capabilities = [
  {
    icon: Mic2,
    label: "Speech to text",
    title: "Make every conversation usable.",
    text: "Transform live and recorded speech into structured text for products, operations, and customer experiences.",
    href: "/products/speech-to-text",
    color: "#0284c7",
    soft: "#eaf7fd",
  },
  {
    icon: Volume2,
    label: "Text to speech",
    title: "Give products a natural voice.",
    text: "Turn written content into expressive speech designed for responsive, human-feeling experiences.",
    href: "/products/text-to-speech",
    color: "#6542e8",
    soft: "#f1edff",
  },
  {
    icon: Bot,
    label: "LLM assistance",
    title: "Bring context to every answer.",
    text: "Build language experiences that can understand requests, work with context, and support real workflows.",
    href: "/products/llm",
    color: "#c02678",
    soft: "#fff0f7",
  },
] as const;

const principles = [
  {
    icon: Languages,
    index: "01",
    title: "Language should widen access",
    text: "People should be able to use technology in the language and interaction style that feels natural to them.",
  },
  {
    icon: Braces,
    index: "02",
    title: "Powerful should still be practical",
    text: "Clear APIs, transparent usage, and production-minded tools matter as much as model capability.",
  },
  {
    icon: AudioLines,
    index: "03",
    title: "Trust is a product decision",
    text: "Responsible voice use, privacy-aware design, and honest product communication belong in the experience from day one.",
  },
] as const;

export function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#f7f8fc]">
      <SiteHeader />

      <section className="relative pt-20 max-[820px]:pt-[68px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_17%_17%,rgba(101,66,232,.18),transparent_31%),radial-gradient(circle_at_90%_22%,rgba(219,39,119,.08),transparent_25%)]" />
        <div className={cx(container, "relative grid min-h-[610px] grid-cols-[1.02fr_.98fr] items-center gap-16 py-[80px] max-[900px]:grid-cols-1 max-[900px]:gap-10 max-[820px]:min-h-0 max-[820px]:py-[58px]")}> 
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(101,66,232,.24)] bg-white/75 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#6542e8] shadow-[0_6px_24px_rgba(61,45,128,.06)]">
              <Sparkles size={14} aria-hidden="true" /> About ebma AI
            </div>
            <h1 className="mt-6 max-w-[700px] font-heading text-[clamp(46px,6.2vw,78px)] font-semibold leading-[.98] tracking-[-0.062em] text-[#121528]">
              Intelligence that
              <span className="bg-[linear-gradient(100deg,#6542e8,#a75fda_75%)] bg-clip-text text-transparent"> speaks human.</span>
            </h1>
            <p className="mt-7 max-w-[650px] text-[17px] leading-[1.78] text-[#5c6478]">
              ebma AI builds the voice and language layer for modern products—so teams can listen, speak, understand, and respond with technology that feels useful in the real world.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={portalSignupUrl} large>
                Start building <ArrowRight size={17} aria-hidden="true" />
              </Button>
              <Button href="/contact?topic=general" variant="outline" large>
                Talk to us
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[480px]">
            <div className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(101,66,232,.16),transparent_68%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-[30px] border border-[#d9d2ef] bg-[#17152c] p-8 text-white shadow-[0_34px_90px_rgba(47,34,104,.25)] max-[560px]:p-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#c8bcf8]">One intelligence layer</span>
                <span className="size-2 rounded-full bg-[#52d6a3] shadow-[0_0_0_5px_rgba(82,214,163,.12)]" />
              </div>
              <div className="my-9 flex h-[120px] items-center justify-center gap-1.5" aria-hidden="true">
                {[22, 44, 72, 50, 92, 62, 35, 78, 106, 67, 46, 89, 58, 29, 69, 41, 24].map((height, index) => (
                  <span
                    key={`${height}-${index}`}
                    className="w-2 rounded-full bg-[linear-gradient(180deg,#b7a5ff,#6f4feb)]"
                    style={{ height }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["Listen", "Speak", "Understand"].map((item, index) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-white/[.06] px-3 py-3 text-center">
                    <p className="font-mono text-[9px] text-[#9c91bf]">0{index + 1}</p>
                    <p className="mt-1 text-[11px] font-bold text-[#f3efff]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e0dbea] bg-white">
        <div className={cx(container, "py-[86px] max-[820px]:py-[60px]")}> 
          <div className="max-w-[690px]">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#6542e8]">What we are building</p>
            <h2 className="mt-4 font-heading text-[clamp(34px,4.8vw,54px)] font-semibold leading-[1.08] tracking-[-0.05em] text-[#15172b]">
              From raw language to useful action.
            </h2>
            <p className="mt-5 text-[15px] leading-[1.75] text-[#687086]">
              A connected platform for developers and businesses that need speech and language capabilities without stitching together a fragmented workflow.
            </p>
          </div>
          <div className="mt-11 grid grid-cols-3 gap-4 max-[850px]:grid-cols-1">
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <a key={item.label} href={item.href} className="group rounded-[22px] border border-[#e1ddeb] bg-[#fbfbfd] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#cfc5ed] hover:shadow-[0_18px_45px_rgba(41,34,79,.09)]">
                  <span className="grid size-11 place-items-center rounded-[13px]" style={{ background: item.soft, color: item.color }}>
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.13em]" style={{ color: item.color }}>{item.label}</p>
                  <h3 className="mt-2 font-heading text-[21px] font-semibold leading-[1.2] tracking-[-0.03em] text-[#17192d]">{item.title}</h3>
                  <p className="mt-3 text-[13px] leading-[1.7] text-[#71798e]">{item.text}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-bold text-[#514176]">Explore product <ArrowRight size={14} className="transition group-hover:translate-x-1" aria-hidden="true" /></span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className={cx(container, "grid grid-cols-[.75fr_1.25fr] gap-20 py-[92px] max-[900px]:grid-cols-1 max-[900px]:gap-10 max-[820px]:py-[62px]")}> 
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#6542e8]">How we think</p>
          <h2 className="mt-4 font-heading text-[clamp(34px,4vw,49px)] font-semibold leading-[1.08] tracking-[-0.05em] text-[#15172b]">Built with a point of view.</h2>
          <p className="mt-5 text-[14px] leading-[1.75] text-[#6b7389]">Our choices are guided by the people using the product, the builders integrating it, and the responsibility that comes with AI-powered voice.</p>
        </div>
        <div className="grid gap-3">
          {principles.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.index} className="grid grid-cols-[48px_1fr_auto] items-center gap-5 rounded-[20px] border border-[#dfdaeb] bg-white p-5 max-[560px]:grid-cols-[42px_1fr]">
                <span className="grid size-12 place-items-center rounded-[14px] bg-[#f1edff] text-[#6542e8] max-[560px]:size-10"><Icon size={20} aria-hidden="true" /></span>
                <div>
                  <h3 className="font-heading text-[18px] font-semibold tracking-[-0.025em] text-[#17192d]">{item.title}</h3>
                  <p className="mt-1.5 text-[12px] leading-[1.65] text-[#747c90]">{item.text}</p>
                </div>
                <span className="font-mono text-[11px] text-[#aaa3bb] max-[560px]:hidden">{item.index}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-[#17152c] text-white">
        <div className={cx(container, "flex items-center justify-between gap-12 py-[72px] max-[740px]:flex-col max-[740px]:items-start")}> 
          <div className="max-w-[680px]">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#b7a5ff]">Build what comes next</p>
            <h2 className="mt-3 font-heading text-[clamp(30px,4vw,48px)] font-semibold tracking-[-0.045em]">Your product already has something to say.</h2>
            <p className="mt-4 text-[14px] leading-[1.7] text-[#bdb8d2]">Give it the voice, understanding, and language layer to say it well.</p>
          </div>
          <Button href={portalSignupUrl} variant="light" large>Start building <ArrowRight size={17} aria-hidden="true" /></Button>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
