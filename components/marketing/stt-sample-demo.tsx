"use client";

import { ArrowRight, Mic, Square, Waves } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { sttDemoSamples, type SttDemoSample } from "@/content/demos";
import { cx } from "@/lib/cn";
import { portalSignupUrl, portalSttUrl } from "@/lib/site";

type Mode = "samples" | "mic";

function getSpeechRecognitionCtor(): (new () => SpeechRecognition) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window &
    typeof globalThis & {
      SpeechRecognition?: new () => SpeechRecognition;
      webkitSpeechRecognition?: new () => SpeechRecognition;
    };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function SttSampleDemo() {
  const [mode, setMode] = useState<Mode>("samples");
  const [activeId, setActiveId] = useState(sttDemoSamples[0].id);
  const [visibleCount, setVisibleCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [micError, setMicError] = useState("");
  const timerRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const active =
    sttDemoSamples.find((s) => s.id === activeId) ?? sttDemoSamples[0];

  useEffect(() => {
    setMicSupported(Boolean(getSpeechRecognitionCtor()));
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
      recognitionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    setVisibleCount(0);
    setRunning(false);
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [activeId]);

  const playSample = (sample: SttDemoSample) => {
    setActiveId(sample.id);
    setRunning(true);
    setVisibleCount(0);
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    let i = 0;
    timerRef.current = window.setInterval(() => {
      i += 1;
      setVisibleCount(i);
      if (i >= sample.segments.length) {
        if (timerRef.current !== null) window.clearInterval(timerRef.current);
        timerRef.current = null;
        setRunning(false);
      }
    }, 900);
  };

  const stopSample = () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
    setRunning(false);
    setVisibleCount(active.segments.length);
  };

  const startMic = () => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setMicError("Live mic preview needs Chrome or Edge.");
      return;
    }
    setMicError("");
    setLiveText("");
    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let text = "";
      for (let i = 0; i < event.results.length; i += 1) {
        text += event.results[i][0].transcript;
        if (i < event.results.length - 1) text += " ";
      }
      setLiveText(text.trim());
    };
    recognition.onerror = () => {
      setMicError("Microphone permission denied or unavailable.");
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopMic = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  };

  const shown = active.segments.slice(0, Math.max(visibleCount, 0));

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#2a3358] bg-[#101426] shadow-[0_30px_70px_rgba(0,0,0,.35)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262d4d] px-5 py-4">
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#38bdf8]">
            Try a sample
          </p>
          <p className="mt-1 text-[13px] text-[#9aa5b8]">
            Browser preview · Full EBMA ASR, diarization & exports in the portal
          </p>
        </div>
        <div className="flex rounded-full border border-[#2f3a5c] bg-[#0d1224] p-1">
          <button
            type="button"
            onClick={() => {
              stopMic();
              setMode("samples");
            }}
            className={cx(
              "rounded-full px-3.5 py-1.5 text-[12px] font-semibold",
              mode === "samples"
                ? "bg-[linear-gradient(90deg,#3b82f6,#7c3aed)] text-white"
                : "text-[#9aa5b8]",
            )}
          >
            Samples
          </button>
          <button
            type="button"
            onClick={() => {
              stopSample();
              setMode("mic");
            }}
            className={cx(
              "rounded-full px-3.5 py-1.5 text-[12px] font-semibold",
              mode === "mic"
                ? "bg-[linear-gradient(90deg,#3b82f6,#7c3aed)] text-white"
                : "text-[#9aa5b8]",
            )}
          >
            Live mic
          </button>
        </div>
      </div>

      {mode === "samples" ? (
        <div className="grid grid-cols-[220px_1fr] max-[820px]:grid-cols-1">
          <div className="border-r border-[#262d4d] p-3 max-[820px]:border-r-0 max-[820px]:border-b">
            {sttDemoSamples.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => playSample(sample)}
                className={cx(
                  "mb-1.5 w-full rounded-xl px-3 py-3 text-left transition",
                  activeId === sample.id
                    ? "bg-[#1a2340] text-white"
                    : "text-[#aeb6c9] hover:bg-[#151c33]",
                )}
              >
                <span className="block text-[13px] font-semibold">{sample.title}</span>
                <span className="mt-1 block text-[11px] text-[#8b98ae]">
                  {sample.language} · {sample.duration}
                </span>
              </button>
            ))}
          </div>
          <div className="p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] text-[#a8b4c8]">{active.description}</p>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  className="min-h-[38px] px-3.5 text-[12px]"
                  onClick={() => (running ? stopSample() : playSample(active))}
                >
                  {running ? (
                    <>
                      <Square size={13} /> Stop
                    </>
                  ) : (
                    <>
                      <Waves size={14} /> Run sample
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="min-h-[220px] rounded-xl border border-[#1d2944] bg-[#0a1020] px-4 py-3">
              {shown.length === 0 ? (
                <p className="py-16 text-center text-[13px] text-[#7f8aa5]">
                  Press <span className="text-slate-300">Run sample</span> to stream a
                  canned transcript.
                </p>
              ) : (
                shown.map((seg, idx) => (
                  <div
                    key={`${seg.time}-${idx}`}
                    className="border-b border-[#1a243a] py-3 last:border-b-0"
                  >
                    <div className="mb-1.5 flex flex-wrap gap-2">
                      <span className="rounded-md bg-[#1d4ed8] px-2 py-0.5 text-[11px] font-semibold text-white">
                        {seg.time}
                      </span>
                      {seg.speaker ? (
                        <span className="rounded-md bg-[#1a2438] px-2 py-0.5 text-[11px] text-[#9aa8bf]">
                          {seg.speaker}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[16px] leading-relaxed text-white">{seg.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-[#a8b4c8]">
              Uses your browser&apos;s speech recognition for a quick feel. Switch to the
              portal for EBMA accuracy, speakers, and exports.
            </p>
            <Button
              variant="primary"
              className="min-h-[38px] px-3.5 text-[12px]"
              disabled={!micSupported}
              onClick={() => (listening ? stopMic() : startMic())}
            >
              {listening ? (
                <>
                  <Square size={13} /> Stop
                </>
              ) : (
                <>
                  <Mic size={14} /> Start listening
                </>
              )}
            </Button>
          </div>
          {!micSupported && (
            <p className="mb-3 text-[12px] text-[#ef6a82]">
              Live mic preview is best in Chrome or Edge.
            </p>
          )}
          {micError && <p className="mb-3 text-[12px] text-[#ef6a82]">{micError}</p>}
          <div className="min-h-[220px] rounded-xl border border-[#1d2944] bg-[#0a1020] px-4 py-4">
            {liveText ? (
              <p className="text-[18px] leading-relaxed text-white">{liveText}</p>
            ) : (
              <p className="py-16 text-center text-[13px] text-[#7f8aa5]">
                {listening
                  ? "Listening… speak clearly into your microphone."
                  : "Start listening to capture a live browser transcript."}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#262d4d] px-5 py-4">
        <p className="text-[12px] text-[#8b98ae]">
          Want diarization, SRT/VTT, and production ASR?
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="quiet" href={portalSignupUrl} className="min-h-[38px] text-[12px]">
            Create account
          </Button>
          <Button variant="primary" href={portalSttUrl} className="min-h-[38px] text-[12px]">
            Open STT playground <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
