import Link from "next/link";
import { Brand } from "@/components/brand";
import { container, cx } from "@/lib/cn";
import { portalPlatformUrl } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-[#e8ecf4]">
      <div
        className={cx(
          container,
          "flex justify-between py-[75px] pb-[65px] max-[820px]:gap-[50px] max-[560px]:block max-[560px]:py-[55px]",
        )}
      >
        <div>
          <Brand />
          <p className="my-[22px] mb-8 text-xs leading-[1.7] text-[#6b7389]">
            Voice and language intelligence
            <br />
            for every product and person.
          </p>
          <span className="text-[12px] uppercase tracking-[0.1em] text-[#8a92a8]">
            Made with purpose in India.
          </span>
        </div>
        <div className="flex gap-20 max-[1050px]:gap-[45px] max-[820px]:gap-[30px] max-[560px]:mt-[45px] max-[560px]:grid max-[560px]:grid-cols-2 max-[560px]:gap-[35px]">
          <div className="flex flex-col gap-[13px]">
            <strong className="mb-[5px] text-[12px] uppercase tracking-[0.1em] text-[#5c6478]">
              Products
            </strong>
            <Link href="/products/speech-to-text" className="text-[12px] text-[#6b7389] hover:text-[#121528]">
              Speech to text
            </Link>
            <Link href="/products/text-to-speech" className="text-[12px] text-[#6b7389] hover:text-[#121528]">
              Text to speech
            </Link>
            <Link href="/products/llm" className="text-[12px] text-[#6b7389] hover:text-[#121528]">
              LLM Studio
            </Link>
          </div>
          <div className="flex flex-col gap-[13px]">
            <strong className="mb-[5px] text-[12px] uppercase tracking-[0.1em] text-[#5c6478]">
              Developers
            </strong>
            <Link href="/pricing" className="text-[12px] text-[#6b7389] hover:text-[#121528]">
              Pricing
            </Link>
            <Link href="/#developers" className="text-[12px] text-[#6b7389] hover:text-[#121528]">
              Documentation
            </Link>
            <a href={portalPlatformUrl} className="text-[12px] text-[#6b7389] hover:text-[#121528]">
              Playground
            </a>
          </div>
          <div className="flex flex-col gap-[13px]">
            <strong className="mb-[5px] text-[12px] uppercase tracking-[0.1em] text-[#5c6478]">
              Company
            </strong>
            <Link href="/#contact" className="text-[12px] text-[#6b7389] hover:text-[#121528]">
              Contact
            </Link>
            <Link href="/#contact" className="text-[12px] text-[#6b7389] hover:text-[#121528]">
              About
            </Link>
            <Link href="/#contact" className="text-[12px] text-[#6b7389] hover:text-[#121528]">
              Careers
            </Link>
          </div>
        </div>
      </div>
      <div
        className={cx(
          container,
          "flex h-[66px] items-center justify-between border-t border-[#d5dbea] text-[12px] text-[#8a92a8] max-[560px]:h-[85px] max-[560px]:flex-col max-[560px]:justify-center max-[560px]:gap-2.5",
        )}
      >
        <span>© {new Date().getFullYear()} ebma AI. All rights reserved.</span>
        <div className="flex gap-5">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Security</a>
        </div>
      </div>
    </footer>
  );
}
