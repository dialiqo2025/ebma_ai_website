import { ArrowRight, Bell, Code2, HeartHandshake, Sparkles, UsersRound } from "lucide-react";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { container, cx } from "@/lib/cn";

const values = [
  { icon: Code2, title: "Build for real use", text: "We care about turning capable technology into reliable, understandable products." },
  { icon: UsersRound, title: "Stay close to people", text: "The best language experiences start with how people actually speak, listen, and work." },
  { icon: HeartHandshake, title: "Earn trust", text: "We value careful decisions, honest communication, and responsible use of AI." },
] as const;

export function CareersPage() {
  return (
    <main className="overflow-hidden bg-[#f7f8fc]">
      <SiteHeader />

      <section className="relative pt-20 max-[820px]:pt-[68px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_6%,rgba(101,66,232,.18),transparent_37%),radial-gradient(circle_at_85%_60%,rgba(167,95,218,.08),transparent_25%)]" />
        <div className={cx(container, "relative py-[88px] text-center max-[820px]:py-[62px]")}> 
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[rgba(101,66,232,.25)] bg-white/80 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#6542e8]">
            <Sparkles size={14} aria-hidden="true" /> Careers at ebma AI
          </div>
          <h1 className="mx-auto mt-6 max-w-[850px] font-heading text-[clamp(46px,7vw,78px)] font-semibold leading-[1] tracking-[-0.06em] text-[#121528]">
            Help technology understand
            <span className="bg-[linear-gradient(100deg,#6542e8,#a75fda_75%)] bg-clip-text text-transparent"> everyone.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[650px] text-[16px] leading-[1.75] text-[#626a7f]">
            We&apos;re building practical voice and language intelligence for products people use every day.
          </p>

          <div className="mx-auto mt-12 max-w-[760px] overflow-hidden rounded-[26px] border border-[#d8d1ef] bg-white text-left shadow-[0_28px_80px_rgba(53,41,112,.13)]">
            <div className="h-1.5 bg-[linear-gradient(90deg,#6542e8,#b071ee,#db77b0)]" />
            <div className="grid grid-cols-[72px_1fr] gap-6 p-8 max-[560px]:grid-cols-1 max-[560px]:p-6">
              <span className="grid size-[72px] place-items-center rounded-[20px] bg-[#f0ecff] text-[#6542e8]">
                <Bell size={29} aria-hidden="true" />
              </span>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8a70df]">Open positions</p>
                <h2 className="mt-2 font-heading text-[28px] font-semibold tracking-[-0.04em] text-[#15172b]">No roles are open right now.</h2>
                <p className="mt-3 text-[13px] leading-[1.75] text-[#70788c]">
                  We do not currently have any active job openings. As the team grows, new opportunities will be published on this page—please check back later.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href="/">Explore ebma AI</Button>
                  <Button href="/contact?topic=general" variant="outline">Contact us <ArrowRight size={15} aria-hidden="true" /></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e1ddeb] bg-white">
        <div className={cx(container, "py-[78px] max-[820px]:py-[58px]")}> 
          <div className="mx-auto max-w-[720px] text-center">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#6542e8]">What matters here</p>
            <h2 className="mt-3 font-heading text-[clamp(32px,4.5vw,48px)] font-semibold tracking-[-0.045em] text-[#15172b]">The values behind the work.</h2>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4 max-[800px]:grid-cols-1">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[20px] border border-[#e1ddeb] bg-[#fafafd] p-6">
                  <span className="grid size-11 place-items-center rounded-[13px] bg-[#f0ecff] text-[#6542e8]"><Icon size={20} aria-hidden="true" /></span>
                  <h3 className="mt-5 font-heading text-[20px] font-semibold tracking-[-0.03em] text-[#17192d]">{item.title}</h3>
                  <p className="mt-2 text-[13px] leading-[1.7] text-[#747c90]">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
