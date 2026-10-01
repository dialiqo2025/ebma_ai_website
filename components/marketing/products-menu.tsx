"use client";

import { Bot, ChevronDown, Mic2, Volume2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { cx } from "@/lib/cn";
import {
  productLlmPath,
  productSttPath,
  productTtsPath,
} from "@/lib/site";

const productItems = [
  {
    href: productSttPath,
    label: "Speech to text",
    description: "Live & file transcription with speakers",
    icon: Mic2,
    accent: "text-[#38bdf8] bg-[rgba(56,189,248,.12)] border-[rgba(56,189,248,.25)]",
  },
  {
    href: productTtsPath,
    label: "Text to speech",
    description: "Natural voices, playback, and clone",
    icon: Volume2,
    accent: "text-[#9b5cf6] bg-[rgba(155,92,246,.12)] border-[rgba(155,92,246,.25)]",
  },
  {
    href: productLlmPath,
    label: "LLM Studio",
    description: "Context-aware language intelligence",
    icon: Bot,
    accent: "text-[#ef76ca] bg-[rgba(239,118,202,.12)] border-[rgba(239,118,202,.25)]",
  },
] as const;

export function ProductsMenu({
  onNavigate,
  mobile = false,
}: {
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const clearCloseTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  useEffect(
    () => () => {
      clearCloseTimer();
    },
    [],
  );

  if (mobile) {
    return (
      <div className="w-full">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between px-[13px] py-[13px] text-left text-[13px] font-semibold text-[#b0b5d0]"
        >
          Products
          <ChevronDown
            size={15}
            className={cx(
              "transition-transform duration-250 ease-out",
              open && "rotate-180",
            )}
          />
        </button>
        <div
          id={menuId}
          className={cx(
            "grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out",
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="min-h-0">
            <div className="mb-2 space-y-1 px-2 pb-2">
              {productItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-[#d5d8e7] transition-colors hover:bg-[#1a2038]"
                >
                  <span
                    className={cx(
                      "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border",
                      item.accent,
                    )}
                  >
                    <item.icon size={15} />
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold text-white">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[#8b98ae]">
                      {item.description}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => {
        clearCloseTimer();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "inline-flex items-center gap-1.5 border-0 bg-transparent p-0 text-[13px] font-semibold transition-colors duration-200",
          open ? "text-white" : "text-[#b0b5d0] hover:text-white",
        )}
      >
        Products
        <ChevronDown
          size={14}
          className={cx(
            "transition-transform duration-250 ease-out",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        id={menuId}
        role="menu"
        className={cx(
          "absolute top-[calc(100%+14px)] left-1/2 z-30 w-[340px] -translate-x-1/2 origin-top",
          "transition-[opacity,transform] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1.5 scale-[0.98] opacity-0",
        )}
      >
        <div className="overflow-hidden rounded-2xl border border-[#2a3358] bg-[rgba(13,16,32,.97)] p-2 shadow-[0_24px_60px_rgba(0,0,0,.55)] backdrop-blur-xl">
          {productItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className={cx(
                "flex items-start gap-3 rounded-xl px-3 py-3 text-[#d5d8e7] transition-colors duration-200 hover:bg-[#1a2038]",
                open && "animate-[fade-up_.35s_ease_both]",
              )}
              style={{ animationDelay: open ? `${index * 40}ms` : undefined }}
            >
              <span
                className={cx(
                  "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border",
                  item.accent,
                )}
              >
                <item.icon size={16} />
              </span>
              <span>
                <span className="block text-[13px] font-semibold text-white">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-[12px] leading-snug text-[#8b98ae]">
                  {item.description}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
