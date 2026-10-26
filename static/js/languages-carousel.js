(function () {
  const HEX_DIRS = [
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
  ];
  const ACCENTS = [
    "from-[#6542e8] to-[#8b7cf0]",
    "from-[#4d32c8] to-[#6d5ae0]",
    "from-[#765ce4] to-[#a78bfa]",
    "from-[#5b45d6] to-[#7c6aef]",
  ];
  const HEX_PACK = 0.96;

  function hexSpiral(count) {
    const coords = [{ q: 0, r: 0 }];
    if (count <= 1) return coords.slice(0, count);
    for (let ring = 1; coords.length < count; ring += 1) {
      const [startDq, startDr] = HEX_DIRS[4];
      let q = startDq * ring;
      let r = startDr * ring;
      for (let side = 0; side < 6; side += 1) {
        const [dq, dr] = HEX_DIRS[side];
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

  function flatHexToPixel(q, r, size) {
    return {
      x: size * ((3 / 2) * q),
      y: size * ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r),
    };
  }

  function shortLanguageLabel(name) {
    const base = name.replace(/\s*\([^)]*\)\s*/g, "").trim();
    if (base.length <= 10) return base;
    const first = base.split(/\s+/)[0] || base;
    if (first.length <= 10) return first;
    return `${base.slice(0, 8)}…`;
  }

  function centerFeaturedLanguage(list) {
    const preferred = ["hi", "en"];
    const featured = preferred
      .map((code) => list.find((l) => l.code === code))
      .filter(Boolean);
    if (!featured.length) return list;
    const rest = list.filter((l) => !preferred.includes(l.code));
    return [...featured, ...rest];
  }

  function getHexSize(compact) {
    const w = window.innerWidth;
    if (compact) {
      if (w < 480) return 28;
      if (w < 820) return 34;
      if (w < 1100) return 36;
      return 40;
    }
    if (w < 480) return 34;
    if (w < 720) return 40;
    if (w < 1024) return 44;
    return 48;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function initCarousel(root) {
    if (!root || root.dataset.ebmaLangBound === "1") return;
    root.dataset.ebmaLangBound = "1";

    const variant = root.getAttribute("data-variant") || "section";
    const isHero = variant === "hero";
    const langData = window.EBMA_LANGUAGES || {};
    const api = window.EBMA_API || {};
    const cfg = window.EBMA_CONFIG || {};

    let languages = centerFeaturedLanguage(
      (langData.supportedLanguages || []).slice(),
    );
    let activeCode = languages.some((l) => l.code === "hi")
      ? "hi"
      : languages[0]?.code || "hi";
    let hovering = false;
    let reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hexSize = getHexSize(isHero);
    const focusRef = { x: 0, y: 0 };
    const targetFocusRef = { x: 0, y: 0 };
    let autoAngle = 0;
    let raf = 0;
    let lastPaint = 0;
    const idPrefix = isHero ? "hero-lang-hex" : "lang-hex";
    let stageEl = null;
    let cellsEl = null;
    let cellButtons = [];
    let activeInitialEl = null;
    let activeNameEl = null;
    let activeCtaEl = null;
    let countEl = null;
    let layoutKey = "";

    root.innerHTML = "";
    const wrap = document.createElement("div");
    if (isHero) {
      wrap.className = "relative z-[2] w-full bg-transparent";
      wrap.setAttribute("aria-label", "Supported languages");
      wrap.innerHTML = `<div class="relative bg-transparent" data-honeycomb></div>`;
    } else {
      wrap.className =
        "relative overflow-hidden border-y border-[#e4dff5] bg-[radial-gradient(ellipse_at_50%_0%,rgba(101,66,232,.10),transparent_55%),linear-gradient(180deg,#f8f7fc,#f3f0ff)] py-16 max-[820px]:py-12";
      wrap.setAttribute("aria-label", "Supported languages");
      wrap.innerHTML = `
        <div class="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-[#b7a5ff]/30 blur-3xl" aria-hidden="true"></div>
        <div class="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-[#6542e8]/15 blur-3xl" aria-hidden="true"></div>
        <div class="mx-auto w-[min(1180px,calc(100%-48px))] max-[820px]:w-[calc(100%-32px)] relative mb-8 flex flex-col items-center text-center max-[820px]:mb-6">
          <div class="inline-flex items-center gap-2 rounded-full border border-[#ddd6f5] bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6542e8] shadow-[0_6px_18px_rgba(29,27,46,.04)] backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
            Languages
          </div>
          <h2 class="mt-4 font-heading text-[clamp(26px,3.2vw,36px)] font-[580] tracking-[-0.04em] text-[#121528]">Speaks the languages your users speak</h2>
          <p class="mt-2.5 max-w-[460px] text-[14px] leading-relaxed text-[#7a738f]">Hover the honeycomb like a watch menu and see each language come alive.</p>
          <div class="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1d1b2e] px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(29,27,46,.18)]" data-lang-count>
            <span class="h-1.5 w-1.5 rounded-full bg-[#b7a5ff]"></span>
            ${languages.length} languages supported
          </div>
        </div>
        <div class="mx-auto w-[min(1180px,calc(100%-48px))] max-[820px]:w-[calc(100%-32px)] relative" data-honeycomb></div>
      `;
    }
    root.appendChild(wrap);
    const honeycombHost = wrap.querySelector("[data-honeycomb]");
    countEl = wrap.querySelector("[data-lang-count]");

    function buildCells() {
      const packSize = hexSize * HEX_PACK;
      const coords = hexSpiral(languages.length);
      return languages.map((lang, index) => {
        const { q, r } = coords[index];
        const { x, y } = flatHexToPixel(q, r, packSize);
        return { ...lang, q, r, x, y, accent: ACCENTS[index % ACCENTS.length] };
      });
    }

    function getBounds(cells) {
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
    }

    function nearestCode(cells, bounds, focusX, focusY) {
      if (!cells.length) return activeCode;
      let best = cells[0].code;
      let bestDist = Infinity;
      for (const cell of cells) {
        const d = Math.hypot(cell.x - bounds.cx - focusX, cell.y - bounds.cy - focusY);
        if (d < bestDist) {
          bestDist = d;
          best = cell.code;
        }
      }
      return best;
    }

    function ensureStructure() {
      const cells = buildCells();
      const bounds = getBounds(cells);
      const key = `${languages.length}:${hexSize}:${isHero}`;
      if (key === layoutKey && stageEl && cellsEl) return { cells, bounds };
      layoutKey = key;

      const cellWidth = hexSize * 1.82;
      const cellHeight = hexSize * 1.7;
      const stageHeight = isHero
        ? Math.max(240, Math.min(bounds.height + 32, 400))
        : Math.max(280, Math.min(bounds.height + 48, 480));

      honeycombHost.innerHTML = `
        <div data-stage class="relative mx-auto select-none bg-transparent" style="width:${isHero ? "100%" : "min(100%, 720px)"};height:${stageHeight}px" role="listbox" aria-label="Language honeycomb">
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style="width:${bounds.width}px;height:${bounds.height}px" data-cells></div>
        </div>
        <div class="mx-auto flex max-w-[520px] flex-col items-center text-center ${isHero ? "pt-9" : "mt-7"}" data-active-panel>
          <div class="flex items-center gap-3">
            <span data-active-initial class="grid place-items-center rounded-2xl bg-gradient-to-br ${ACCENTS[0]} font-semibold text-white shadow-[0_10px_24px_rgba(77,50,200,.2)] transition-transform duration-200 ${isHero ? "h-10 w-10 text-[16px]" : "h-12 w-12 text-[18px]"}" aria-hidden="true"></span>
            <div class="text-left">
              <p data-active-name class="m-0 text-[15px] font-semibold tracking-[-0.02em] text-[#17152a] transition-colors duration-200"></p>
            </div>
          </div>
          ${
            isHero
              ? `<p class="m-0 mt-3 text-[12px] font-medium text-[#7a8299]">30+ languages supported</p>`
              : `<a data-active-cta href="${cfg.portalSttUrl || "#"}" target="_blank" rel="noopener noreferrer" class="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1d1b2e] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#2a2740]"></a>`
          }
        </div>
      `;

      stageEl = honeycombHost.querySelector("[data-stage]");
      cellsEl = honeycombHost.querySelector("[data-cells]");
      activeInitialEl = honeycombHost.querySelector("[data-active-initial]");
      activeNameEl = honeycombHost.querySelector("[data-active-name]");
      activeCtaEl = honeycombHost.querySelector("[data-active-cta]");
      cellButtons = [];

      cells.forEach((cell) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.id = `${idPrefix}-${cell.code}`;
        btn.dataset.code = cell.code;
        btn.setAttribute("role", "option");
        btn.setAttribute("aria-label", cell.name);
        btn.title = cell.name;
        btn.className =
          "languages-hex absolute flex flex-col items-center justify-center outline-none";
        btn.style.width = `${cellWidth}px`;
        btn.style.height = `${cellHeight}px`;
        btn.style.left = `${cell.x - bounds.cx + bounds.width / 2 - cellWidth / 2}px`;
        btn.style.top = `${cell.y - bounds.cy + bounds.height / 2 - cellHeight / 2}px`;
        btn.innerHTML = `
          <span data-face class="languages-hex-face relative flex h-full w-full flex-col items-center justify-center gap-0.5 bg-gradient-to-br px-2 transition-[background,box-shadow,color] duration-200 ${cell.accent} text-white shadow-[0_10px_22px_rgba(77,50,200,.22)]">
            <span data-shine class="absolute inset-[1px] bg-gradient-to-b from-white/25 to-transparent" aria-hidden="true" style="clip-path:polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)"></span>
            <span class="relative text-[clamp(14px,2.2vw,20px)] font-semibold leading-none drop-shadow-sm">${escapeHtml(cell.initial)}</span>
            <span data-label class="relative max-w-[92%] truncate text-center text-[clamp(8px,1.35vw,10px)] font-semibold leading-tight tracking-[-0.01em] text-white/95">${escapeHtml(shortLanguageLabel(cell.name))}</span>
          </span>
        `;
        cellsEl.appendChild(btn);
        cellButtons.push({ btn, cell, face: btn.querySelector("[data-face]"), label: btn.querySelector("[data-label]"), shine: btn.querySelector("[data-shine]") });
      });

      stageEl.onpointerenter = () => {
        hovering = true;
      };
      stageEl.onpointermove = (event) => {
        const rect = stageEl.getBoundingClientRect();
        targetFocusRef.x = event.clientX - rect.left - rect.width / 2;
        targetFocusRef.y = event.clientY - rect.top - rect.height / 2;
      };
      stageEl.onpointerleave = () => {
        hovering = false;
        targetFocusRef.x = 0;
        targetFocusRef.y = 0;
      };

      if (countEl) {
        countEl.innerHTML = `<span class="h-1.5 w-1.5 rounded-full bg-[#b7a5ff]"></span>${languages.length} languages supported`;
      }

      return { cells, bounds };
    }

    function paint() {
      const { cells, bounds } = ensureStructure();
      const nearest = nearestCode(cells, bounds, focusRef.x, focusRef.y);
      if (nearest !== activeCode) activeCode = nearest;

      const active = languages.find((l) => l.code === activeCode) || languages[0];
      if (active) {
        if (activeInitialEl) activeInitialEl.textContent = active.initial;
        if (activeNameEl) activeNameEl.textContent = active.name;
        if (activeCtaEl) {
          activeCtaEl.href = cfg.portalSttUrl || "#";
          activeCtaEl.innerHTML = `Try ${escapeHtml(active.name)} in Speech to Text <span aria-hidden="true">→</span>`;
        }
        stageEl?.setAttribute("aria-activedescendant", `${idPrefix}-${active.code}`);
      }

      for (const item of cellButtons) {
        const { btn, cell, face, label, shine } = item;
        const dx = cell.x - bounds.cx - focusRef.x;
        const dy = cell.y - bounds.cy - focusRef.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const raw = reduceMotion ? 0 : Math.max(0, 1 - dist / (hexSize * 3.1));
        const focusBoost = raw * raw * (3 - 2 * raw);
        const isActive = cell.code === activeCode;
        const isHovered = hovering && cell.code === nearest;
        const scale = reduceMotion
          ? isActive
            ? 1.05
            : 1
          : hovering
            ? 0.96 + focusBoost * 0.14 + (isHovered ? 0.05 : 0)
            : 0.98 + (isActive ? 0.04 : 0);
        const opacity = hovering ? (isHovered ? 1 : 0.88) : 1;
        const motionMs = hovering ? 180 : 320;
        const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

        btn.style.transform = `scale(${scale})`;
        btn.style.opacity = String(opacity);
        btn.style.zIndex = String(Math.round(scale * 100) + (isHovered ? 20 : 0));
        btn.style.transition = reduceMotion
          ? "none"
          : `transform ${motionMs}ms ${easing}, opacity ${motionMs}ms ${easing}`;
        btn.setAttribute("aria-selected", isActive ? "true" : "false");

        const faceTone = hovering
          ? isHovered
            ? "from-[#4d32c8] to-[#6542e8] text-white shadow-[0_14px_28px_rgba(77,50,200,.32)]"
            : "from-[#b7a5ff] to-[#d0c4ff] text-[#3d2a9e] shadow-[0_8px_18px_rgba(101,66,232,.14)]"
          : `${cell.accent} text-white shadow-[0_10px_22px_rgba(77,50,200,.22)]`;
        const ring =
          isHovered || (!hovering && isActive)
            ? "ring-2 ring-white/80 ring-offset-2 ring-offset-transparent"
            : "";
        face.className = `languages-hex-face relative flex h-full w-full flex-col items-center justify-center gap-0.5 bg-gradient-to-br px-2 transition-[background,box-shadow,color] duration-200 ${faceTone} ${ring}`;
        label.className = `relative max-w-[92%] truncate text-center text-[clamp(8px,1.35vw,10px)] font-semibold leading-tight tracking-[-0.01em] ${hovering && !isHovered ? "text-[#4d32c8]/90" : "text-white/95"}`;
        shine.className = `absolute inset-[1px] bg-gradient-to-b to-transparent ${hovering && !isHovered ? "from-white/35" : "from-white/25"}`;
      }
    }

    function tick(now) {
      if (reduceMotion) {
        focusRef.x = 0;
        focusRef.y = 0;
        targetFocusRef.x = 0;
        targetFocusRef.y = 0;
      } else if (!hovering) {
        autoAngle += 0.008;
        const radius = hexSize * 2.8;
        targetFocusRef.x = Math.cos(autoAngle) * radius;
        targetFocusRef.y = Math.sin(autoAngle) * radius * 0.85;
      }

      focusRef.x += (targetFocusRef.x - focusRef.x) * 0.2;
      focusRef.y += (targetFocusRef.y - focusRef.y) * 0.2;

      if (now - lastPaint > 32) {
        lastPaint = now;
        paint();
      }
      raf = requestAnimationFrame(tick);
    }

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", () => {
      reduceMotion = mq.matches;
    });
    window.addEventListener("resize", () => {
      hexSize = getHexSize(isHero);
      layoutKey = "";
    });

    if (typeof api.fetchPlaygroundLanguages === "function") {
      api
        .fetchPlaygroundLanguages()
        .then((items) => {
          if (!items || !items.length || !langData.mapApiLanguages) return;
          languages = centerFeaturedLanguage(langData.mapApiLanguages(items));
          if (!languages.some((l) => l.code === activeCode)) {
            activeCode = languages[0]?.code || activeCode;
          }
          layoutKey = "";
        })
        .catch(() => undefined);
    }

    paint();
    raf = requestAnimationFrame(tick);
  }

  function init() {
    document.querySelectorAll("#languages-carousel-root").forEach(initCarousel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
