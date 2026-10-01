"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand } from "@/components/brand";
import { ProductsMenu } from "@/components/marketing/products-menu";
import { Button } from "@/components/ui/button";
import { container, cx } from "@/lib/cn";
import { portalLoginUrl, portalSignupUrl } from "@/lib/site";

const links = [
  { label: "Pricing", href: "/pricing" },
  { label: "Developers", href: "/#developers" },
  { label: "Enterprise", href: "/#enterprise" },
  { label: "Contact us", href: "/#contact" },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-20 border-b border-white/[0.06] bg-[rgba(7,9,20,.88)] backdrop-blur-[14px] max-[820px]:h-[68px]">
      <div className={cx(container, "relative flex h-full items-center justify-between")}>
        <Brand />

        <div className="ml-auto mr-9 flex items-center gap-8 max-[1050px]:mr-[18px] max-[1050px]:gap-[19px] max-[820px]:hidden">
          <ProductsMenu />
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] font-semibold text-[#b0b5d0] transition-colors duration-200 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-[13px] max-[820px]:hidden">
          <a
            href={portalLoginUrl}
            className="px-2.5 py-2.5 text-[13px] font-[650] text-[#c8cbdd] transition-colors hover:text-white"
          >
            Log in
          </a>
          <Button variant="primary" href={portalSignupUrl}>
            Start building <ArrowRight size={16} />
          </Button>
        </div>

        <button
          type="button"
          className="hidden max-[820px]:absolute max-[820px]:right-0 max-[820px]:grid max-[820px]:h-[39px] max-[820px]:w-[39px] max-[820px]:place-items-center max-[820px]:rounded-[10px] max-[820px]:border max-[820px]:border-border max-[820px]:bg-surface max-[820px]:text-[#d5d8e9]"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <div
          className={cx(
            "absolute left-0 right-0 top-[75px] z-30 origin-top rounded-[14px] border border-border bg-[rgba(13,16,32,.98)] p-3 shadow-[0_20px_50px_#03040b]",
            "transition-[opacity,transform] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "hidden max-[820px]:block",
            menuOpen
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0",
          )}
        >
          <ProductsMenu mobile onNavigate={() => setMenuOpen(false)} />
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block px-[13px] py-[13px] text-[13px] font-semibold text-[#b0b5d0] transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 grid grid-cols-[1fr_1.3fr] gap-2">
            <Button variant="ghost" href={portalLoginUrl}>
              Log in
            </Button>
            <Button variant="primary" href={portalSignupUrl}>
              Start building <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-10 hidden border-0 bg-[rgba(2,3,9,.45)] max-[820px]:block"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
}
