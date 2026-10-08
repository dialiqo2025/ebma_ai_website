"use client";

import { ArrowRight, Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ttsDemoSamples } from "@/content/demos";
import { cx } from "@/lib/cn";
import { portalSignupUrl, portalTtsUrl } from "@/lib/site";

export function TtsSampleDemo() {
  const [sampleId, setSampleId] = useState(ttsDemoSamples[0].id);
  const [text, setText] = useState(ttsDemoSamples[0].text);
  const [langCode, setLangCode] = useState(ttsDemoSamples[0].langCode);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [rate, setRate] = useState(1);

  const active = useMemo(
    () => ttsDemoSamples.find((s) => s.id === sampleId) ?? ttsDemoSamples[0],
    [sampleId],
  );

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  const selectSample = (id: string) => {
    const sample = ttsDemoSamples.find((s) => s.id === id);
    if (!sample) return;
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setSampleId(sample.id);
    setText(sample.text);
    setLangCode(sample.langCode);
  };

  const speak = () => {
    if (!supported || !text.trim()) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text.trim());
    utter.lang = langCode;
    utter.rate = rate;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#d5dbea] bg-white shadow-[0_20px_50px_rgba(18,21,40,.1)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e7f2] bg-[#f8fafc] px-5 py-4">
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#7c3aed]">
            Try a sample
          </p>
          <p className="mt-1 text-[13px] text-[#6b7389]">
            Browser voice preview · Natural EBMA voices & clone in the portal
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[#6b7389]">
          <Volume2 size={14} className="text-[#7c3aed]" />
          Rate
          <input
            type="range"
            min={0.7}
            max={1.3}
            step={0.05}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-24 accent-[#7c3aed]"
          />
          <span className="w-8 tabular-nums text-[#121528]">{rate.toFixed(2)}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          {ttsDemoSamples.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => selectSample(sample.id)}
              className={cx(
                "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition",
                sampleId === sample.id
                  ? "border-[#7c3aed] bg-[rgba(124,58,237,.1)] text-[#121528]"
                  : "border-[#d5dbea] bg-white text-[#5c6478] hover:border-[#c5cce0] hover:bg-[#f0f3fa]",
              )}
            >
              {sample.label}
            </button>
          ))}
        </div>

        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#8a92a8]">
          Text to speak · {active.language}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 280))}
          rows={4}
          className="w-full resize-none rounded-xl border border-[#d5dbea] bg-[#f8fafc] px-4 py-3 text-[15px] leading-relaxed text-[#121528] outline-none placeholder:text-[#8a92a8] focus:border-[#5b4fe9]"
          placeholder="Type something to preview…"
        />
        <div className="mt-2 flex items-center justify-between text-[12px] text-[#8a92a8]">
          <span>Lang: {langCode}</span>
          <span>{text.length}/280</span>
        </div>

        {!supported && (
          <p className="mt-3 text-[12px] text-[#db2777]">
            Speech synthesis is unavailable in this browser.
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="primary"
            className="min-h-[40px] text-[12px]"
            disabled={!supported || !text.trim()}
            onClick={() => (speaking ? stop() : speak())}
          >
            {speaking ? (
              <>
                <Pause size={14} /> Stop
              </>
            ) : (
              <>
                <Play size={14} fill="currentColor" /> Play sample
              </>
            )}
          </Button>
          <Button
            variant="quiet"
            className="min-h-[40px] text-[12px]"
            onClick={() => {
              stop();
              setText(active.text);
              setLangCode(active.langCode);
            }}
          >
            Reset text
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e2e7f2] bg-[#f8fafc] px-5 py-4">
        <p className="text-[12px] text-[#6b7389]">
          Need production voices, downloads, and clone?
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="quiet" href={portalSignupUrl} className="min-h-[38px] text-[12px]">
            Create account
          </Button>
          <Button variant="primary" href={portalTtsUrl} className="min-h-[38px] text-[12px]">
            Open TTS playground <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
