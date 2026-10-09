"use client";

import { ArrowRight, Loader2, Mic, Square, Waves } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { sttDemoSamples, type SttDemoSample } from "@/content/demos";
import { cx } from "@/lib/cn";
import {
  fetchPlaygroundStatus,
  PlaygroundApiError,
  runPlaygroundStt,
} from "@/lib/playground-api";
import { portalLoginUrl, portalSignupUrl, portalSttUrl } from "@/lib/site";

type Mode = "samples" | "mic";

const MAX_RECORD_MS = 15_000;

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: {
    resultIndex: number;
    results: ArrayLike<{
      isFinal: boolean;
      0: { transcript: string };
    }>;
  }) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type BrowserSpeechRecognitionCtor = new () => BrowserSpeechRecognition;

function getSpeechRecognitionCtor(): BrowserSpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: BrowserSpeechRecognitionCtor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function SttSampleDemo() {
  const [mode, setMode] = useState<Mode>("samples");
  const [activeId, setActiveId] = useState(sttDemoSamples[0].id);
  const [visibleCount, setVisibleCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [livePreviewSupported, setLivePreviewSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [previewOnly, setPreviewOnly] = useState(false);
  const [micError, setMicError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limit, setLimit] = useState(5);
  const [exhausted, setExhausted] = useState(false);
  const timerRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const maxTimerRef = useRef<number | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const finalPreviewRef = useRef("");
  const keepRecognizingRef = useRef(false);

  const active =
    sttDemoSamples.find((s) => s.id === activeId) ?? sttDemoSamples[0];

  useEffect(() => {
    setMicSupported(
      typeof window !== "undefined" &&
        Boolean(navigator.mediaDevices?.getUserMedia) &&
        typeof MediaRecorder !== "undefined",
    );
    setLivePreviewSupported(Boolean(getSpeechRecognitionCtor()));
    let cancelled = false;
    void fetchPlaygroundStatus("stt")
      .then((status) => {
        if (cancelled) return;
        setRemaining(status.remaining);
        setLimit(status.limit);
        setExhausted(status.exhausted);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
      if (maxTimerRef.current !== null) window.clearTimeout(maxTimerRef.current);
      stopMicTracks();
      stopLivePreview();
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

  const stopLivePreview = () => {
    keepRecognizingRef.current = false;
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
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
        // ignore
      }
    }
  };

  const stopMicTracks = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const startLivePreview = () => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;
    stopLivePreview();
    finalPreviewRef.current = "";
    keepRecognizingRef.current = true;
    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognition.onresult = (event) => {
      let interim = "";
      let finals = finalPreviewRef.current;
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const piece = result?.[0]?.transcript || "";
        if (result.isFinal) {
          finals = `${finals} ${piece}`.trim();
          finalPreviewRef.current = finals;
        } else {
          interim += piece;
        }
      }
      const next = `${finals} ${interim}`.trim();
      if (next) {
        setLiveText(next);
        setPreviewOnly(true);
      }
    };
    recognition.onerror = () => {
      // Browser STT is best-effort preview only; EBMA still runs on stop.
    };
    recognition.onend = () => {
      if (!keepRecognizingRef.current) return;
      try {
        recognition.start();
      } catch {
        // ignore restart races
      }
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      stopLivePreview();
    }
  };

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

  const finishRecording = async (blob: Blob) => {
    setListening(false);
    setTranscribing(true);
    setMicError("");
    try {
      const result = await runPlaygroundStt(blob, "playground.webm");
      setLiveText(result.transcript || "(No speech detected)");
      setPreviewOnly(false);
      setRemaining(result.remaining);
      setLimit(result.limit);
      setExhausted(result.remaining <= 0);
    } catch (err) {
      if (err instanceof PlaygroundApiError) {
        if (err.code === "trial_exhausted") {
          setExhausted(true);
          setRemaining(0);
          setMicError("Free STT trials used up. Sign in to continue in the portal.");
        } else if (err.code === "rate_limited") {
          setMicError(
            err.meta?.retryAfterSeconds
              ? `Please wait ${err.meta.retryAfterSeconds}s before trying again.`
              : "Please wait a moment before trying again.",
          );
        } else {
          setMicError(err.message);
        }
        if (typeof err.meta?.remaining === "number") setRemaining(err.meta.remaining);
        if (typeof err.meta?.limit === "number") setLimit(err.meta.limit);
      } else {
        setMicError("STT playground is unavailable right now.");
      }
    } finally {
      setTranscribing(false);
    }
  };

  const startMic = async () => {
    if (exhausted || transcribing) return;
    setMicError("");
    setLiveText("");
    setPreviewOnly(false);
    finalPreviewRef.current = "";
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stopLivePreview();
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        mediaRecorderRef.current = null;
        if (blob.size > 0) void finishRecording(blob);
        else {
          setListening(false);
          setMicError("No audio captured. Try again.");
        }
      };
      recorder.start(250);
      setListening(true);
      startLivePreview();
      if (maxTimerRef.current !== null) window.clearTimeout(maxTimerRef.current);
      maxTimerRef.current = window.setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      }, MAX_RECORD_MS);
    } catch {
      setMicError("Microphone permission denied or unavailable.");
      setListening(false);
      stopLivePreview();
    }
  };

  const stopMic = () => {
    if (maxTimerRef.current !== null) {
      window.clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
    stopLivePreview();
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    } else {
      stopMicTracks();
      setListening(false);
    }
  };

  const shown = active.segments.slice(0, Math.max(visibleCount, 0));

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#d5dbea] bg-white shadow-[0_20px_50px_rgba(18,21,40,.1)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e7f2] bg-[#f8fafc] px-5 py-4">
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#0284c7]">
            Try STT
          </p>
          <p className="mt-1 text-[13px] text-[#6b7389]">
            Samples are free · Live mic uses EBMA ASR (
            {remaining === null ? `${limit} free tries` : `${remaining} of ${limit} left`})
          </p>
        </div>
        <div className="flex rounded-full border border-[#d5dbea] bg-white p-1">
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
                : "text-[#6b7389]",
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
                : "text-[#6b7389]",
            )}
          >
            Live mic
          </button>
        </div>
      </div>

      {mode === "samples" ? (
        <div className="grid grid-cols-[220px_1fr] max-[820px]:grid-cols-1">
          <div className="border-r border-[#e2e7f2] p-3 max-[820px]:border-r-0 max-[820px]:border-b">
            {sttDemoSamples.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => playSample(sample)}
                className={cx(
                  "mb-1.5 w-full rounded-xl px-3 py-3 text-left transition",
                  activeId === sample.id
                    ? "bg-[rgba(2,132,199,.1)] text-[#121528] ring-1 ring-[#0284c7]/30"
                    : "text-[#5c6478] hover:bg-[#eef1f8]",
                )}
              >
                <span className="block text-[13px] font-semibold">{sample.title}</span>
                <span className="mt-1 block text-[11px] text-[#8a92a8]">
                  {sample.language} · {sample.duration}
                </span>
              </button>
            ))}
          </div>
          <div className="p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] text-[#5c6478]">{active.description}</p>
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
            <div className="min-h-[220px] rounded-xl border border-[#e2e7f2] bg-[#f8fafc] px-4 py-3">
              {shown.length === 0 ? (
                <p className="py-16 text-center text-[13px] text-[#8a92a8]">
                  Press <span className="font-semibold text-[#121528]">Run sample</span> to stream a
                  canned transcript.
                </p>
              ) : (
                shown.map((seg, idx) => (
                  <div
                    key={`${seg.time}-${idx}`}
                    className="border-b border-[#e2e7f2] py-3 last:border-b-0"
                  >
                    <div className="mb-1.5 flex flex-wrap gap-2">
                      <span className="rounded-md bg-[#0284c7] px-2 py-0.5 text-[11px] font-semibold text-white">
                        {seg.time}
                      </span>
                      {seg.speaker ? (
                        <span className="rounded-md bg-[#eef1f8] px-2 py-0.5 text-[11px] text-[#6b7389]">
                          {seg.speaker}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[16px] leading-relaxed text-[#121528]">{seg.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-[#5c6478]">
              {livePreviewSupported
                ? "Speak and see text appear live. Stop to confirm with EBMA ASR (1 free trial)."
                : "Record up to 15 seconds, then stop to run EBMA ASR (1 free trial)."}
            </p>
            {!exhausted && (
              <Button
                variant="primary"
                className="min-h-[38px] px-3.5 text-[12px]"
                disabled={!micSupported || transcribing}
                onClick={() => (listening ? stopMic() : void startMic())}
              >
                {transcribing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Confirming with EBMA…
                  </>
                ) : listening ? (
                  <>
                    <Square size={13} /> Stop & confirm
                  </>
                ) : (
                  <>
                    <Mic size={14} /> Start speaking
                  </>
                )}
              </Button>
            )}
          </div>
          {!micSupported && (
            <p className="mb-3 text-[12px] text-[#db2777]">
              Microphone recording needs a modern browser with MediaRecorder support.
            </p>
          )}
          {micError && <p className="mb-3 text-[12px] text-[#db2777]">{micError}</p>}

          {exhausted ? (
            <div className="rounded-xl border border-[#e9d5ff] bg-[#faf5ff] px-4 py-4">
              <p className="text-[13px] font-semibold text-[#121528]">Sign in to keep using STT</p>
              <p className="mt-1 text-[12px] text-[#6b7389]">
                Your free website trials are used. Create an account for live ASR, diarization, and
                exports.
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
            <div className="min-h-[220px] rounded-xl border border-[#e2e7f2] bg-[#f8fafc] px-4 py-4">
              {liveText ? (
                <div>
                  {previewOnly && (
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0284c7]">
                      Live preview
                    </p>
                  )}
                  {!previewOnly && !listening && !transcribing && (
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#059669]">
                      EBMA transcript
                    </p>
                  )}
                  <p
                    className={cx(
                      "text-[18px] leading-relaxed text-[#121528]",
                      previewOnly && "italic text-[#334155]",
                    )}
                  >
                    {liveText}
                    {listening && previewOnly ? (
                      <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-[#0284c7] align-middle" />
                    ) : null}
                  </p>
                </div>
              ) : (
                <p className="py-16 text-center text-[13px] text-[#8a92a8]">
                  {transcribing
                    ? "Confirming with EBMA ASR…"
                    : listening
                      ? livePreviewSupported
                        ? "Listening… text will appear as you speak."
                        : "Recording… speak clearly, then stop (max 15s)."
                      : "Start speaking to try a live transcription trial."}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e2e7f2] bg-[#f8fafc] px-5 py-4">
        <p className="text-[12px] text-[#6b7389]">
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
