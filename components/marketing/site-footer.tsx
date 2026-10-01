import Link from "next/link";
import { Brand } from "@/components/brand";
import { container, cx } from "@/lib/cn";
import { portalPlatformUrl } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-[#070912]">
      <div
        className={cx(
          container,
          "flex justify-between py-[75px] pb-[65px] max-[820px]:gap-[50px] max-[560px]:block max-[560px]:py-[55px]",
        )}
      >
        <div>
          <Brand />
          <p className="my-[22px] mb-8 text-xs leading-[1.7] text-[#6f7696]">
            Voice and language intelligence
            <br />
            for every product and person.
          </p>
          <span className="text-[12px] uppercase tracking-[0.1em] text-[#464d6b]">
            Made with purpose in India.
          </span>
        </div>
        <div className="flex gap-20 max-[1050px]:gap-[45px] max-[820px]:gap-[30px] max-[560px]:mt-[45px] max-[560px]:grid max-[560px]:grid-cols-2 max-[560px]:gap-[35px]">
          <div className="flex flex-col gap-[13px]">
            <strong className="mb-[5px] text-[12px] uppercase tracking-[0.1em] text-[#9097b7]">
              Products
            </strong>
            <Link href="/products/speech-to-text" className="text-[12px] text-[#666e8f] hover:text-white">
              Speech to text
            </Link>
            <Link href="/products/text-to-speech" className="text-[12px] text-[#666e8f] hover:text-white">
              Text to speech
            </Link>
            <Link href="/products/llm" className="text-[12px] text-[#666e8f] hover:text-white">
              LLM Studio
            </Link>
          </div>
          <div className="flex flex-col gap-[13px]">
            <strong className="mb-[5px] text-[12px] uppercase tracking-[0.1em] text-[#9097b7]">
              Developers
            </strong>
            <Link href="/pricing" className="text-[12px] text-[#666e8f] hover:text-white">
              Pricing
            </Link>
            <Link href="/#developers" className="text-[12px] text-[#666e8f] hover:text-white">
              Documentation
            </Link>
            <a href={portalPlatformUrl} className="text-[12px] text-[#666e8f] hover:text-white">
              Playground
            </a>
          </div>
          <div className="flex flex-col gap-[13px]">
            <strong className="mb-[5px] text-[12px] uppercase tracking-[0.1em] text-[#9097b7]">
              Company
            </strong>
            <Link href="/#contact" className="text-[12px] text-[#666e8f] hover:text-white">
              Contact
            </Link>
            <Link href="/#contact" className="text-[12px] text-[#666e8f] hover:text-white">
              About
            </Link>
            <Link href="/#contact" className="text-[12px] text-[#666e8f] hover:text-white">
              Careers
            </Link>
          </div>
        </div>
      </div>
      <div
        className={cx(
          container,
          "flex h-[66px] items-center justify-between border-t border-[#191d32] text-[12px] text-[#444b68] max-[560px]:h-[85px] max-[560px]:flex-col max-[560px]:justify-center max-[560px]:gap-2.5",
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
