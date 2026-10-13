"use client";

import { Check } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cx } from "@/lib/cn";

type Lang = "node" | "python" | "curl";

const samples: Record<
  Lang,
  { label: string; badge?: string; badgeClass?: string; plain: string; lines: ReactNode }
> = {
  node: {
    label: "Node.js",
    badge: "TS",
    badgeClass: "bg-[#387cc4]",
    plain: `import { EbmaAI } from "@ebma/ai";

const ebma = new EbmaAI({
  apiKey: process.env.EBMA_API_KEY
});

const transcript = await ebma.speech.transcribe({
  audio: audioFile,
  language: "auto",
  diarize: true
});

console.log(transcript.text);`,
    lines: (
      <>
        <span className="text-[#c084fc]">import</span> {"{ EbmaAI }"}{" "}
        <span className="text-[#c084fc]">from</span>{" "}
        <span className="text-[#6dd5a5]">&quot;@ebma/ai&quot;</span>;
        {"\n\n"}
        <span className="text-[#c084fc]">const</span> ebma ={" "}
        <span className="text-[#c084fc]">new</span>{" "}
        <span className="text-[#64b5ed]">EbmaAI</span>({"{"}
        {"\n"} apiKey: process.env.
        <span className="text-[#e5a667]">EBMA_API_KEY</span>
        {"\n"}
        {"}"});
        {"\n\n"}
        <span className="text-[#c084fc]">const</span> transcript ={" "}
        <span className="text-[#c084fc]">await</span> ebma.speech.
        <span className="text-[#64b5ed]">transcribe</span>({"{"}
        {"\n"} audio: audioFile,
        {"\n"} language:{" "}
        <span className="text-[#6dd5a5]">&quot;auto&quot;</span>,
        {"\n"} diarize: <span className="text-[#e5a667]">true</span>
        {"\n"}
        {"}"});
        {"\n\n"}
        console.
        <span className="text-[#64b5ed]">log</span>(transcript.text);
      </>
    ),
  },
  python: {
    label: "Python",
    badge: "PY",
    badgeClass: "bg-[#3776ab]",
    plain: `from ebma import EbmaAI

ebma = EbmaAI(api_key=os.environ["EBMA_API_KEY"])

transcript = ebma.speech.transcribe(
    audio=audio_file,
    language="auto",
    diarize=True,
)

print(transcript.text)`,
    lines: (
      <>
        <span className="text-[#c084fc]">from</span> ebma{" "}
        <span className="text-[#c084fc]">import</span> EbmaAI
        {"\n\n"}
        ebma = <span className="text-[#64b5ed]">EbmaAI</span>(api_key=os.environ[
        <span className="text-[#6dd5a5]">&quot;EBMA_API_KEY&quot;</span>])
        {"\n\n"}
        transcript = ebma.speech.
        <span className="text-[#64b5ed]">transcribe</span>(
        {"\n"} audio=audio_file,
        {"\n"} language=
        <span className="text-[#6dd5a5]">&quot;auto&quot;</span>,
        {"\n"} diarize=
        <span className="text-[#e5a667]">True</span>,
        {"\n"})
        {"\n\n"}
        <span className="text-[#64b5ed]">print</span>(transcript.text)
      </>
    ),
  },
  curl: {
    label: "cURL",
    badge: "API",
    badgeClass: "bg-[#6542e8]",
    plain: `curl -X POST "https://api.ebma.ai/v1/speech/transcribe" \\
  -H "Authorization: Bearer $EBMA_API_KEY" \\
  -H "Accept: application/json" \\
  -H "Content-Type: multipart/form-data" \\
  -H "X-Ebma-Client: marketing-demo" \\
  -F "file=@/path/to/call-recording.wav" \\
  -F "language=auto" \\
  -F "model=ebma-asr-multilingual" \\
  -F "diarize=true" \\
  -F "timestamps=true" \\
  -F "punctuate=true" \\
  -F "speakers=2" \\
  -F "format=json" \\
  -F "webhook_url=https://example.com/webhooks/ebma"`,
    lines: (
      <>
        <span className="text-[#64b5ed]">curl</span> -X{" "}
        <span className="text-[#e5a667]">POST</span>{" "}
        <span className="text-[#6dd5a5]">
          &quot;https://api.ebma.ai/v1/speech/transcribe&quot;
        </span>{" "}
        \
        {"\n"} -H{" "}
        <span className="text-[#6dd5a5]">
          &quot;Authorization: Bearer $EBMA_API_KEY&quot;
        </span>{" "}
        \
        {"\n"} -H{" "}
        <span className="text-[#6dd5a5]">
          &quot;Accept: application/json&quot;
        </span>{" "}
        \
        {"\n"} -H{" "}
        <span className="text-[#6dd5a5]">
          &quot;Content-Type: multipart/form-data&quot;
        </span>{" "}
        \
        {"\n"} -H{" "}
        <span className="text-[#6dd5a5]">
          &quot;X-Ebma-Client: marketing-demo&quot;
        </span>{" "}
        \
        {"\n"} -F{" "}
        <span className="text-[#6dd5a5]">
          &quot;file=@/path/to/call-recording.wav&quot;
        </span>{" "}
        \
        {"\n"} -F{" "}
        <span className="text-[#6dd5a5]">&quot;language=auto&quot;</span> \
        {"\n"} -F{" "}
        <span className="text-[#6dd5a5]">
          &quot;model=ebma-asr-multilingual&quot;
        </span>{" "}
        \
        {"\n"} -F{" "}
        <span className="text-[#6dd5a5]">&quot;diarize=true&quot;</span> \
        {"\n"} -F{" "}
        <span className="text-[#6dd5a5]">&quot;timestamps=true&quot;</span> \
        {"\n"} -F{" "}
        <span className="text-[#6dd5a5]">&quot;punctuate=true&quot;</span> \
        {"\n"} -F{" "}
        <span className="text-[#6dd5a5]">&quot;speakers=2&quot;</span> \
        {"\n"} -F{" "}
        <span className="text-[#6dd5a5]">&quot;format=json&quot;</span> \
        {"\n"} -F{" "}
        <span className="text-[#6dd5a5]">
          &quot;webhook_url=https://example.com/webhooks/ebma&quot;
        </span>
      </>
    ),
  },
};

// Node.js / Python tabs temporarily hidden — re-enable: ["node", "python", "curl"]
const tabs: Lang[] = [/* "node", "python", */ "curl"];

export function DevCodePanel() {
  const [lang, setLang] = useState<Lang>("curl");
  const [copied, setCopied] = useState(false);
  const sample = samples[lang];

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(sample.plain);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[18px] border border-[#d5dbea] bg-white shadow-[0_35px_80px_rgba(18,21,40,.1)]">
      <div className="flex h-[54px] items-center gap-1 border-b border-[#e2e7f2] bg-[#f8fafc] px-[14px] text-[12px] text-[#6b7389] max-[560px]:gap-0">
        {tabs.map((id) => {
          const tab = samples[id];
          const active = lang === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setLang(id)}
              className={cx(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors",
                active
                  ? "bg-white text-[#121528] shadow-[0_1px_3px_rgba(18,21,40,.08)]"
                  : "hover:text-[#121528]",
              )}
            >
              {tab.badge ? (
                <span
                  className={cx(
                    "rounded px-[3px] py-px text-[10px] font-bold text-white",
                    tab.badgeClass,
                  )}
                >
                  {tab.badge}
                </span>
              ) : null}
              {tab.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => void onCopy()}
          className="ml-auto inline-flex items-center gap-1.5 rounded-[7px] border border-[#d5dbea] bg-white px-2.5 py-1.5 text-[12px] text-[#5c6478] hover:bg-[#eef1f8]"
        >
          {copied ? <Check size={12} className="text-success" /> : null}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="m-0 min-h-[340px] overflow-auto bg-[#f8fafc] p-[28px_30px] font-mono text-xs leading-[2.1] text-[#374151] max-[560px]:px-[18px] max-[560px]:py-5 max-[560px]:text-[12px]">
        <code>{sample.lines}</code>
      </pre>
      <div className="flex h-11 items-center justify-between border-t border-[#e2e7f2] bg-[#f8fafc] px-[18px] text-[12px] text-[#6b7389]">
        <span className="flex items-center gap-[5px] text-success">
          <Check size={13} /> 200 OK
        </span>
        <span>184 ms</span>
      </div>
    </div>
  );
}
