(function () {
  const MAX_RECORD_MS = 15_000;
  const btnPrimary =
    "inline-flex items-center justify-center gap-2 rounded-[11px] min-h-[38px] px-3.5 text-[12px] font-bold cursor-pointer transition duration-[250ms] whitespace-nowrap hover:-translate-y-px disabled:opacity-55 disabled:cursor-not-allowed disabled:hover:translate-y-0 border-0 text-white bg-brand-gradient shadow-[0_9px_28px_rgba(101,66,232,.25),inset_0_1px_rgba(255,255,255,.15)]";
  const btnQuiet =
    "inline-flex items-center justify-center gap-2 rounded-[11px] min-h-[38px] px-3.5 text-[12px] font-bold cursor-pointer transition duration-[250ms] whitespace-nowrap hover:-translate-y-px border border-black/8 bg-black/[0.03] text-[#1d1b2e]";

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

  function getSpeechRecognitionCtor() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }

  function initSttDemo(root) {
    if (!root || root.dataset.ebmaSttBound === "1") return;
    root.dataset.ebmaSttBound = "1";

    const samples = window.EBMA_DEMOS?.sttDemoSamples || [];
    const api = window.EBMA_API || {};
    const cfg = window.EBMA_CONFIG || {};
    const PlaygroundApiError = api.PlaygroundApiError;

    let mode = "samples";
    let activeId = samples[0]?.id;
    let visibleCount = 0;
    let running = false;
    let micSupported = Boolean(navigator.mediaDevices?.getUserMedia) && typeof MediaRecorder !== "undefined";
    let livePreviewSupported = Boolean(getSpeechRecognitionCtor());
    let listening = false;
    let transcribing = false;
    let liveText = "";
    let previewOnly = false;
    let micError = "";
    let remaining = null;
    let limit = 5;
    let exhausted = false;
    let timer = null;
    let maxTimer = null;
    let mediaRecorder = null;
    let stream = null;
    let chunks = [];
    let recognition = null;
    let finalPreview = "";
    let keepRecognizing = false;

    function activeSample() {
      return samples.find((s) => s.id === activeId) || samples[0];
    }

    function stopLivePreview() {
      keepRecognizing = false;
      if (!recognition) return;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.stop();
      } catch {
        try {
          recognition.abort();
        } catch {
          /* ignore */
        }
      }
      recognition = null;
    }

    function stopMicTracks() {
      if (mediaRecorder?.state === "recording") mediaRecorder.stop();
      mediaRecorder = null;
      stream?.getTracks().forEach((t) => t.stop());
      stream = null;
    }

    function startLivePreview() {
      const Ctor = getSpeechRecognitionCtor();
      if (!Ctor) return;
      stopLivePreview();
      finalPreview = "";
      keepRecognizing = true;
      recognition = new Ctor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-IN";
      recognition.onresult = (event) => {
        let interim = "";
        let finals = finalPreview;
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          const piece = result?.[0]?.transcript || "";
          if (result.isFinal) {
            finals = `${finals} ${piece}`.trim();
            finalPreview = finals;
          } else {
            interim += piece;
          }
        }
        const next = `${finals} ${interim}`.trim();
        if (next) {
          liveText = next;
          previewOnly = true;
          render();
        }
      };
      recognition.onerror = () => undefined;
      recognition.onend = () => {
        if (!keepRecognizing) return;
        try {
          recognition.start();
        } catch {
          /* ignore */
        }
      };
      try {
        recognition.start();
      } catch {
        stopLivePreview();
      }
    }

    function playSample(sample) {
      activeId = sample.id;
      running = true;
      visibleCount = 0;
      if (timer !== null) window.clearInterval(timer);
      let i = 0;
      timer = window.setInterval(() => {
        i += 1;
        visibleCount = i;
        if (i >= sample.segments.length) {
          window.clearInterval(timer);
          timer = null;
          running = false;
        }
        render();
      }, 900);
      render();
    }

    function stopSample() {
      if (timer !== null) window.clearInterval(timer);
      timer = null;
      running = false;
      visibleCount = activeSample()?.segments.length || 0;
      render();
    }

    async function finishRecording(blob) {
      listening = false;
      transcribing = true;
      micError = "";
      render();
      try {
        const result = await api.runPlaygroundStt(blob, "playground.webm");
        liveText = result.transcript || "(No speech detected)";
        previewOnly = false;
        remaining = result.remaining;
        limit = result.limit;
        exhausted = result.remaining <= 0;
      } catch (err) {
        if (PlaygroundApiError && err instanceof PlaygroundApiError) {
          if (err.code === "trial_exhausted") {
            exhausted = true;
            remaining = 0;
            micError = "Free STT trials used up. Sign in to continue in the portal.";
          } else if (err.code === "rate_limited") {
            micError = err.meta?.retryAfterSeconds
              ? `Please wait ${err.meta.retryAfterSeconds}s before trying again.`
              : "Please wait a moment before trying again.";
          } else {
            micError = err.message;
          }
          if (typeof err.meta?.remaining === "number") remaining = err.meta.remaining;
          if (typeof err.meta?.limit === "number") limit = err.meta.limit;
        } else {
          micError = "STT playground is unavailable right now.";
        }
      } finally {
        transcribing = false;
        render();
      }
    }

    async function startMic() {
      if (exhausted || transcribing) return;
      micError = "";
      liveText = "";
      previewOnly = false;
      finalPreview = "";
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        chunks = [];
        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : MediaRecorder.isTypeSupported("audio/webm")
            ? "audio/webm"
            : "";
        mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) chunks.push(event.data);
        };
        mediaRecorder.onstop = () => {
          stopLivePreview();
          const blob = new Blob(chunks, { type: mediaRecorder?.mimeType || "audio/webm" });
          stream?.getTracks().forEach((t) => t.stop());
          stream = null;
          mediaRecorder = null;
          if (blob.size > 0) void finishRecording(blob);
          else {
            listening = false;
            micError = "No audio captured. Try again.";
            render();
          }
        };
        mediaRecorder.start(250);
        listening = true;
        startLivePreview();
        if (maxTimer !== null) window.clearTimeout(maxTimer);
        maxTimer = window.setTimeout(() => {
          if (mediaRecorder?.state === "recording") mediaRecorder.stop();
        }, MAX_RECORD_MS);
        render();
      } catch {
        micError = "Microphone permission denied or unavailable.";
        listening = false;
        stopLivePreview();
        render();
      }
    }

    function stopMic() {
      if (maxTimer !== null) {
        window.clearTimeout(maxTimer);
        maxTimer = null;
      }
      stopLivePreview();
      if (mediaRecorder?.state === "recording") mediaRecorder.stop();
      else {
        stopMicTracks();
        listening = false;
        render();
      }
    }

    function render() {
      const active = activeSample();
      const shown = active ? active.segments.slice(0, Math.max(visibleCount, 0)) : [];
      const triesLabel =
        remaining === null ? `${limit} free tries` : `${remaining} of ${limit} left`;

      root.innerHTML = `
        <div class="overflow-hidden rounded-[20px] border border-[#d5dbea] bg-white shadow-[0_20px_50px_rgba(18,21,40,.1)]">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e7f2] bg-[#f8fafc] px-5 py-4">
            <div>
              <p class="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#0284c7]">Try STT</p>
              <p class="mt-1 text-[13px] text-[#6b7389]">Samples are free · Live mic uses EBMA ASR (${triesLabel})</p>
            </div>
            <div class="flex rounded-full border border-[#d5dbea] bg-white p-1">
              <button type="button" data-mode="samples" class="${cx("rounded-full px-3.5 py-1.5 text-[12px] font-semibold", mode === "samples" ? "bg-[linear-gradient(90deg,#3b82f6,#6542e8)] text-white" : "text-[#6b7389]")}">Samples</button>
              <button type="button" data-mode="mic" class="${cx("rounded-full px-3.5 py-1.5 text-[12px] font-semibold", mode === "mic" ? "bg-[linear-gradient(90deg,#3b82f6,#6542e8)] text-white" : "text-[#6b7389]")}">Live mic</button>
            </div>
          </div>
          <div data-body></div>
          <div class="flex flex-wrap items-center justify-between gap-3 border-t border-[#e2e7f2] bg-[#f8fafc] px-5 py-4">
            <p class="text-[12px] text-[#6b7389]">Want diarization, SRT/VTT, and production ASR?</p>
            <div class="flex flex-wrap gap-2">
              <a class="${btnQuiet}" href="${cfg.portalSignupUrl || "#"}">Create account</a>
              <a class="${btnPrimary}" href="${cfg.portalSttUrl || "#"}">Open STT playground <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
            </div>
          </div>
        </div>
      `;

      const body = root.querySelector("[data-body]");
      if (mode === "samples") {
        body.innerHTML = `
          <div class="grid grid-cols-[220px_1fr] max-[820px]:grid-cols-1">
            <div class="border-r border-[#e2e7f2] p-3 max-[820px]:border-r-0 max-[820px]:border-b" data-sample-list></div>
            <div class="p-5">
              <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p class="text-[13px] text-[#5c6478]">${escapeHtml(active?.description || "")}</p>
                <button type="button" data-run class="${btnPrimary}"></button>
              </div>
              <div class="min-h-[220px] rounded-xl border border-[#e2e7f2] bg-[#f8fafc] px-4 py-3" data-transcript></div>
            </div>
          </div>
        `;
        const list = body.querySelector("[data-sample-list]");
        samples.forEach((sample) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = cx(
            "mb-1.5 w-full rounded-xl px-3 py-3 text-left transition",
            activeId === sample.id
              ? "bg-[rgba(2,132,199,.1)] text-[#121528] ring-1 ring-[#0284c7]/30"
              : "text-[#5c6478] hover:bg-[#eef1f8]",
          );
          btn.innerHTML = `<span class="block text-[13px] font-semibold">${escapeHtml(sample.title)}</span><span class="mt-1 block text-[11px] text-[#8a92a8]">${escapeHtml(sample.language)} · ${escapeHtml(sample.duration)}</span>`;
          btn.addEventListener("click", () => playSample(sample));
          list.appendChild(btn);
        });
        const runBtn = body.querySelector("[data-run]");
        runBtn.innerHTML = running
          ? `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect width="14" height="14" x="5" y="5" rx="1"/></svg> Stop`
          : `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c1.5 0 2.2.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.5 0 2.2.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.5 0 2.2.5 2.5 1"/></svg> Run sample`;
        runBtn.addEventListener("click", () => (running ? stopSample() : playSample(active)));
        const transcript = body.querySelector("[data-transcript]");
        if (!shown.length) {
          transcript.innerHTML = `<p class="py-16 text-center text-[13px] text-[#8a92a8]">Press <span class="font-semibold text-[#121528]">Run sample</span> to stream a canned transcript.</p>`;
        } else {
          transcript.innerHTML = shown
            .map(
              (seg, idx) => `
            <div class="border-b border-[#e2e7f2] py-3 last:border-b-0">
              <div class="mb-1.5 flex flex-wrap gap-2">
                <span class="rounded-md bg-[#0284c7] px-2 py-0.5 text-[11px] font-semibold text-white">${escapeHtml(seg.time)}</span>
                ${seg.speaker ? `<span class="rounded-md bg-[#eef1f8] px-2 py-0.5 text-[11px] text-[#6b7389]">${escapeHtml(seg.speaker)}</span>` : ""}
              </div>
              <p class="text-[16px] leading-relaxed text-[#121528]">${escapeHtml(seg.text)}</p>
            </div>`,
            )
            .join("");
        }
      } else {
        body.innerHTML = `
          <div class="p-5">
            <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p class="text-[13px] text-[#5c6478]">${
                livePreviewSupported
                  ? "Speak and see text appear live. Stop to confirm with EBMA ASR (1 free trial)."
                  : "Record up to 15 seconds, then stop to run EBMA ASR (1 free trial)."
              }</p>
              ${
                !exhausted
                  ? `<button type="button" data-mic class="${btnPrimary}" ${!micSupported || transcribing ? "disabled" : ""}></button>`
                  : ""
              }
            </div>
            ${!micSupported ? `<p class="mb-3 text-[12px] text-[#db2777]">Microphone recording needs a modern browser with MediaRecorder support.</p>` : ""}
            ${micError ? `<p class="mb-3 text-[12px] text-[#db2777]">${escapeHtml(micError)}</p>` : ""}
            <div data-mic-panel></div>
          </div>
        `;
        const micBtn = body.querySelector("[data-mic]");
        if (micBtn) {
          micBtn.innerHTML = transcribing
            ? `<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Confirming with EBMA…`
            : listening
              ? `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect width="14" height="14" x="5" y="5" rx="1"/></svg> Stop & confirm`
              : `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg> Start speaking`;
          micBtn.addEventListener("click", () => (listening ? stopMic() : void startMic()));
        }
        const panel = body.querySelector("[data-mic-panel]");
        if (exhausted) {
          panel.innerHTML = `
            <div class="rounded-xl border border-[#e9d5ff] bg-[#faf5ff] px-4 py-4">
              <p class="text-[13px] font-semibold text-[#121528]">Sign in to keep using STT</p>
              <p class="mt-1 text-[12px] text-[#6b7389]">Your free website trials are used. Create an account for live ASR, diarization, and exports.</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <a class="${btnPrimary}" href="${cfg.portalLoginUrl || "#"}">Sign in</a>
                <a class="${btnQuiet}" href="${cfg.portalSignupUrl || "#"}">Create account</a>
              </div>
            </div>`;
        } else {
          panel.innerHTML = `
            <div class="min-h-[220px] rounded-xl border border-[#e2e7f2] bg-[#f8fafc] px-4 py-4">
              ${
                liveText
                  ? `<div>
                      ${previewOnly ? `<p class="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0284c7]">Live preview</p>` : ""}
                      ${!previewOnly && !listening && !transcribing ? `<p class="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#059669]">EBMA transcript</p>` : ""}
                      <p class="${cx("text-[18px] leading-relaxed text-[#121528]", previewOnly && "italic text-[#334155]")}">${escapeHtml(liveText)}${listening && previewOnly ? `<span class="ml-1 inline-block h-4 w-0.5 animate-pulse bg-[#0284c7] align-middle"></span>` : ""}</p>
                    </div>`
                  : `<p class="py-16 text-center text-[13px] text-[#8a92a8]">${
                      transcribing
                        ? "Confirming with EBMA ASR…"
                        : listening
                          ? livePreviewSupported
                            ? "Listening… text will appear as you speak."
                            : "Recording… speak clearly, then stop (max 15s)."
                          : "Start speaking to try a live transcription trial."
                    }</p>`
              }
            </div>`;
        }
      }

      root.querySelectorAll("[data-mode]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const next = btn.getAttribute("data-mode");
          if (next === "samples") {
            stopMic();
            mode = "samples";
          } else {
            stopSample();
            mode = "mic";
          }
          render();
        });
      });
    }

    if (typeof api.fetchPlaygroundStatus === "function") {
      api
        .fetchPlaygroundStatus("stt")
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
    const root = document.getElementById("stt-demo-root");
    if (root) initSttDemo(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
