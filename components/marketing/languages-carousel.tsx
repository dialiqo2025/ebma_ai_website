"use client";

import { Languages } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  mapApiLanguages,
  supportedLanguages,
  type SupportedLanguage,
} from "@/content/languages";
import { container } from "@/lib/cn";
import { fetchPlaygroundLanguages } from "@/lib/playground-api";
import { portalSttUrl } from "@/lib/site";

const HEX_DIRS: Array<[number, number]> = [
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
];

type HexCoord = { q: number; r: number };

function hexSpiral(count: number): HexCoord[] {
  const coords: HexCoord[] = [{ q: 0, r: 0 }];
  if (count <= 1) return coords.slice(0, count);

  // Axial ring walk (redblobgames): start at direction[4] * ring, then step 6 sides.
  for (let ring = 1; coords.length < count; ring += 1) {
    const [startDq, startDr] = HEX_DIRS[4]!;
    let q = startDq * ring;
    let r = startDr * ring;
    for (let side = 0; side < 6; side += 1) {
      const [dq, dr] = HEX_DIRS[side]!;
      for (let step = 0; step < ring; step += 1) {
        coords.push({ q, r });
        if (coords.length >= count) return coords;
        q += dq;
        r += dr;
      }
    }
  }
  return coords;
}

function flatHexToPixel(q: number, r: number, size: number) {
  return {
    x: size * ((3 / 2) * q),
    y: size * ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r),
  };
}

/** Compact English label that fits inside a hex cell. */
function shortLanguageLabel(name: string): string {
  const base = name.replace(/\s*\([^)]*\)\s*/g, "").trim();
  if (base.length <= 10) return base;
  const first = base.split(/\s+/)[0] ?? base;
  if (first.length <= 10) return first;
  return `${base.slice(0, 8)}…`;
}

const ACCENTS = [
  "from-[#6542e8] to-[#8b7cf0]",
  "from-[#4d32c8] to-[#6d5ae0]",
  "from-[#765ce4] to-[#a78bfa]",
  "from-[#5b45d6] to-[#7c6aef]",
] as const;

type HoneyCell = SupportedLanguage & {
  q: number;
  r: number;
  x: number;
  y: number;
  accent: (typeof ACCENTS)[number];
};

/** Put Hindi (then English) at the spiral center for a stronger first impression. */
function centerFeaturedLanguage(list: SupportedLanguage[]): SupportedLanguage[] {
  const preferred = ["hi", "en"];
  const featured = preferred.map((code) => list.find((l) => l.code === code)).filter(Boolean) as SupportedLanguage[];
  if (!featured.length) return list;
  const rest = list.filter((l) => !preferred.includes(l.code));
  return [...featured, ...rest];
}

function useHexSize(compact: boolean) {
  const [size, setSize] = useState(compact ? 38 : 46);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (compact) {
        if (w < 480) setSize(28);
        else if (w < 820) setSize(34);
        else if (w < 1100) setSize(36);
        else setSize(40);
        return;
      }
      if (w < 480) setSize(34);
      else if (w < 720) setSize(40);
      else if (w < 1024) setSize(44);
      else setSize(48);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [compact]);
  return size;
}

/** Center-to-center distance as a fraction of hexSize (lower = tighter pack). */
const HEX_PACK = 0.96;

type LanguagesCarouselProps = {
  /** Full marketing section, or compact embed for the hero column */
  variant?: "section" | "hero";
};

export function LanguagesCarousel({ variant = "section" }: LanguagesCarouselProps) {
  const isHero = variant === "hero";
  const [languages, setLanguages] = useState<SupportedLanguage[]>(() =>
    centerFeaturedLanguage(supportedLanguages),
  );
  const [activeCode, setActiveCode] = useState<string>("hi");
  const [focus, setFocus] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef({ x: 0, y: 0 });
  const targetFocusRef = useRef({ x: 0, y: 0 });
  const hexSize = useHexSize(isHero);
  const idPrefix = isHero ? "hero-lang-hex" : "lang-hex";

  useEffect(() => {
    let cancelled = false;
    void fetchPlaygroundLanguages()
      .then((items) => {
        if (cancelled || !items.length) return;
        const mapped = centerFeaturedLanguage(mapApiLanguages(items));
        setLanguages(mapped);
        setActiveCode((prev) =>
          mapped.some((l) => l.code === prev) ? prev : (mapped[0]?.code ?? prev),
        );
      })
      .catch(() => {
        // Keep fallback catalog if the public languages API is unreachable.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const packSize = hexSize * HEX_PACK;

  const cells = useMemo<HoneyCell[]>(() => {
    const coords = hexSpiral(languages.length);
    return languages.map((lang, index) => {
      const { q, r } = coords[index]!;
      const { x, y } = flatHexToPixel(q, r, packSize);
      return {
        ...lang,
        q,
        r,
        x,
        y,
        accent: ACCENTS[index % ACCENTS.length]!,
      };
    });
  }, [languages, packSize]);

  const bounds = useMemo(() => {
    if (!cells.length) return { width: 320, height: 280, cx: 0, cy: 0 };
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const cell of cells) {
      minX = Math.min(minX, cell.x);
      maxX = Math.max(maxX, cell.x);
      minY = Math.min(minY, cell.y);
      maxY = Math.max(maxY, cell.y);
    }
    const pad = hexSize * 1.15;
    return {
      width: maxX - minX + pad * 2,
      height: maxY - minY + pad * 2,
      cx: (minX + maxX) / 2,
      cy: (minY + maxY) / 2,
    };
  }, [cells, hexSize]);

  // Smoothly chase pointer focus (and ease back to center on leave).
  useEffect(() => {
    if (reduceMotion) {
      focusRef.current = { x: 0, y: 0 };
      targetFocusRef.current = { x: 0, y: 0 };
      setFocus({ x: 0, y: 0 });
      return;
    }

    let raf = 0;
    let lastPaint = 0;

    const tick = (now: number) => {
      const cur = focusRef.current;
      const target = targetFocusRef.current;
      const next = {
        x: cur.x + (target.x - cur.x) * 0.2,
        y: cur.y + (target.y - cur.y) * 0.2,
      };
      focusRef.current = next;

      if (now - lastPaint > 32) {
        lastPaint = now;
        setFocus(next);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  const nearestCode = useMemo(() => {
    if (!hovering || !cells.length) return activeCode;
    let best = cells[0]!.code;
    let bestDist = Infinity;
    for (const cell of cells) {
      const d = Math.hypot(cell.x - bounds.cx - focus.x, cell.y - bounds.cy - focus.y);
      if (d < bestDist) {
        bestDist = d;
        best = cell.code;
      }
    }
    return best;
  }, [hovering, cells, bounds.cx, bounds.cy, focus.x, focus.y, activeCode]);

  // Preview language under the pointer (no click required).
  useEffect(() => {
    if (!hovering) return;
    if (nearestCode !== activeCode) setActiveCode(nearestCode);
  }, [hovering, nearestCode, activeCode]);

  const active = useMemo(
    () => languages.find((l) => l.code === activeCode) ?? languages[0] ?? null,
    [languages, activeCode],
  );

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    targetFocusRef.current = {
      x: event.clientX - rect.left - rect.width / 2,
      y: event.clientY - rect.top - rect.height / 2,
    };
  }, []);

  const cellWidth = hexSize * 1.82;
  const cellHeight = hexSize * 1.7;
  const stageHeight = isHero
    ? Math.max(240, Math.min(bounds.height + 32, 400))
    : Math.max(280, Math.min(bounds.height + 48, 480));

  const honeycomb = (
    <>
      <div
        ref={stageRef}
        className={` relative mx-auto select-none overflow-hidden bg-transparent`}
        style={{
          width: isHero ? "100%" : "min(100%, 720px)",
          height: stageHeight,
        }}
        onPointerEnter={() => setHovering(true)}
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          setHovering(false);
          targetFocusRef.current = { x: 0, y: 0 };
        }}
        role="listbox"
        aria-label="Language honeycomb"
        aria-activedescendant={active ? `${idPrefix}-${active.code}` : undefined}
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: bounds.width,
            height: bounds.height,
          }}
        >
          {cells.map((cell) => {
              const dx = cell.x - bounds.cx - focus.x;
              const dy = cell.y - bounds.cy - focus.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const raw = reduceMotion ? 0 : Math.max(0, 1 - dist / (hexSize * 3.1));
              const focusBoost = raw * raw * (3 - 2 * raw);
              const isActive = cell.code === activeCode;
              const isHovered = hovering && cell.code === nearestCode;
              // Milder hover scale
              const scale = reduceMotion
                ? isActive
                  ? 1.05
                  : 1
                : hovering
                  ? 0.96 + focusBoost * 0.14 + (isHovered ? 0.05 : 0)
                  : 0.98 + (isActive ? 0.04 : 0);
              const opacity = hovering ? (isHovered ? 1 : 0.88) : 1;
              const label = shortLanguageLabel(cell.name);
              const motionMs = hovering ? 180 : 320;
              const easing = "cubic-bezier(0.22, 1, 0.36, 1)";
              // Theme: dark = brand-b → brand-a, light = brand-c family
              const faceTone = hovering
                ? isHovered
                  ? "from-[#4d32c8] to-[#6542e8] text-white shadow-[0_14px_28px_rgba(77,50,200,.32)]"
                  : "from-[#b7a5ff] to-[#d0c4ff] text-[#3d2a9e] shadow-[0_8px_18px_rgba(101,66,232,.14)]"
                : `${cell.accent} text-white shadow-[0_10px_22px_rgba(77,50,200,.22)]`;
              const labelTone = hovering && !isHovered ? "text-[#4d32c8]/90" : "text-white/95";

              return (
                <button
                  key={cell.code}
                  id={`${idPrefix}-${cell.code}`}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  aria-label={cell.name}
                  title={cell.name}
                  className="languages-hex absolute flex flex-col items-center justify-center outline-none"
                  style={{
                    width: cellWidth,
                    height: cellHeight,
                    left: cell.x - bounds.cx + bounds.width / 2 - cellWidth / 2,
                    top: cell.y - bounds.cy + bounds.height / 2 - cellHeight / 2,
                    transform: `scale(${scale})`,
                    opacity,
                    zIndex: Math.round(scale * 100) + (isHovered ? 20 : 0),
                    transition: reduceMotion
                      ? "none"
                      : `transform ${motionMs}ms ${easing}, opacity ${motionMs}ms ${easing}`,
                  }}
                >
                  <span
                    className={`languages-hex-face relative flex h-full w-full flex-col items-center justify-center gap-0.5 bg-gradient-to-br px-2 transition-[background,box-shadow,color] duration-200 ${faceTone} ${
                      isHovered || (!hovering && isActive)
                        ? "ring-2 ring-white/80 ring-offset-2 ring-offset-transparent"
                        : ""
                    }`}
                  >
                    <span
                      className={`absolute inset-[1px] bg-gradient-to-b to-transparent ${
                        hovering && !isHovered ? "from-white/35" : "from-white/25"
                      }`}
                      aria-hidden
                      style={{
                        clipPath:
                          "polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)",
                      }}
                    />
                    <span className="relative text-[clamp(14px,2.2vw,20px)] font-semibold leading-none drop-shadow-sm">
                      {cell.initial}
                    </span>
                    <span
                      className={`relative max-w-[92%] truncate text-center text-[clamp(8px,1.35vw,10px)] font-semibold leading-tight tracking-[-0.01em] ${labelTone}`}
                    >
                      {label}
                    </span>
                  </span>
                </button>
              );
          })}
        </div>
      </div>

      {active && (
        <div
          className={`mx-auto flex max-w-[520px] flex-col items-center text-center ${
            isHero ? "mt-4" : "mt-7"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              key={active.code}
              className={`grid place-items-center rounded-2xl bg-gradient-to-br ${ACCENTS[0]} font-semibold text-white shadow-[0_10px_24px_rgba(77,50,200,.2)] transition-transform duration-200 ${
                isHero ? "h-10 w-10 text-[16px]" : "h-12 w-12 text-[18px]"
              }`}
              aria-hidden
            >
              {active.initial}
            </span>
            <div className="text-left">
              <p className="m-0 text-[15px] font-semibold tracking-[-0.02em] text-[#17152a] transition-colors duration-200">
                {active.name}
              </p>
              {/* <p
                className={`m-0 mt-0.5 font-heading font-[560] tracking-[-0.03em] text-[#6542e8] transition-colors duration-200 ${
                  isHero ? "text-[18px]" : "text-[22px]"
                }`}
              >
                {active.sample}
              </p> */}
            </div>
          </div>
          {!isHero && (
            <a
              href={portalSttUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1d1b2e] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#2a2740]"
            >
              Try {active.name} in Speech to Text
              <span aria-hidden>→</span>
            </a>
          )}
          {isHero && (
            <p className="m-0 mt-3 text-[12px] font-medium text-[#7a8299]">
              {languages.length} Indian languages supported
            </p>
          )}
        </div>
      )}
    </>
  );

  if (isHero) {
    return (
      <div className="relative z-[2] w-full bg-transparent" aria-label="Supported languages">
        <div className="relative bg-transparent">{honeycomb}</div>
      </div>
    );
  }

  return (
    <section
      aria-label="Supported languages"
      className="relative overflow-hidden border-y border-[#e4dff5] bg-[radial-gradient(ellipse_at_50%_0%,rgba(101,66,232,.10),transparent_55%),linear-gradient(180deg,#f8f7fc,#f3f0ff)] py-16 max-[820px]:py-12"
    >
      <div
        className="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-[#b7a5ff]/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-[#6542e8]/15 blur-3xl"
        aria-hidden
      />

      <div className={`${container} relative mb-8 flex flex-col items-center text-center max-[820px]:mb-6`}>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#ddd6f5] bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6542e8] shadow-[0_6px_18px_rgba(29,27,46,.04)] backdrop-blur-sm">
          <Languages size={13} strokeWidth={2.25} />
          Languages
        </div>
        <h2 className="mt-4 font-heading text-[clamp(26px,3.2vw,36px)] font-[580] tracking-[-0.04em] text-[#121528]">
          Speaks the languages your users speak
        </h2>
        <p className="mt-2.5 max-w-[460px] text-[14px] leading-relaxed text-[#7a738f]">
          Hover the honeycomb like a watch menu and see each language come alive.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1d1b2e] px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(29,27,46,.18)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#b7a5ff]" />
          {languages.length} languages supported
        </div>
      </div>

      <div className={`${container} relative`}>{honeycomb}</div>
    </section>
  );
}
