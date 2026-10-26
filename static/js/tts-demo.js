(function () {
  const MAX_CHARS = 200;
  const btnPrimary =
    "inline-flex items-center justify-center gap-2 rounded-[11px] min-h-[40px] px-[18px] text-[12px] font-bold cursor-pointer transition duration-[250ms] whitespace-nowrap hover:-translate-y-px disabled:opacity-55 disabled:cursor-not-allowed disabled:hover:translate-y-0 border-0 text-white bg-brand-gradient shadow-[0_9px_28px_rgba(101,66,232,.25),inset_0_1px_rgba(255,255,255,.15)]";
  const btnQuiet =
    "inline-flex items-center justify-center gap-2 rounded-[11px] min-h-[40px] px-[18px] text-[12px] font-bold cursor-pointer transition duration-[250ms] whitespace-nowrap hover:-translate-y-px border border-black/8 bg-black/[0.03] text-[#1d1b2e]";

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

  function initTtsDemo(root) {
    if (!root || root.dataset.ebmaTtsBound === "1") return;
    root.dataset.ebmaTtsBound = "1";

    const samples = window.EBMA_DEMOS?.ttsDemoSamples || [];
    const api = window.EBMA_API || {};
    const cfg = window.EBMA_CONFIG || {};
    const PlaygroundApiError = api.PlaygroundApiError;

    let sampleId = samples[0]?.id;
    let text = (samples[0]?.text || "").slice(0, MAX_CHARS);
    let langCode = samples[0]?.langCode || "en-IN";
    let speaking = false;
    let loading = false;
    let error = "";
    let remaining = null;
    let limit = 5;
    let exhausted = false;
    let audio = null;
    let objectUrl = null;

    function activeSample() {
      return samples.find((s) => s.id === sampleId) || samples[0];
    }

    function stopAudio() {
      if (audio) {
        audio.pause();
        audio = null;
      }
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        objectUrl = null;
      }
      speaking = false;
    }

    function selectSample(id) {
      const sample = samples.find((s) => s.id === id);
      if (!sample) return;
      stopAudio();
      sampleId = sample.id;
      text = sample.text.slice(0, MAX_CHARS);
      langCode = sample.langCode;
      error = "";
      render();
    }

    async function speak() {
      if (!text.trim() || loading || exhausted) return;
      stopAudio();
      loading = true;
      error = "";
      render();
      try {
        const result = await api.runPlaygroundTts({
          text: text.trim(),
          language: langCode.startsWith("hi") ? "hi" : "en",
        });
        remaining = result.remaining;
        limit = result.limit;
        exhausted = result.remaining <= 0;
        objectUrl = api.audioBase64ToObjectUrl(result.audioBase64, result.mimeType);
        audio = new Audio(objectUrl);
        audio.onended = () => {
          speaking = false;
          render();
        };
        audio.onerror = () => {
          speaking = false;
          error = "Could not play generated audio.";
          render();
        };
        speaking = true;
        loading = false;
        render();
        await audio.play();
      } catch (err) {
        if (PlaygroundApiError && err instanceof PlaygroundApiError) {
          if (err.code === "trial_exhausted") {
            exhausted = true;
            remaining = 0;
            error = "Free TTS trials used up. Sign in to continue in the portal.";
          } else if (err.code === "rate_limited") {
            error = err.meta?.retryAfterSeconds
              ? `Please wait ${err.meta.retryAfterSeconds}s before trying again.`
              : "Please wait a moment before trying again.";
          } else {
            error = err.message;
          }
          if (typeof err.meta?.remaining === "number") remaining = err.meta.remaining;
          if (typeof err.meta?.limit === "number") limit = err.meta.limit;
        } else {
          error = "TTS playground is unavailable right now.";
        }
        loading = false;
        render();
      }
    }

    function render() {
      const active = activeSample();
      const triesLabel =
        remaining === null ? `${limit} free tries` : `${remaining} of ${limit} left`;

      root.innerHTML = `
        <div class="overflow-hidden rounded-[20px] border border-[#d5dbea] bg-white shadow-[0_20px_50px_rgba(18,21,40,.1)]">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e7f2] bg-[#f8fafc] px-5 py-4">
            <div>
              <p class="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#6542e8]">Live TTS trial</p>
              <p class="mt-1 text-[13px] text-[#6b7389]">Real EBMA voices · ${triesLabel}</p>
            </div>
          </div>
          <div class="p-5">
            <div class="mb-4 flex flex-wrap gap-2" data-samples></div>
            <label class="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#8a92a8]">Text to speak · ${escapeHtml(active?.language || "")}</label>
            <textarea data-text rows="4" ${exhausted ? "disabled" : ""} class="w-full resize-none rounded-xl border border-[#d5dbea] bg-[#f8fafc] px-4 py-3 text-[15px] leading-relaxed text-[#121528] outline-none placeholder:text-[#8a92a8] focus:border-[#B7A5FF] disabled:opacity-60" placeholder="Type something to generate…">${escapeHtml(text)}</textarea>
            <div class="mt-2 flex items-center justify-between text-[12px] text-[#8a92a8]">
              <span>Lang: ${escapeHtml(langCode)}</span>
              <span data-char-count>${text.length}/${MAX_CHARS}</span>
            </div>
            ${error ? `<p class="mt-3 text-[12px] text-[#db2777]">${escapeHtml(error)}</p>` : ""}
            <div data-actions class="mt-4"></div>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-3 border-t border-[#e2e7f2] bg-[#f8fafc] px-5 py-4">
            <p class="text-[12px] text-[#6b7389]">Need production voices, downloads, and clone?</p>
            <div class="flex flex-wrap gap-2">
              <a class="${btnQuiet} min-h-[38px]" href="${cfg.portalSignupUrl || "#"}">Create account</a>
              <a class="${btnPrimary} min-h-[38px]" href="${cfg.portalTtsUrl || "#"}">Open TTS playground <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
            </div>
          </div>
        </div>
      `;

      const samplesEl = root.querySelector("[data-samples]");
      samples.forEach((sample) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = cx(
          "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition",
          sampleId === sample.id
            ? "border-[#6542e8] bg-[rgba(124,58,237,.1)] text-[#121528]"
            : "border-[#d5dbea] bg-white text-[#5c6478] hover:border-[#c5cce0] hover:bg-[#f0f3fa]",
        );
        btn.textContent = sample.label;
        btn.addEventListener("click", () => selectSample(sample.id));
        samplesEl.appendChild(btn);
      });

      const textarea = root.querySelector("[data-text]");
      const counter = root.querySelector("[data-char-count]");
      textarea?.addEventListener("input", (e) => {
        text = e.target.value.slice(0, MAX_CHARS);
        if (e.target.value !== text) e.target.value = text;
        if (counter) counter.textContent = `${text.length}/${MAX_CHARS}`;
        const speakBtn = root.querySelector("[data-speak]");
        if (speakBtn) speakBtn.disabled = !text.trim() || loading;
      });

      const actions = root.querySelector("[data-actions]");
      if (exhausted) {
        actions.innerHTML = `
          <div class="rounded-xl border border-[#e9d5ff] bg-[#faf5ff] px-4 py-3">
            <p class="text-[13px] font-semibold text-[#121528]">Sign in to keep using TTS</p>
            <p class="mt-1 text-[12px] text-[#6b7389]">Your free website trials are used. Create an account for full voices, clone, and downloads.</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <a class="${btnPrimary} min-h-[38px]" href="${cfg.portalLoginUrl || "#"}">Sign in</a>
              <a class="${btnQuiet} min-h-[38px]" href="${cfg.portalSignupUrl || "#"}">Create account</a>
            </div>
          </div>`;
      } else {
        actions.innerHTML = `
          <div class="flex flex-wrap gap-2">
            <button type="button" data-speak class="${btnPrimary}" ${!text.trim() || loading ? "disabled" : ""}></button>
            <button type="button" data-reset class="${btnQuiet}">Reset text</button>
          </div>`;
        const speakBtn = actions.querySelector("[data-speak]");
        speakBtn.innerHTML = loading
          ? `<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Generating…`
          : speaking
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="4" height="14" x="6" y="5"/><rect width="4" height="14" x="14" y="5"/></svg> Stop`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg> Generate & play`;
        speakBtn.addEventListener("click", () => (speaking ? (stopAudio(), render()) : void speak()));
        actions.querySelector("[data-reset]")?.addEventListener("click", () => {
          stopAudio();
          text = (active?.text || "").slice(0, MAX_CHARS);
          langCode = active?.langCode || langCode;
          error = "";
          render();
        });
      }
    }

    if (typeof api.fetchPlaygroundStatus === "function") {
      api
        .fetchPlaygroundStatus("tts")
        .then((status) => {
          remaining = status.remaining;
          limit = status.limit;
          exhausted = status.exhausted;
          render();
        })
        .catch(() => undefined);
    }

    render();
  }

  function init() {
    const root = document.getElementById("tts-demo-root");
    if (root) initTtsDemo(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
