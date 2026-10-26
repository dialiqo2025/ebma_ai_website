(function () {
  const accentText = {
    cyan: "text-[#0284c7]",
    violet: "text-[#6542e8]",
    pink: "text-[#db2777]",
  };
  const accentBorder = {
    cyan: "border-[#0284c7]/45 bg-[rgba(2,132,199,.08)]",
    violet: "border-[#6542e8]/45 bg-[rgba(124,58,237,.08)]",
    pink: "border-[#db2777]/45 bg-[rgba(219,39,119,.08)]",
  };

  function cx(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function resolveCta(hrefKey) {
    const cfg = window.EBMA_CONFIG || {};
    if (hrefKey === "stt") return cfg.portalSttUrl || "#";
    if (hrefKey === "tts") return cfg.portalTtsUrl || "#";
    if (hrefKey === "platform") return cfg.portalPlatformUrl || "#";
    return cfg.portalSignupUrl || "#";
  }

  function initCodePanel(root, product) {
    if (!root) return;
    const accentClass = accentText[product.accent] || accentText.violet;
    const code = product.codeSample?.code || "";
    let copied = false;
    let timer = null;

    function render() {
      root.innerHTML = `
        <div class="overflow-hidden rounded-[18px] border border-[#d5dbea] bg-white shadow-[0_20px_50px_rgba(18,21,40,.1)]">
          <div class="flex h-[54px] items-center justify-between border-b border-[#e2e7f2] bg-[#f8fafc] px-[18px] text-[12px] text-[#6b7389]">
            <span class="text-[#121528]">${escapeHtml(product.codeSample?.language || "API")}</span>
            <div class="flex items-center gap-3">
              <span class="${accentClass}">Ready</span>
              <button type="button" data-copy class="inline-flex items-center gap-1.5 rounded-lg border border-[#d5dbea] bg-white px-2.5 py-1.5 text-[12px] text-[#5c6478] transition hover:bg-[#eef1f8] hover:text-[#121528]">
                ${
                  copied
                    ? `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-success"><path d="M20 6 9 17l-5-5"/></svg> Copied`
                    : `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy`
                }
              </button>
            </div>
          </div>
          <pre class="m-0 min-h-[280px] overflow-auto bg-[#f8fafc] p-[24px_26px] font-mono text-[12px] leading-[1.9] text-[#374151] max-[560px]:px-4"><code>${escapeHtml(code)}</code></pre>
        </div>
      `;
      root.querySelector("[data-copy]")?.addEventListener("click", async () => {
        if (!code) return;
        try {
          await navigator.clipboard.writeText(code);
          copied = true;
          render();
          if (timer) window.clearTimeout(timer);
          timer = window.setTimeout(() => {
            copied = false;
            render();
          }, 1600);
        } catch {
          copied = false;
          render();
        }
      });
    }

    render();
  }

  function initInteractiveBody(root, product) {
    if (!root) return;
    const accent = product.accent;
    let featureIndex = 0;
    let useCaseIndex = 0;
    let openFaq = 0;

    function render() {
      const activeFeature = product.features[featureIndex] || product.features[0];
      const activeUseCase = product.useCases[useCaseIndex] || product.useCases[0];

      root.innerHTML = `
        <section class="border-t border-[#d5dbea] bg-bg py-[70px] max-[820px]:py-[72px]">
          <div class="mx-auto w-[min(1180px,calc(100%-48px))] max-[820px]:w-[calc(100%-32px)]">
            <div class="mb-12 max-w-[640px] max-[820px]:mx-auto max-[820px]:text-center">
              <span class="${cx("text-[12px] font-extrabold uppercase tracking-[0.13em]", accentText[accent])}">Capabilities</span>
              <h2 class="mt-3 font-heading text-[clamp(30px,3.5vw,42px)] font-semibold tracking-[-0.035em] text-[#121528]">Built for real products</h2>
              <p class="mt-3 text-[14px] text-[#6b7389]">Click a capability to explore what it unlocks.</p>
            </div>
            <div class="grid grid-cols-[0.95fr_1.05fr] gap-5 max-[820px]:grid-cols-1">
              <div class="grid gap-2" data-features></div>
              <div class="animate-[fade-up_.35s_ease_both] rounded-[18px] border border-[#d5dbea] bg-white p-6 shadow-[0_12px_32px_rgba(18,21,40,.08)]" data-feature-spotlight>
                <p class="${cx("text-[12px] font-extrabold uppercase tracking-[0.12em]", accentText[accent])}">Spotlight</p>
                <h3 class="mt-3 font-heading text-[28px] font-semibold tracking-[-0.03em] text-[#121528] max-[560px]:text-[22px]">${escapeHtml(activeFeature.title)}</h3>
                <p class="mt-3 text-[14px] leading-[1.75] text-[#5c6478]">${escapeHtml(activeFeature.description)}</p>
                <div class="mt-6 grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
                  ${product.capabilities
                    .slice(0, 4)
                    .map(
                      (cap) => `
                    <div class="rounded-xl border border-[#e2e7f2] bg-[#f8fafc] px-3.5 py-3">
                      <p class="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a92a8]">${escapeHtml(cap.label)}</p>
                      <p class="mt-1 text-[13px] text-[#121528]">${escapeHtml(cap.value)}</p>
                    </div>`,
                    )
                    .join("")}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="bg-bg-deep py-[70px] max-[820px]:py-[72px]">
          <div class="mx-auto w-[min(1180px,calc(100%-48px))] max-[820px]:w-[calc(100%-32px)]">
            <div class="mb-8 max-w-[640px]">
              <span class="${cx("text-[12px] font-extrabold uppercase tracking-[0.13em]", accentText[accent])}">Use cases</span>
              <h2 class="mt-3 font-heading text-[clamp(30px,3.5vw,42px)] font-semibold tracking-[-0.035em] text-[#121528]">Where teams use it</h2>
            </div>
            <div class="mb-5 flex flex-wrap gap-2" data-usecases></div>
            <div class="animate-[fade-up_.3s_ease_both] grid grid-cols-[1.2fr_0.8fr] gap-5 rounded-[18px] border border-[#d5dbea] bg-white p-6 shadow-[0_8px_24px_rgba(18,21,40,.08)] max-[820px]:grid-cols-1">
              <div>
                <h3 class="font-heading text-[24px] font-semibold text-[#121528]">${escapeHtml(activeUseCase.title)}</h3>
                <p class="mt-3 text-[14px] leading-[1.75] text-[#5c6478]">${escapeHtml(activeUseCase.description)}</p>
                <ul class="mt-5 space-y-2">
                  ${[
                    "Start from a sample workflow in the portal",
                    "Connect STT / TTS / LLM as needed",
                    "Export or automate from your account",
                  ]
                    .map(
                      (step) => `
                    <li class="flex items-start gap-2 text-[13px] text-[#5c6478]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mt-0.5 shrink-0 text-success"><path d="M20 6 9 17l-5-5"/></svg>
                      ${escapeHtml(step)}
                    </li>`,
                    )
                    .join("")}
                </ul>
              </div>
              <div class="rounded-2xl border border-[#e2e7f2] bg-[#f8fafc] p-4">
                <p class="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8a92a8]">Spec snapshot</p>
                <div class="mt-3 space-y-2">
                  ${product.capabilities
                    .slice(0, 3)
                    .map(
                      (cap) => `
                    <div class="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2.5 text-[12px] ring-1 ring-[#e2e7f2]">
                      <span class="text-[#6b7389]">${escapeHtml(cap.label)}</span>
                      <span class="text-right text-[#121528]">${escapeHtml(cap.value)}</span>
                    </div>`,
                    )
                    .join("")}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="border-t border-[#d5dbea] bg-bg py-[70px] max-[820px]:py-[72px]">
          <div class="mx-auto w-[min(1180px,calc(100%-48px))] max-[820px]:w-[calc(100%-32px)]">
            <div class="mb-10 max-w-[560px]">
              <span class="${cx("text-[12px] font-extrabold uppercase tracking-[0.13em]", accentText[accent])}">FAQ</span>
              <h2 class="mt-3 font-heading text-[clamp(30px,3.5vw,42px)] font-semibold tracking-[-0.035em] text-[#121528]">Common questions</h2>
            </div>
            <div class="grid gap-3" data-faqs></div>
          </div>
        </section>
      `;

      const featuresEl = root.querySelector("[data-features]");
      product.features.forEach((feature, index) => {
        const active = index === featureIndex;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = cx(
          "rounded-[14px] border px-4 py-3.5 text-left transition duration-250",
          active ? accentBorder[accent] : "border-[#d5dbea] bg-white hover:border-[#c5cce0] hover:bg-[#f0f3fa]",
        );
        btn.innerHTML = `
          <span class="flex items-center justify-between gap-3">
            <span class="font-heading text-[15px] font-semibold text-[#121528]">${escapeHtml(feature.title)}</span>
            <span class="text-[11px] font-bold text-[#8a92a8]">0${index + 1}</span>
          </span>
          <span class="${cx(
            "mt-1 block text-[12px] leading-relaxed text-[#6b7389] transition-[max-height,opacity] duration-300",
            active ? "max-h-24 opacity-100" : "max-h-0 overflow-hidden opacity-0",
          )}">${escapeHtml(feature.description)}</span>
        `;
        btn.addEventListener("click", () => {
          featureIndex = index;
          render();
        });
        featuresEl.appendChild(btn);
      });

      const useCasesEl = root.querySelector("[data-usecases]");
      product.useCases.forEach((useCase, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = cx(
          "rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition duration-200",
          index === useCaseIndex
            ? `${accentBorder[accent]} text-[#121528]`
            : "border-[#d5dbea] bg-white text-[#5c6478] hover:border-[#c5cce0] hover:bg-[#f0f3fa]",
        );
        btn.textContent = useCase.title;
        btn.addEventListener("click", () => {
          useCaseIndex = index;
          render();
        });
        useCasesEl.appendChild(btn);
      });

      const faqsEl = root.querySelector("[data-faqs]");
      product.faqs.forEach((faq, index) => {
        const open = openFaq === index;
        const item = document.createElement("div");
        item.className = cx(
          "rounded-[14px] border bg-white transition-colors duration-200",
          open ? accentBorder[accent] : "border-[#d5dbea]",
        );
        item.innerHTML = `
          <button type="button" aria-expanded="${open}" data-faq-btn class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
            <span class="text-[15px] font-semibold text-[#121528]">${escapeHtml(faq.question)}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="${cx("shrink-0 text-[#8a92a8] transition-transform duration-300", open && "rotate-180")}"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <div class="${cx("grid transition-[grid-template-rows,opacity] duration-300 ease-out", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}">
            <div class="min-h-0 overflow-hidden">
              <p class="px-5 pb-4 text-[13px] leading-[1.7] text-[#6b7389]">${escapeHtml(faq.answer)}</p>
            </div>
          </div>
        `;
        item.querySelector("[data-faq-btn]")?.addEventListener("click", () => {
          openFaq = open ? null : index;
          render();
        });
        faqsEl.appendChild(item);
      });
    }

    render();
  }

  function bindHeroCtas(product) {
    document.querySelectorAll("[data-product-primary-cta]").forEach((el) => {
      el.setAttribute("href", resolveCta(product.primaryCta.hrefKey));
    });
  }

  function init() {
    const catalog = window.EBMA_PRODUCTS;
    if (!catalog) return;

    const interactiveRoot = document.getElementById("product-interactive-root");
    const slug =
      interactiveRoot?.getAttribute("data-product-slug") ||
      document.body.getAttribute("data-product-slug");
    if (!slug) return;

    const product = catalog.getProduct(slug);
    if (!product) return;

    bindHeroCtas(product);
    initCodePanel(document.getElementById("product-code-panel-root"), product);
    initInteractiveBody(interactiveRoot, product);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
