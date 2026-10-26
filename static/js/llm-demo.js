(function () {
  const btnPrimary =
    "inline-flex items-center justify-center gap-2 rounded-[11px] min-h-[38px] px-[18px] text-[12px] font-bold cursor-pointer transition duration-[250ms] whitespace-nowrap hover:-translate-y-px disabled:opacity-55 disabled:cursor-not-allowed disabled:hover:translate-y-0 border-0 text-white bg-brand-gradient shadow-[0_9px_28px_rgba(101,66,232,.25),inset_0_1px_rgba(255,255,255,.15)]";

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

  function initLlmDemo(root) {
    if (!root || root.dataset.ebmaLlmBound === "1") return;
    root.dataset.ebmaLlmBound = "1";

    const prompts = window.EBMA_DEMOS?.llmDemoPrompts || [];
    const cfg = window.EBMA_CONFIG || {};
    let messages = [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi — I’m the LLM Studio preview. Pick a prompt or type a question to see a simulated answer.",
      },
    ];
    let input = "";
    let busy = false;
    const timers = [];

    function streamReply(promptText, replyText) {
      if (busy) return;
      busy = true;
      const userId = `u-${Date.now()}`;
      const assistantId = `a-${Date.now()}`;
      messages = [
        ...messages,
        { id: userId, role: "user", content: promptText },
        { id: assistantId, role: "assistant", content: "" },
      ];
      render();

      let i = 0;
      const tick = () => {
        i += 1;
        messages = messages.map((m) =>
          m.id === assistantId ? { ...m, content: replyText.slice(0, i) } : m,
        );
        render();
        if (i < replyText.length) {
          timers.push(window.setTimeout(tick, 12));
        } else {
          busy = false;
          render();
        }
      };
      timers.push(window.setTimeout(tick, 280));
    }

    function runPrompt(id) {
      const item = prompts.find((p) => p.id === id);
      if (!item) return;
      input = "";
      streamReply(item.prompt, item.reply);
    }

    function onSubmit() {
      const text = input.trim();
      if (!text || busy) return;
      const matched =
        prompts.find(
          (p) =>
            text.toLowerCase().includes(p.label.toLowerCase()) ||
            p.prompt.toLowerCase().includes(text.toLowerCase().slice(0, 24)),
        ) || prompts[0];
      input = "";
      streamReply(
        text,
        (matched?.reply || "") +
          "\n\n(Preview response — full grounded LLM Studio unlocks in the portal.)",
      );
    }

    function render() {
      root.innerHTML = `
        <div class="overflow-hidden rounded-[20px] border border-[#d5dbea] bg-white shadow-[0_20px_50px_rgba(18,21,40,.1)]">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e7f2] bg-[#f8fafc] px-5 py-4">
            <div>
              <p class="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#db2777]">Try a sample</p>
              <p class="mt-1 text-[13px] text-[#6b7389]">Simulated studio chat · Grounded production LLM in the portal waitlist</p>
            </div>
            <span class="inline-flex items-center gap-1.5 rounded-full border border-[rgba(219,39,119,.28)] bg-[rgba(219,39,119,.08)] px-2.5 py-1 text-[11px] font-semibold text-[#db2777]">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
              Beta preview
            </span>
          </div>
          <div class="flex flex-wrap gap-2 border-b border-[#e2e7f2] bg-white px-5 py-3" data-prompts></div>
          <div class="max-h-[340px] min-h-[280px] space-y-3 overflow-y-auto bg-[#f8fafc] px-5 py-4" data-chat></div>
          <div class="border-t border-[#e2e7f2] bg-white px-5 py-4">
            <div class="flex gap-2">
              <input data-input value="${escapeHtml(input)}" placeholder="Ask the preview studio…" class="h-11 flex-1 rounded-xl border border-[#d5dbea] bg-[#f8fafc] px-3.5 text-[13px] text-[#121528] outline-none placeholder:text-[#8a92a8] focus:border-[#db2777]/50" />
              <button type="button" data-send class="${btnPrimary} min-h-11 px-4" ${busy || !input.trim() ? "disabled" : ""}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 3 3 9-3 9 19-9Z"/><path d="M6 12h16"/></svg>
              </button>
            </div>
            <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p class="text-[12px] text-[#6b7389]">Want grounded answers over your transcripts &amp; tools?</p>
              <a class="${btnPrimary}" href="${cfg.portalSignupUrl || "#"}">Join LLM waitlist <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
            </div>
          </div>
        </div>
      `;

      const promptsEl = root.querySelector("[data-prompts]");
      prompts.forEach((item) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.disabled = busy;
        btn.className =
          "rounded-full border border-[#d5dbea] px-3 py-1.5 text-[12px] font-semibold text-[#5c6478] transition hover:border-[#db2777]/50 hover:bg-[rgba(219,39,119,.06)] hover:text-[#121528] disabled:opacity-50";
        btn.textContent = item.label;
        btn.addEventListener("click", () => runPrompt(item.id));
        promptsEl.appendChild(btn);
      });

      const chat = root.querySelector("[data-chat]");
      chat.innerHTML =
        messages
          .map((message) => {
            const isUser = message.role === "user";
            return `
            <div class="${cx("flex gap-2.5", isUser ? "justify-end" : "justify-start")}">
              ${
                !isUser
                  ? `<span class="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[rgba(219,39,119,.28)] bg-[rgba(219,39,119,.1)] text-[#db2777]"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg></span>`
                  : ""
              }
              <div class="${cx(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                isUser
                  ? "bg-white text-[#121528] ring-1 ring-[#e2e7f2]"
                  : "border border-[rgba(219,39,119,.2)] bg-[rgba(219,39,119,.08)] text-[#121528]",
              )}">${escapeHtml(message.content || (busy ? "…" : ""))}</div>
              ${
                isUser
                  ? `<span class="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[#d5dbea] bg-white text-[#6b7389]"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>`
                  : ""
              }
            </div>`;
          })
          .join("") +
        (busy
          ? `<div class="flex items-center gap-2 text-[12px] text-[#8a92a8]"><svg class="animate-spin text-[#db2777]" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Thinking…</div>`
          : "") +
        `<div data-end></div>`;

      chat.querySelector("[data-end]")?.scrollIntoView({ behavior: "smooth", block: "nearest" });

      const inputEl = root.querySelector("[data-input]");
      inputEl?.addEventListener("input", (e) => {
        input = e.target.value.slice(0, 240);
      });
      inputEl?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          input = inputEl.value.slice(0, 240);
          onSubmit();
        }
      });
      root.querySelector("[data-send]")?.addEventListener("click", () => {
        input = inputEl?.value.slice(0, 240) || "";
        onSubmit();
      });
    }

    render();
  }

  function init() {
    const root = document.getElementById("llm-demo-root");
    if (root) initLlmDemo(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
