"use client";

import { ArrowRight, Loader2, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ttsDemoSamples } from "@/content/demos";
import { cx } from "@/lib/cn";
import {
  audioBase64ToObjectUrl,
  fetchPlaygroundStatus,
  PlaygroundApiError,
  runPlaygroundTts,
} from "@/lib/playground-api";
import { portalLoginUrl, portalSignupUrl, portalTtsUrl } from "@/lib/site";

const MAX_CHARS = 200;

export function TtsSampleDemo() {
  const [sampleId, setSampleId] = useState(ttsDemoSamples[0].id);
  const [text, setText] = useState(ttsDemoSamples[0].text.slice(0, MAX_CHARS));
  const [langCode, setLangCode] = useState(ttsDemoSamples[0].langCode);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limit, setLimit] = useState(5);
  const [exhausted, setExhausted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const active = useMemo(
    () => ttsDemoSamples.find((s) => s.id === sampleId) ?? ttsDemoSamples[0],
    [sampleId],
  );

  useEffect(() => {
    let cancelled = false;
    void fetchPlaygroundStatus("tts")
      .then((status) => {
        if (cancelled) return;
        setRemaining(status.remaining);
        setLimit(status.limit);
        setExhausted(status.exhausted);
      })
      .catch(() => {
        /* status is best-effort */
      });
    return () => {
      cancelled = true;
      stopAudio();
    };
  }, []);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setSpeaking(false);
  };

  const selectSample = (id: string) => {
    const sample = ttsDemoSamples.find((s) => s.id === id);
    if (!sample) return;
    stopAudio();
    setSampleId(sample.id);
    setText(sample.text.slice(0, MAX_CHARS));
    setLangCode(sample.langCode);
    setError("");
  };

  const speak = async () => {
    if (!text.trim() || loading || exhausted) return;
    stopAudio();
    setLoading(true);
    setError("");

    try {
      const result = await runPlaygroundTts({
        text: text.trim(),
        language: langCode.startsWith("hi") ? "hi" : "en",
      });
      setRemaining(result.remaining);
      setLimit(result.limit);
      setExhausted(result.remaining <= 0);

      const url = audioBase64ToObjectUrl(result.audioBase64, result.mimeType);
      objectUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setSpeaking(false);
      audio.onerror = () => {
        setSpeaking(false);
        setError("Could not play generated audio.");
      };
      setSpeaking(true);
      await audio.play();
    } catch (err) {
      if (err instanceof PlaygroundApiError) {
        if (err.code === "trial_exhausted") {
          setExhausted(true);
          setRemaining(0);
          setError("Free TTS trials used up. Sign in to continue in the portal.");
        } else if (err.code === "rate_limited") {
          setError(
            err.meta?.retryAfterSeconds
              ? `Please wait ${err.meta.retryAfterSeconds}s before trying again.`
              : "Please wait a moment before trying again.",
          );
        } else {
          setError(err.message);
        }
        if (typeof err.meta?.remaining === "number") setRemaining(err.meta.remaining);
        if (typeof err.meta?.limit === "number") setLimit(err.meta.limit);
      } else {
        setError("TTS playground is unavailable right now.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#d5dbea] bg-white shadow-[0_20px_50px_rgba(18,21,40,.1)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e7f2] bg-[#f8fafc] px-5 py-4">
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#7c3aed]">
            Live TTS trial
          </p>
          <p className="mt-1 text-[13px] text-[#6b7389]">
            Real EBMA voices · {remaining === null ? `${limit} free tries` : `${remaining} of ${limit} left`}
          </p>
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
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          rows={4}
          disabled={exhausted}
          className="w-full resize-none rounded-xl border border-[#d5dbea] bg-[#f8fafc] px-4 py-3 text-[15px] leading-relaxed text-[#121528] outline-none placeholder:text-[#8a92a8] focus:border-[#9B5CF6] disabled:opacity-60"
          placeholder="Type something to generate…"
        />
        <div className="mt-2 flex items-center justify-between text-[12px] text-[#8a92a8]">
          <span>Lang: {langCode}</span>
          <span>
            {text.length}/{MAX_CHARS}
          </span>
        </div>

        {error && <p className="mt-3 text-[12px] text-[#db2777]">{error}</p>}

        {exhausted ? (
          <div className="mt-4 rounded-xl border border-[#e9d5ff] bg-[#faf5ff] px-4 py-3">
            <p className="text-[13px] font-semibold text-[#121528]">Sign in to keep using TTS</p>
            <p className="mt-1 text-[12px] text-[#6b7389]">
              Your free website trials are used. Create an account for full voices, clone, and downloads.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="primary" href={portalLoginUrl} className="min-h-[38px] text-[12px]">
                Sign in
              </Button>
              <Button variant="quiet" href={portalSignupUrl} className="min-h-[38px] text-[12px]">
                Create account
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="primary"
              className="min-h-[40px] text-[12px]"
              disabled={!text.trim() || loading}
              onClick={() => (speaking ? stopAudio() : void speak())}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Generating…
                </>
              ) : speaking ? (
                <>
                  <Pause size={14} /> Stop
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" /> Generate & play
                </>
              )}
            </Button>
            <Button
              variant="quiet"
              className="min-h-[40px] text-[12px]"
              onClick={() => {
                stopAudio();
                setText(active.text.slice(0, MAX_CHARS));
                setLangCode(active.langCode);
                setError("");
              }}
            >
              Reset text
            </Button>
          </div>
        )}
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
