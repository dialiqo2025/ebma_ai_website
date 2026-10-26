(function () {
  const usageClassifications = [
    {
      service: "stt",
      label: "Speech to Text",
      shortLabel: "STT",
      description: "Live conversations and uploaded audio are transcribed into text.",
      rateUnit: "per audio minute",
      measuredBy: "Audio duration",
    },
    {
      service: "tts",
      label: "Text to Speech",
      shortLabel: "TTS",
      description: "Written content is converted into natural-sounding speech.",
      rateUnit: "per 1,000 characters",
      measuredBy: "Characters generated",
    },
    {
      service: "llm",
      label: "LLM Assistant",
      shortLabel: "LLM",
      description: "Assistant prompts and responses are processed by the language model.",
      rateUnit: "per 1,000 tokens",
      measuredBy: "Tokens processed",
    },
  ];

  const billingSteps = [
    {
      number: "01",
      title: "Create your free account",
      detail: "Get starter credits and explore STT, TTS, and LLM Assistant without a card.",
    },
    {
      number: "02",
      title: "Add credits when needed",
      detail: "Refill your wallet from the portal. One credit is equal to ₹1.",
    },
    {
      number: "03",
      title: "Use any AI service",
      detail: "Use one wallet across speech recognition, voice generation, and assistance.",
    },
    {
      number: "04",
      title: "Pay only for usage",
      detail: "Credits are deducted using the service-specific measurement shown above.",
    },
  ];

  const pricingFaqs = [
    {
      question: "Is there a monthly subscription?",
      answer:
        "No. The standard offering is pay as you go. Start with free credits, then refill your wallet whenever you need more capacity.",
    },
    {
      question: "What is a credit worth?",
      answer:
        "One credit equals ₹1. Your wallet balance is shared across Speech to Text, Text to Speech, and LLM Assistant usage.",
    },
    {
      question: "How is my usage calculated?",
      answer:
        "STT is measured by audio duration, TTS by generated characters, and LLM Assistant by processed tokens. Your portal shows usage records and remaining credits.",
    },
    {
      question: "What happens when my wallet runs low?",
      answer:
        "You can add more credits from the portal and continue using the same APIs and playgrounds.",
    },
    {
      question: "When should I request custom pricing?",
      answer:
        "Contact us when you need volume rates, dedicated support, or SLA options. Share your expected usage and requirements through the contact form so we can propose the right setup.",
    },
  ];

  const pricingHighlights = [
    "No monthly subscription",
    "1 credit = ₹1",
    "One wallet for STT, TTS, and LLM",
  ];

  const serviceStyles = {
    stt: {
      color: "text-[#6542e8]",
      surface: "bg-[rgba(101,66,232,.1)]",
      border: "border-[#cfc5f8]",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`,
    },
    tts: {
      color: "text-[#0f7b85]",
      surface: "bg-[#e8f8f8]",
      border: "border-[#bde4e5]",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
    },
    llm: {
      color: "text-[#a33e78]",
      surface: "bg-[#fcecf5]",
      border: "border-[#f0c8df]",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`,
    },
  };

  function cx(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  function formatCredits(value) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }

  function serviceRateDisplay(pricing, service) {
    if (service === "tts") {
      const pair = pricing.rates.tts;
      if (pair) {
        return {
          credits: pair.credits,
          unit: `/ ${pair.chars.toLocaleString()} characters`,
        };
      }
      return {
        credits: pricing.rates.ttsCreditsPer1000Chars,
        unit: "/ 1,000 characters",
      };
    }
    if (service === "stt") {
      const pair = pricing.rates.stt;
      if (pair) {
        return {
          credits: pair.credits,
          unit:
            pair.minutes === 1
              ? "/ minute"
              : `/ ${pair.minutes.toLocaleString()} minutes`,
        };
      }
      return { credits: pricing.rates.sttCreditsPerMinute, unit: "/ minute" };
    }
    const pair = pricing.rates.llm;
    if (pair) {
      return {
        credits: pair.credits,
        unit: `/ ${pair.tokens.toLocaleString()} tokens`,
      };
    }
    return {
      credits: pricing.rates.llmCreditsPer1000Tokens,
      unit: "/ 1,000 tokens",
    };
  }

  function initPricingPage() {
    const root = document.getElementById("pricing-page-root");
    if (!root) return;

    const cfg = window.EBMA_CONFIG || {};
    const api = window.EBMA_API || {};
    const contactHref = "contact.html?topic=custom_pricing";
    const walletHref =
      typeof cfg.portalPath === "function"
        ? cfg.portalPath("/platform/plans?kind=wallet_topup")
        : `${cfg.PORTAL_URL || ""}/platform/plans?kind=wallet_topup`;

    let openFaq = 0;
    let pricing = null;
    let pricingError = false;

    function renderRates() {
      const statusEl = root.querySelector("[data-rate-status]");
      const cardsEl = root.querySelector("[data-rate-cards]");
      const signupLabels = root.querySelectorAll("[data-signup-credits]");
      const paygList = root.querySelector("[data-payg-credits]");

      const signupCredits = pricing ? formatCredits(pricing.signupFreeCredits) : null;
      signupLabels.forEach((el) => {
        const label = signupCredits
          ? `Start with ${signupCredits} free credits`
          : "Start with free credits";
        const textNode = el.querySelector("[data-signup-label]");
        if (textNode) textNode.textContent = label;
        else el.childNodes[0] && (el.childNodes[0].textContent = `${label} `);
      });
      if (paygList) {
        paygList.textContent = signupCredits
          ? `${signupCredits} free starter credits`
          : "Free starter credits";
      }

      if (statusEl) {
        statusEl.className = cx(
          "mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-semibold",
          pricing
            ? "border-[#b9ddca] bg-[#e9f8f0] text-[#147449]"
            : pricingError
              ? "border-[#ead8aa] bg-[#fff8e6] text-[#8a6512]"
              : "border-[#d8d2ee] bg-white text-[#6b7389]",
        );
        statusEl.innerHTML = `
          <span class="${cx(
            "size-1.5 rounded-full",
            pricing ? "bg-[#147449]" : pricingError ? "bg-[#b88a22]" : "animate-pulse bg-[#8c7ff7]",
          )}"></span>
          ${
            pricing
              ? "Live rates synced with the current Pay-as-you-go configuration"
              : pricingError
                ? "Live rates are unavailable right now — confirm current rates in the portal"
                : "Loading current rates from ebma AI…"
          }`;
      }

      if (!cardsEl) return;
      cardsEl.innerHTML = usageClassifications
        .map((item, index) => {
          const style = serviceStyles[item.service];
          const rate = pricing ? serviceRateDisplay(pricing, item.service) : null;
          return `
          <article class="relative overflow-hidden rounded-[20px] border bg-white p-6 shadow-[0_10px_30px_rgba(18,21,40,.07)] ${style.border}">
            <span class="absolute right-5 top-3 font-heading text-[58px] font-bold leading-none text-[#f1eefb]">0${index + 1}</span>
            <span class="relative grid size-11 place-items-center rounded-xl ${style.surface} ${style.color}">${style.icon}</span>
            <p class="relative mt-5 text-[11px] font-extrabold uppercase tracking-[0.13em] ${style.color}">${item.shortLabel}</p>
            <h3 class="relative mt-1 text-xl font-bold text-[#121528]">${item.label}</h3>
            <p class="relative mt-3 min-h-[66px] text-[13px] leading-[1.7] text-[#5c6478] max-[900px]:min-h-0">${item.description}</p>
            <div class="relative mt-5 rounded-[14px] border border-[#e3e6ef] bg-[#f8fafc] p-4">
              <p class="text-[10px] font-bold uppercase tracking-[0.11em] text-[#8a92a8]">Standard usage rate</p>
              <p class="mt-2 font-heading text-[24px] font-semibold tracking-[-0.03em] text-[#121528]">
                ${
                  rate !== null
                    ? `${formatCredits(rate.credits)} ${rate.credits === 1 ? "credit" : "credits"}`
                    : pricingError
                      ? "View in portal"
                      : "Loading…"
                }
              </p>
              <p class="mt-0.5 text-[12px] font-semibold text-[#6542e8]">${rate?.unit ?? item.rateUnit}</p>
            </div>
            <div class="relative mt-4 flex items-center justify-between gap-3 border-t border-[#e7eaf2] pt-4 text-[11px]">
              <span class="text-[#8a92a8]">Measured by</span>
              <span class="font-bold text-[#121528]">${item.measuredBy}</span>
            </div>
          </article>`;
        })
        .join("");
    }

    function bindFaq() {
      root.querySelectorAll("[data-faq-item]").forEach((item) => {
        const index = Number(item.getAttribute("data-faq-item"));
        const open = openFaq === index;
        item.className = cx(
          "rounded-[14px] border bg-white transition-colors",
          open
            ? "border-[#6542e8]/45 bg-[rgba(124,58,237,.05)]"
            : "border-[#d5dbea]",
        );
        const btn = item.querySelector("[data-faq-btn]");
        const panel = item.querySelector("[data-faq-panel]");
        const chevron = item.querySelector("[data-faq-chevron]");
        btn?.setAttribute("aria-expanded", open ? "true" : "false");
        panel?.classList.toggle("grid-rows-[1fr]", open);
        panel?.classList.toggle("opacity-100", open);
        panel?.classList.toggle("grid-rows-[0fr]", !open);
        panel?.classList.toggle("opacity-0", !open);
        chevron?.classList.toggle("rotate-180", open);
      });
    }

    // Fill static FAQ / steps / highlights once
    const highlightsEl = root.querySelector("[data-pricing-highlights]");
    if (highlightsEl) {
      highlightsEl.innerHTML = pricingHighlights
        .map(
          (item) => `
        <span class="inline-flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-success"><path d="M20 6 9 17l-5-5"/></svg>
          ${item}
        </span>`,
        )
        .join("");
    }

    const stepsEl = root.querySelector("[data-billing-steps]");
    if (stepsEl) {
      stepsEl.innerHTML = billingSteps
        .map(
          (step) => `
        <li class="relative rounded-[18px] border border-[#d5dbea] bg-white p-5 shadow-[0_6px_22px_rgba(18,21,40,.05)]">
          <span class="relative grid size-14 place-items-center rounded-full border-4 border-bg bg-[#6542e8] font-heading text-[13px] font-bold text-white shadow-[0_5px_16px_rgba(101,66,232,.25)]">${step.number}</span>
          <h3 class="mt-5 text-[15px] font-bold text-[#121528]">${step.title}</h3>
          <p class="mt-2 text-[12px] leading-[1.7] text-[#667085]">${step.detail}</p>
        </li>`,
        )
        .join("");
    }

    const faqsEl = root.querySelector("[data-pricing-faqs]");
    if (faqsEl) {
      faqsEl.innerHTML = pricingFaqs
        .map(
          (faq, index) => `
        <div data-faq-item="${index}" class="rounded-[14px] border bg-white transition-colors border-[#d5dbea]">
          <button type="button" data-faq-btn aria-expanded="false" class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
            <span class="text-[14px] font-semibold text-[#121528]">${faq.question}</span>
            <svg data-faq-chevron xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0 text-[#8a92a8] transition-transform duration-300"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <div data-faq-panel class="grid transition-[grid-template-rows,opacity] duration-300 ease-out grid-rows-[0fr] opacity-0">
            <div class="min-h-0 overflow-hidden">
              <p class="px-5 pb-4 text-[13px] leading-[1.7] text-[#6b7389]">${faq.answer}</p>
            </div>
          </div>
        </div>`,
        )
        .join("");
      faqsEl.querySelectorAll("[data-faq-btn]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const item = btn.closest("[data-faq-item]");
          const index = Number(item?.getAttribute("data-faq-item"));
          openFaq = openFaq === index ? null : index;
          bindFaq();
        });
      });
      bindFaq();
    }

    root.querySelectorAll("[data-contact-pricing]").forEach((el) => {
      el.setAttribute("href", contactHref);
    });
    root.querySelectorAll("[data-wallet-href]").forEach((el) => {
      el.setAttribute("href", walletHref);
    });
    root.querySelectorAll("[data-ebma-href]").forEach((el) => {
      const key = el.getAttribute("data-ebma-href");
      if (key && cfg[key]) el.setAttribute("href", cfg[key]);
    });

    renderRates();

    if (typeof api.fetchPublicPricing === "function") {
      const controller = new AbortController();
      api
        .fetchPublicPricing(controller.signal)
        .then((current) => {
          pricing = current;
          pricingError = false;
          renderRates();
        })
        .catch((error) => {
          if (error instanceof DOMException && error.name === "AbortError") return;
          pricingError = true;
          renderRates();
        });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPricingPage);
  } else {
    initPricingPage();
  }
})();
