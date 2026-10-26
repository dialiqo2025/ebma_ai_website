(function () {
  const inquiryTypes = [
    { value: "custom_pricing", label: "Custom pricing" },
    { value: "sales", label: "Sales inquiry" },
    { value: "partnership", label: "Partnership" },
    { value: "support", label: "Product support" },
    { value: "general", label: "General inquiry" },
  ];
  const validTopics = new Set(inquiryTypes.map((item) => item.value));
  const inputClass =
    "mt-2 h-12 w-full rounded-xl border border-[#d9ddea] bg-white px-3.5 text-[13px] text-[#121528] outline-none transition placeholder:text-[#a0a6b7] focus:border-[#6542e8] focus:ring-4 focus:ring-[rgba(101,66,232,.09)]";

  const btnPrimary =
    "inline-flex items-center justify-center gap-2 rounded-[11px] min-h-[42px] px-[18px] text-[13px] font-bold cursor-pointer transition duration-[250ms] whitespace-nowrap hover:-translate-y-px border-0 text-white bg-brand-gradient shadow-[0_9px_28px_rgba(101,66,232,.25),inset_0_1px_rgba(255,255,255,.15)]";
  const btnOutline =
    "inline-flex items-center justify-center gap-2 rounded-[11px] min-h-[42px] px-[18px] text-[13px] font-bold cursor-pointer transition duration-[250ms] whitespace-nowrap hover:-translate-y-px border border-border bg-surface text-text shadow-[0_1px_2px_rgba(18,21,40,.04)]";

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function initContactPage() {
    const root = document.getElementById("contact-page-root");
    if (!root) return;

    const cfg = window.EBMA_CONFIG || {};
    const api = window.EBMA_API || {};
    const params = new URLSearchParams(window.location.search);
    const requestedTopic = params.get("topic") || "general";
    const defaultTopic = validTopics.has(requestedTopic) ? requestedTopic : "general";

    let sending = false;
    let error = "";
    let reference = null;
    let contactEmail = cfg.customPricingEmail || cfg.supportEmail || "hello@ebma.ai";

    function render() {
      if (reference) {
        root.innerHTML = `
          <div class="rounded-[24px] border border-[#d8d2ee] bg-white p-7 shadow-[0_26px_70px_rgba(53,41,112,.14)] max-[560px]:p-5">
            <div class="grid min-h-[620px] place-items-center text-center">
              <div class="max-w-[430px]">
                <span class="mx-auto grid size-16 place-items-center rounded-full bg-[#e9f8f0] text-[#147449]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                </span>
                <p class="mt-6 text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#147449]">Inquiry sent</p>
                <h2 class="mt-3 font-heading text-[32px] font-semibold tracking-[-0.04em] text-[#121528]">Thanks for reaching out.</h2>
                <p class="mt-4 text-[14px] leading-[1.7] text-[#667085]">Your details have been delivered to our team. Keep this reference if you need to follow up.</p>
                <div class="mx-auto mt-5 w-max rounded-xl border border-[#d8d2ee] bg-[#f8f7ff] px-4 py-3 font-mono text-sm font-bold tracking-[0.12em] text-[#6542e8]">${escapeHtml(reference)}</div>
                <div class="mt-8 flex justify-center gap-3 max-[460px]:flex-col">
                  <a href="index.html" class="${btnOutline}">Back to home</a>
                  <a href="${cfg.portalSignupUrl || "#"}" class="${btnPrimary}">Start building <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
                </div>
              </div>
            </div>
          </div>`;
        return;
      }

      root.innerHTML = `
        <div class="rounded-[24px] border border-[#d8d2ee] bg-white p-7 shadow-[0_26px_70px_rgba(53,41,112,.14)] max-[560px]:p-5">
          <form data-contact-form class="grid gap-5">
            <div>
              <p class="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#6542e8]">Send an inquiry</p>
              <h2 class="mt-2 font-heading text-[28px] font-semibold tracking-[-0.035em] text-[#121528]">How can we help?</h2>
              <p class="mt-2 text-[12px] leading-[1.65] text-[#7a8299]">Fields marked with * are required.</p>
            </div>
            <div class="grid grid-cols-2 gap-4 max-[620px]:grid-cols-1">
              <label class="text-[12px] font-semibold text-[#343247]">Full name *<input class="${inputClass}" name="fullName" autocomplete="name" required minlength="2" maxlength="100" placeholder="Your full name" /></label>
              <label class="text-[12px] font-semibold text-[#343247]">Work email *<input class="${inputClass}" name="workEmail" type="email" autocomplete="email" required maxlength="254" placeholder="you@company.com" /></label>
              <label class="text-[12px] font-semibold text-[#343247]">Company *<input class="${inputClass}" name="company" autocomplete="organization" required minlength="2" maxlength="120" placeholder="Company name" /></label>
              <label class="text-[12px] font-semibold text-[#343247]">Job title<input class="${inputClass}" name="jobTitle" autocomplete="organization-title" maxlength="100" placeholder="Your role" /></label>
              <label class="text-[12px] font-semibold text-[#343247]">Phone number<input class="${inputClass}" name="phone" type="tel" autocomplete="tel" maxlength="30" placeholder="+91 98765 43210" /></label>
              <label class="text-[12px] font-semibold text-[#343247]">Inquiry type *
                <select class="${inputClass}" name="inquiryType" required>
                  ${inquiryTypes.map((item) => `<option value="${item.value}" ${item.value === defaultTopic ? "selected" : ""}>${item.label}</option>`).join("")}
                </select>
              </label>
            </div>
            <fieldset>
              <legend class="text-[12px] font-semibold text-[#343247]">Services of interest</legend>
              <div class="mt-2 grid grid-cols-3 gap-2 max-[560px]:grid-cols-1">
                ${[
                  { value: "stt", label: "Speech to Text", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>` },
                  { value: "tts", label: "Text to Speech", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/></svg>` },
                  { value: "llm", label: "LLM Assistant", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/></svg>` },
                ]
                  .map(
                    (service) => `
                  <label class="flex cursor-pointer items-center gap-2 rounded-xl border border-[#d9ddea] bg-[#fafbfe] px-3 py-3 text-[11px] font-semibold text-[#4f566b] transition hover:border-[#bdb1ee] has-[:checked]:border-[#6542e8] has-[:checked]:bg-[#f3f0ff] has-[:checked]:text-[#4d32c8]">
                    <input class="size-3.5 accent-[#6542e8]" type="checkbox" name="services" value="${service.value}" />
                    ${service.icon} ${service.label}
                  </label>`,
                  )
                  .join("")}
              </div>
            </fieldset>
            <label class="text-[12px] font-semibold text-[#343247]">Expected monthly usage
              <select class="${inputClass}" name="monthlyUsage">
                <option value="not_sure" selected>Not sure yet</option>
                <option value="exploring">Exploring / prototype</option>
                <option value="small">Up to 1,000 units</option>
                <option value="growing">1,000–10,000 units</option>
                <option value="high_volume">More than 10,000 units</option>
              </select>
            </label>
            <label class="text-[12px] font-semibold text-[#343247]">Tell us about your requirements *
              <textarea class="mt-2 min-h-36 w-full resize-y rounded-xl border border-[#d9ddea] bg-white px-3.5 py-3 text-[13px] leading-[1.65] text-[#121528] outline-none transition placeholder:text-[#a0a6b7] focus:border-[#6542e8] focus:ring-4 focus:ring-[rgba(101,66,232,.09)]" name="message" required minlength="20" maxlength="4000" placeholder="What are you building, what scale do you expect, and what would a successful outcome look like?"></textarea>
            </label>
            <div class="absolute -left-[9999px]" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off" /></label></div>
            <label class="flex items-start gap-2.5 text-[11px] leading-[1.6] text-[#667085]"><input class="mt-0.5 size-4 shrink-0 accent-[#6542e8]" type="checkbox" name="consent" required />I agree that ebma AI may use these details to respond to my inquiry.</label>
            ${
              error
                ? `<div role="alert" class="rounded-xl border border-[#f0c6cf] bg-[#fff1f3] px-4 py-3 text-[12px] leading-[1.65] text-[#a11d3f]">
                    <p>${escapeHtml(error)}</p>
                    <a href="mailto:${contactEmail}?subject=${encodeURIComponent("Website inquiry for ebma AI")}" class="mt-1.5 inline-flex font-bold underline underline-offset-2">Email ${escapeHtml(contactEmail)} directly</a>
                  </div>`
                : ""
            }
            <button type="submit" ${sending ? "disabled" : ""} class="inline-flex min-h-13 items-center justify-center gap-2 rounded-[14px] bg-brand-gradient px-6 text-sm font-bold text-white shadow-[0_10px_28px_rgba(101,66,232,.26)] transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">
              ${sending ? "Sending inquiry…" : "Send inquiry"}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
            <p class="flex items-center justify-center gap-1.5 text-center text-[10px] text-[#8a92a8]">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              Delivered to the configured ebma AI contact inbox
            </p>
          </form>
        </div>`;

      const emailEl = document.querySelector("[data-contact-email]");
      if (emailEl) {
        emailEl.textContent = contactEmail;
        emailEl.setAttribute("href", `mailto:${contactEmail}`);
      }

      root.querySelector("[data-contact-form]")?.addEventListener("submit", async (event) => {
        event.preventDefault();
        sending = true;
        error = "";
        reference = null;
        render();

        const form = new FormData(event.target);
        try {
          const result = await api.submitContactInquiry({
            fullName: String(form.get("fullName") || ""),
            workEmail: String(form.get("workEmail") || ""),
            company: String(form.get("company") || ""),
            jobTitle: String(form.get("jobTitle") || ""),
            phone: String(form.get("phone") || ""),
            inquiryType: String(form.get("inquiryType")),
            services: form.getAll("services"),
            monthlyUsage: String(form.get("monthlyUsage")),
            message: String(form.get("message") || ""),
            consent: true,
            website: String(form.get("website") || ""),
          });
          reference = result.reference || "RECEIVED";
        } catch (cause) {
          error = cause instanceof Error ? cause.message : "We could not send your inquiry.";
        } finally {
          sending = false;
          render();
        }
      });
    }

    if (typeof api.fetchPublicPricing === "function") {
      const controller = new AbortController();
      api
        .fetchPublicPricing(controller.signal)
        .then((pricing) => {
          if (pricing.customPricingEmail) {
            contactEmail = pricing.customPricingEmail;
            const emailEl = document.querySelector("[data-contact-email]");
            if (emailEl) {
              emailEl.textContent = contactEmail;
              emailEl.setAttribute("href", `mailto:${contactEmail}`);
            }
          }
        })
        .catch(() => undefined);
    }

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContactPage);
  } else {
    initContactPage();
  }
})();
