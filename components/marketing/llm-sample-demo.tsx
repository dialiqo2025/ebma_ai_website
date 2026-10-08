"use client";

import { ArrowRight, Bot, Loader2, SendHorizontal, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { llmDemoPrompts } from "@/content/demos";
import { cx } from "@/lib/cn";
import { portalSignupUrl } from "@/lib/site";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function LlmSampleDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi — I’m the LLM Studio preview. Pick a prompt or type a question to see a simulated answer.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, busy]);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    [],
  );

  const streamReply = (promptText: string, replyText: string) => {
    if (busy) return;
    setBusy(true);
    const userId = `u-${Date.now()}`;
    const assistantId = `a-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", content: promptText },
      { id: assistantId, role: "assistant", content: "" },
    ]);

    let i = 0;
    const tick = () => {
      i += 1;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: replyText.slice(0, i) } : m,
        ),
      );
      if (i < replyText.length) {
        timers.current.push(window.setTimeout(tick, 12));
      } else {
        setBusy(false);
      }
    };
    timers.current.push(window.setTimeout(tick, 280));
  };

  const runPrompt = (id: string) => {
    const item = llmDemoPrompts.find((p) => p.id === id);
    if (!item) return;
    setInput("");
    streamReply(item.prompt, item.reply);
  };

  const onSubmit = () => {
    const text = input.trim();
    if (!text || busy) return;
    const matched =
      llmDemoPrompts.find(
        (p) =>
          text.toLowerCase().includes(p.label.toLowerCase()) ||
          p.prompt.toLowerCase().includes(text.toLowerCase().slice(0, 24)),
      ) ?? llmDemoPrompts[0];
    setInput("");
    streamReply(
      text,
      matched.reply +
        "\n\n(Preview response — full grounded LLM Studio unlocks in the portal.)",
    );
  };

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#d5dbea] bg-white shadow-[0_20px_50px_rgba(18,21,40,.1)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e7f2] bg-[#f8fafc] px-5 py-4">
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#db2777]">
            Try a sample
          </p>
          <p className="mt-1 text-[13px] text-[#6b7389]">
            Simulated studio chat · Grounded production LLM in the portal waitlist
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(219,39,119,.28)] bg-[rgba(219,39,119,.08)] px-2.5 py-1 text-[11px] font-semibold text-[#db2777]">
          <Sparkles size={12} /> Beta preview
        </span>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[#e2e7f2] bg-white px-5 py-3">
        {llmDemoPrompts.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={busy}
            onClick={() => runPrompt(item.id)}
            className="rounded-full border border-[#d5dbea] px-3 py-1.5 text-[12px] font-semibold text-[#5c6478] transition hover:border-[#db2777]/50 hover:bg-[rgba(219,39,119,.06)] hover:text-[#121528] disabled:opacity-50"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="max-h-[340px] min-h-[280px] space-y-3 overflow-y-auto bg-[#f8fafc] px-5 py-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cx(
              "flex gap-2.5",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            {message.role === "assistant" && (
              <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[rgba(219,39,119,.28)] bg-[rgba(219,39,119,.1)] text-[#db2777]">
                <Bot size={14} />
              </span>
            )}
            <div
              className={cx(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                message.role === "user"
                  ? "bg-white text-[#121528] ring-1 ring-[#e2e7f2]"
                  : "border border-[rgba(219,39,119,.2)] bg-[rgba(219,39,119,.08)] text-[#121528]",
              )}
            >
              {message.content || (busy ? "…" : "")}
            </div>
            {message.role === "user" && (
              <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[#d5dbea] bg-white text-[#6b7389]">
                <User size={14} />
              </span>
            )}
          </div>
        ))}
        {busy && (
          <div className="flex items-center gap-2 text-[12px] text-[#8a92a8]">
            <Loader2 size={13} className="animate-spin text-[#db2777]" /> Thinking…
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-[#e2e7f2] bg-white px-5 py-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 240))}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit();
            }}
            placeholder="Ask the preview studio…"
            className="h-11 flex-1 rounded-xl border border-[#d5dbea] bg-[#f8fafc] px-3.5 text-[13px] text-[#121528] outline-none placeholder:text-[#8a92a8] focus:border-[#db2777]/50"
          />
          <Button
            variant="primary"
            className="min-h-11 px-4"
            disabled={busy || !input.trim()}
            onClick={onSubmit}
          >
            <SendHorizontal size={16} />
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[12px] text-[#6b7389]">
            Want grounded answers over your transcripts & tools?
          </p>
          <Button variant="primary" href={portalSignupUrl} className="min-h-[38px] text-[12px]">
            Join LLM waitlist <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
