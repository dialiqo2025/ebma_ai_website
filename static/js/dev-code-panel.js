(function () {
  const samples = {
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
      html: `<span class="text-[#c084fc]">import</span> { EbmaAI } <span class="text-[#c084fc]">from</span> <span class="text-[#6dd5a5]">"@ebma/ai"</span>;

<span class="text-[#c084fc]">const</span> ebma = <span class="text-[#c084fc]">new</span> <span class="text-[#64b5ed]">EbmaAI</span>({
 apiKey: process.env.<span class="text-[#e5a667]">EBMA_API_KEY</span>
});

<span class="text-[#c084fc]">const</span> transcript = <span class="text-[#c084fc]">await</span> ebma.speech.<span class="text-[#64b5ed]">transcribe</span>({
 audio: audioFile,
 language: <span class="text-[#6dd5a5]">"auto"</span>,
 diarize: <span class="text-[#e5a667]">true</span>
});

console.<span class="text-[#64b5ed]">log</span>(transcript.text);`,
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
      html: `<span class="text-[#c084fc]">from</span> ebma <span class="text-[#c084fc]">import</span> EbmaAI

ebma = <span class="text-[#64b5ed]">EbmaAI</span>(api_key=os.environ[<span class="text-[#6dd5a5]">"EBMA_API_KEY"</span>])

transcript = ebma.speech.<span class="text-[#64b5ed]">transcribe</span>(
 audio=audio_file,
 language=<span class="text-[#6dd5a5]">"auto"</span>,
 diarize=<span class="text-[#e5a667]">True</span>,
)

<span class="text-[#64b5ed]">print</span>(transcript.text)`,
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
      html: `<span class="text-[#64b5ed]">curl</span> -X <span class="text-[#e5a667]">POST</span> <span class="text-[#6dd5a5]">"https://api.ebma.ai/v1/speech/transcribe"</span> \\
 -H <span class="text-[#6dd5a5]">"Authorization: Bearer $EBMA_API_KEY"</span> \\
 -H <span class="text-[#6dd5a5]">"Accept: application/json"</span> \\
 -H <span class="text-[#6dd5a5]">"Content-Type: multipart/form-data"</span> \\
 -H <span class="text-[#6dd5a5]">"X-Ebma-Client: marketing-demo"</span> \\
 -F <span class="text-[#6dd5a5]">"file=@/path/to/call-recording.wav"</span> \\
 -F <span class="text-[#6dd5a5]">"language=auto"</span> \\
 -F <span class="text-[#6dd5a5]">"model=ebma-asr-multilingual"</span> \\
 -F <span class="text-[#6dd5a5]">"diarize=true"</span> \\
 -F <span class="text-[#6dd5a5]">"timestamps=true"</span> \\
 -F <span class="text-[#6dd5a5]">"punctuate=true"</span> \\
 -F <span class="text-[#6dd5a5]">"speakers=2"</span> \\
 -F <span class="text-[#6dd5a5]">"format=json"</span> \\
 -F <span class="text-[#6dd5a5]">"webhook_url=https://example.com/webhooks/ebma"</span>`,
    },
  };

  // Node.js / Python tabs temporarily hidden — re-enable: ["node", "python", "curl"]
  const tabs = [/* "node", "python", */ "curl"];

  function cx(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  function initPanel(root) {
    if (!root || root.dataset.ebmaDevCodeBound === "1") return;
    root.dataset.ebmaDevCodeBound = "1";

    let lang = "curl";
    let copied = false;
    let copyTimer = null;

    function render() {
      const sample = samples[lang];
      root.innerHTML = `
        <div class="overflow-hidden rounded-[18px] border border-[#d5dbea] bg-white shadow-[0_35px_80px_rgba(18,21,40,.1)]">
          <div class="flex h-[54px] items-center gap-1 border-b border-[#e2e7f2] bg-[#f8fafc] px-[14px] text-[12px] text-[#6b7389] max-[560px]:gap-0" data-tabs></div>
          <pre class="m-0 min-h-[340px] overflow-auto bg-[#f8fafc] p-[28px_30px] font-mono text-xs leading-[2.1] text-[#374151] max-[560px]:px-[18px] max-[560px]:py-5 max-[560px]:text-[12px]"><code>${sample.html}</code></pre>
          <div class="flex h-11 items-center justify-between border-t border-[#e2e7f2] bg-[#f8fafc] px-[18px] text-[12px] text-[#6b7389]">
            <span class="flex items-center gap-[5px] text-success">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
              200 OK
            </span>
            <span>184 ms</span>
          </div>
        </div>
      `;

      const tabsEl = root.querySelector("[data-tabs]");
      tabs.forEach((id) => {
        const tab = samples[id];
        const active = lang === id;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = cx(
          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors",
          active
            ? "bg-white text-[#121528] shadow-[0_1px_3px_rgba(18,21,40,.08)]"
            : "hover:text-[#121528]",
        );
        btn.innerHTML = `${
          tab.badge
            ? `<span class="rounded px-[3px] py-px text-[10px] font-bold text-white ${tab.badgeClass}">${tab.badge}</span>`
            : ""
        }${tab.label}`;
        btn.addEventListener("click", () => {
          lang = id;
          render();
        });
        tabsEl.appendChild(btn);
      });

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className =
        "ml-auto inline-flex items-center gap-1.5 rounded-[7px] border border-[#d5dbea] bg-white px-2.5 py-1.5 text-[12px] text-[#5c6478] hover:bg-[#eef1f8]";
      copyBtn.innerHTML = copied
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-success" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg> Copied`
        : "Copy";
      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(samples[lang].plain);
          copied = true;
          render();
          if (copyTimer) window.clearTimeout(copyTimer);
          copyTimer = window.setTimeout(() => {
            copied = false;
            render();
          }, 1600);
        } catch {
          copied = false;
          render();
        }
      });
      tabsEl.appendChild(copyBtn);
    }

    render();
  }

  function init() {
    const root = document.getElementById("dev-code-panel-root");
    if (root) initPanel(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
