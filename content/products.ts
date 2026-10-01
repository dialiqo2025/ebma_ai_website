export type ProductFeature = {
  title: string;
  description: string;
};

export type ProductCapability = {
  label: string;
  value: string;
};

export type ProductUseCase = {
  title: string;
  description: string;
};

export type ProductFaq = {
  question: string;
  answer: string;
};

export type ProductPageContent = {
  slug: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  primaryCta: { label: string; hrefKey: "stt" | "tts" | "signup" | "platform" };
  secondaryCta: { label: string; href: string };
  accent: "cyan" | "violet" | "pink";
  highlights: string[];
  features: ProductFeature[];
  capabilities: ProductCapability[];
  useCases: ProductUseCase[];
  faqs: ProductFaq[];
  codeSample?: {
    language: string;
    code: string;
  };
};

export const sttProduct: ProductPageContent = {
  slug: "speech-to-text",
  eyebrow: "Speech to text",
  title: "Turn speech into",
  highlight: "accurate, structured text.",
  description:
    "Live microphone streaming and long-form file transcription with speaker labels, multilingual output modes, and export-ready captions—built for real conversations, accents, and noisy environments.",
  primaryCta: { label: "Try in playground", hrefKey: "stt" },
  secondaryCta: { label: "Start building free", href: "/#contact" },
  accent: "cyan",
  highlights: [
    "Live WebSocket streaming",
    "File upload up to hours of audio",
    "Speaker diarization",
    "TXT · SRT · VTT · JSON export",
  ],
  features: [
    {
      title: "Live transcription",
      description:
        "Stream microphone audio over WebSocket and watch phrases finalize as speakers pause—ideal for agents, captions, and assistive UX.",
    },
    {
      title: "Long-form file ASR",
      description:
        "Upload audio or video, poll job status, and retrieve a full transcript with optional speaker identification.",
    },
    {
      title: "Output modes that fit your product",
      description:
        "Native script, mixed, or romanized output so Indic and multilingual content lands in the format your UI needs.",
    },
    {
      title: "Speaker-aware results",
      description:
        "Diarize conversations and keep labels consistent across segments for meetings, support calls, and interviews.",
    },
    {
      title: "Caption-ready exports",
      description:
        "Copy plain text or download TXT, SRT, VTT, and JSON—same action pattern for live sessions and file jobs.",
    },
    {
      title: "Built for production control",
      description:
        "Language selection, end-silence tuning, partials, and history so teams can iterate without leaving the console.",
    },
  ],
  capabilities: [
    { label: "Input", value: "Live mic PCM · file audio/video" },
    { label: "Languages", value: "Auto-detect + Indic & English codes" },
    { label: "Modes", value: "Native · Mixed · Romanized" },
    { label: "Diarization", value: "Optional speakers (auto or fixed count)" },
    { label: "Exports", value: "TXT, SRT, VTT, JSON" },
    { label: "Transport", value: "REST + WebSocket" },
  ],
  useCases: [
    {
      title: "Contact centers",
      description:
        "Transcribe calls, attribute speakers, and feed QA or CRM workflows with structured transcripts.",
    },
    {
      title: "Media & captions",
      description:
        "Generate SRT/VTT from recordings for editors, OTT pipelines, and accessibility teams.",
    },
    {
      title: "Voice agents",
      description:
        "Stream low-latency partials and finals into dialog systems that need phrase-by-phrase text.",
    },
    {
      title: "Meetings & research",
      description:
        "Upload long recordings, identify speakers, and export JSON for analytics or note-taking tools.",
    },
  ],
  faqs: [
    {
      question: "Can I transcribe both live audio and uploaded files?",
      answer:
        "Yes. Use live microphone streaming for real-time phrases, or upload audio/video files for batch transcription with progress polling.",
    },
    {
      question: "Do you support speaker labels?",
      answer:
        "File transcription supports optional speaker identification. Choose automatic detection or set an expected speaker count when you know the roster.",
    },
    {
      question: "Which download formats are available?",
      answer:
        "Completed jobs support TXT, SRT, and VTT via the API, plus a client JSON export in the playground. Live sessions can export the same formats from finalized phrases.",
    },
    {
      question: "How do output modes work?",
      answer:
        "Choose native script, mixed, or romanized so the transcript matches how your product displays Indic and multilingual text.",
    },
  ],
  codeSample: {
    language: "TypeScript",
    code: `const job = await ebma.stt.transcribeFile({
  file: audioFile,
  language: "auto",
  diarize: true,
  speakers: 8,
});

const result = await ebma.stt.wait(job.id);
console.log(result.transcript);`,
  },
};

export const ttsProduct: ProductPageContent = {
  slug: "text-to-speech",
  eyebrow: "Text to speech",
  title: "Voices that feel",
  highlight: "natural—and shippable.",
  description:
    "Generate expressive speech from text with language-aware controls, playback while generating, and optional voice clone workflows when your backend supports them.",
  primaryCta: { label: "Try in playground", hrefKey: "tts" },
  secondaryCta: { label: "Start building free", href: "/#contact" },
  accent: "violet",
  highlights: [
    "Natural multilingual speech",
    "Speed & pitch controls",
    "Play while generating",
    "Voice clone UI (when enabled)",
  ],
  features: [
    {
      title: "Human-sounding synthesis",
      description:
        "Turn product copy, agent replies, and content scripts into speech that is clear enough for customer-facing experiences.",
    },
    {
      title: "Language-aware generation",
      description:
        "Select the target language for synthesis and keep generation settings consistent across your catalog.",
    },
    {
      title: "Playback & iteration",
      description:
        "Preview audio in the console, download results, regenerate failed jobs, and keep a history of generations.",
    },
    {
      title: "Prosody controls",
      description:
        "Tune speed and pitch so voiceovers, IVR prompts, and assistants match your brand energy.",
    },
    {
      title: "Voice clone path",
      description:
        "When clone mode is available, attach a sample and transcript so custom voices stay grounded in real speech.",
    },
    {
      title: "API-first workflow",
      description:
        "Create generations, trigger synthesis, poll status, and stream or download audio blobs for your apps.",
    },
  ],
  capabilities: [
    { label: "Input", value: "Text (character-limited per plan)" },
    { label: "Languages", value: "Indic + global language options" },
    { label: "Voice modes", value: "Default · Clone (when enabled)" },
    { label: "Controls", value: "Speed · Pitch · Output format" },
    { label: "Playback", value: "In-console play + download" },
    { label: "Transport", value: "REST create / generate / audio" },
  ],
  useCases: [
    {
      title: "Product voiceovers",
      description:
        "Narrate onboarding, explainers, and marketing clips without a studio session for every edit.",
    },
    {
      title: "IVR & notifications",
      description:
        "Generate consistent prompts for telephony and alert systems across languages.",
    },
    {
      title: "Assistants & agents",
      description:
        "Speak model responses aloud with low-friction regenerate and replay loops for builders.",
    },
    {
      title: "Accessibility",
      description:
        "Offer listen-along experiences for documentation, education, and support content.",
    },
  ],
  faqs: [
    {
      question: "Can I preview audio before shipping?",
      answer:
        "Yes. The playground lets you generate, play, download, and regenerate speech so you can iterate before wiring production.",
    },
    {
      question: "Is voice cloning available?",
      answer:
        "Clone mode appears in the UI when the management API advertises it. You’ll typically provide a short sample and what was spoken in that sample.",
    },
    {
      question: "Which formats can I download?",
      answer:
        "Output formats come from TTS options (for example WAV). Completed generations can be downloaded as audio blobs from the portal.",
    },
    {
      question: "How do speed and pitch work?",
      answer:
        "Each generation accepts speed and pitch within the ranges exposed by the TTS options endpoint so you can keep brand voice consistent.",
    },
  ],
  codeSample: {
    language: "TypeScript",
    code: `const generation = await ebma.tts.create({
  text: "नमस्ते, welcome to ebma AI.",
  language: "hi",
  speed: 1,
  pitch: 1,
});

await ebma.tts.generate(generation.id);
const audio = await ebma.tts.download(generation.id);`,
  },
};

export const llmProduct: ProductPageContent = {
  slug: "llm",
  eyebrow: "LLM Studio",
  title: "Language intelligence",
  highlight: "with context that sticks.",
  description:
    "Build assistants that understand your domain—summarize conversations, answer with grounding, and connect tools—powered by modern LLM capabilities in the ebma stack.",
  primaryCta: { label: "Join the waitlist", hrefKey: "signup" },
  secondaryCta: { label: "Talk to our team", href: "mailto:hello@ebma.ai" },
  accent: "pink",
  highlights: [
    "Gemini-powered reasoning",
    "Long-context workflows",
    "Tool-ready agents",
    "Voice + language stack",
  ],
  features: [
    {
      title: "Answers with context",
      description:
        "Ground responses in your product knowledge, transcripts, and support content so answers stay useful—not generic.",
    },
    {
      title: "Conversation memory",
      description:
        "Design multi-turn experiences that keep thread state for agents, copilots, and internal tools.",
    },
    {
      title: "Summaries that ship",
      description:
        "Turn long STT transcripts into decisions: summaries, action items, and structured extraction.",
    },
    {
      title: "Tool calling ready",
      description:
        "Connect business systems so the model can fetch, update, and act—not just chat.",
    },
    {
      title: "Composable with voice",
      description:
        "Pair LLM Studio with STT and TTS for end-to-end listen → understand → speak loops.",
    },
    {
      title: "Studio for builders",
      description:
        "Prompt, evaluate, and iterate in a dedicated console surface as the product rolls out of beta.",
    },
  ],
  capabilities: [
    { label: "Status", value: "Beta / coming to console" },
    { label: "Models", value: "Gemini-class reasoning stack" },
    { label: "Inputs", value: "Text · transcripts · knowledge" },
    { label: "Outputs", value: "Chat · summaries · structured JSON" },
    { label: "Integrations", value: "Tools · STT · TTS" },
    { label: "Access", value: "Portal waitlist via signup" },
  ],
  useCases: [
    {
      title: "Support copilots",
      description:
        "Summarize tickets and calls, draft replies, and retrieve policy snippets for agents.",
    },
    {
      title: "Meeting intelligence",
      description:
        "Convert diarized transcripts into agendas, decisions, and follow-ups.",
    },
    {
      title: "Voice agents",
      description:
        "Combine ASR, LLM reasoning, and TTS for natural spoken product experiences.",
    },
    {
      title: "Internal knowledge Q&A",
      description:
        "Let teams ask questions against docs and operational data with cited answers.",
    },
  ],
  faqs: [
    {
      question: "Is LLM Studio available today?",
      answer:
        "It’s listed as beta in the platform. Sign up to get portal access and be first in line as the studio unlocks.",
    },
    {
      question: "How does it work with STT and TTS?",
      answer:
        "Use speech-to-text for input, LLM Studio for understanding and actions, then text-to-speech for spoken replies—one platform stack.",
    },
    {
      question: "Can we bring our own knowledge?",
      answer:
        "The design target is grounded assistants over your content and transcripts. Exact connectors will land with the studio release.",
    },
    {
      question: "Who should join the waitlist?",
      answer:
        "Product, CX, and AI teams building copilots, voice agents, or transcript analytics on top of ebma.",
    },
  ],
  codeSample: {
    language: "TypeScript",
    code: `const answer = await ebma.llm.chat({
  messages: [
    { role: "system", content: "You are an ebma support copilot." },
    { role: "user", content: "Summarize this call transcript…" },
  ],
  tools: ["searchKnowledge", "createTicket"],
});`,
  },
};

export const products = [sttProduct, ttsProduct, llmProduct] as const;

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug) ?? null;
}
