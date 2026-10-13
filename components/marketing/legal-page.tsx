import { ArrowRight, Check, FileText, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { container, cx } from "@/lib/cn";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
  security?: boolean;
};

export function LegalPage({
  eyebrow,
  title,
  description,
  updated,
  sections,
  security = false,
}: LegalPageProps) {
  const HeroIcon = security ? ShieldCheck : FileText;

  return (
    <main className="overflow-x-clip bg-[#f7f8fc]">
      <SiteHeader />

      <section className="relative border-b border-[#ddd6f5] pt-20 max-[820px]:pt-[68px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_20%,rgba(101,66,232,.15),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(167,95,218,.09),transparent_27%)]" />
        <div className={cx(container, "relative py-[76px] max-[820px]:py-[56px]")}> 
          <div className="flex max-w-[820px] items-start gap-5 max-[560px]:gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-[18px] border border-[#d8d2ee] bg-white text-[#6542e8] shadow-[0_10px_30px_rgba(53,41,112,.09)] max-[560px]:size-12">
              <HeroIcon size={25} aria-hidden="true" />
            </span>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#6542e8]">
                {eyebrow}
              </p>
              <h1 className="mt-3 font-heading text-[clamp(42px,6vw,70px)] font-semibold leading-[1.02] tracking-[-0.055em] text-[#121528]">
                {title}
              </h1>
              <p className="mt-5 max-w-[720px] text-[16px] leading-[1.75] text-[#5c6478]">
                {description}
              </p>
              <p className="mt-5 text-[12px] font-semibold text-[#7a8299]">
                Last updated: {updated}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={cx(container, "grid grid-cols-[250px_1fr] items-start gap-16 py-[72px] max-[900px]:grid-cols-1 max-[900px]:gap-10 max-[820px]:py-[52px]")}> 
        <aside className="sticky top-[112px] rounded-[18px] border border-[#e0dbea] bg-white p-5 shadow-[0_8px_30px_rgba(18,21,40,.045)] max-[900px]:static">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#8a82a0]">
            On this page
          </p>
          <nav aria-label={`${title} sections`} className="mt-4 grid gap-1">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="group flex items-start gap-2.5 rounded-lg px-2 py-2 text-[12px] font-semibold leading-[1.4] text-[#626a7f] transition hover:bg-[#f5f2ff] hover:text-[#6542e8]"
              >
                <span className="mt-px font-mono text-[10px] text-[#aaa3bb] group-hover:text-[#8a6cf1]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <article className="min-w-0 max-w-[780px]">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className={cx(
                "scroll-mt-28",
                index > 0 && "mt-12 border-t border-[#e1ddeb] pt-12",
              )}
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[11px] font-bold text-[#9b8fc1]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="font-heading text-[26px] font-semibold tracking-[-0.035em] text-[#16182c]">
                  {section.title}
                </h2>
              </div>
              <div className="ml-[38px] mt-5 max-[620px]:ml-0">
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-4 first:mt-0 text-[14px] leading-[1.85] text-[#626a7f]">
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-5 grid gap-3">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 text-[14px] leading-[1.75] text-[#626a7f]">
                        <span className="mt-1.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#eeeaff] text-[#6542e8]">
                          <Check size={10} strokeWidth={3} aria-hidden="true" />
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}

          <div className="mt-14 rounded-[22px] border border-[#d9d2ef] bg-[linear-gradient(135deg,#f0ecff,#faf9ff)] p-7 max-[560px]:p-5">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#6542e8]">
              Questions or requests
            </p>
            <h2 className="mt-2 font-heading text-[25px] font-semibold tracking-[-0.035em] text-[#15172b]">
              Talk to the ebma AI team.
            </h2>
            <p className="mt-3 max-w-[570px] text-[13px] leading-[1.7] text-[#687086]">
              Use our contact form for privacy requests, legal questions, security concerns, or general support. Your message will be routed to the configured contact address.
            </p>
            <Button href="/contact?topic=general" className="mt-5">
              Contact us <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>
        </article>
      </section>

      <SiteFooter />
    </main>
  );
}
