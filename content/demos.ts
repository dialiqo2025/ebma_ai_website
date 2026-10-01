export type SttDemoSegment = {
  time: string;
  speaker?: string;
  text: string;
};

export type SttDemoSample = {
  id: string;
  title: string;
  language: string;
  duration: string;
  description: string;
  segments: SttDemoSegment[];
};

export type TtsDemoSample = {
  id: string;
  label: string;
  language: string;
  langCode: string;
  text: string;
};

export type LlmDemoPrompt = {
  id: string;
  label: string;
  prompt: string;
  reply: string;
};

export const llmDemoPrompts: LlmDemoPrompt[] = [
  {
    id: "summarize",
    label: "Summarize call",
    prompt: "Summarize this support call and list next actions.",
    reply:
      "Summary: The customer asked about upgrading their plan and requested last month’s invoice.\n\nNext actions:\n1. Share upgrade options for the current workspace.\n2. Email the invoice to the account owner.\n3. Confirm whether auto-renew should stay enabled.",
  },
  {
    id: "extract",
    label: "Extract entities",
    prompt: "Extract language, speakers, and intent from the transcript.",
    reply:
      "{\n  \"language\": \"en-IN\",\n  \"speakers\": [\"Agent\", \"Customer\"],\n  \"intent\": \"billing_and_upgrade\",\n  \"urgency\": \"medium\"\n}",
  },
  {
    id: "reply",
    label: "Draft reply",
    prompt: "Draft a polite agent reply confirming the upgrade path.",
    reply:
      "Thanks for your patience. I can move you to the Growth plan today and email last month’s invoice within a few minutes. Would you like me to enable the upgrade now, or send a comparison first?",
  },
  {
    id: "voice",
    label: "Voice agent plan",
    prompt: "How should STT, LLM, and TTS work together for a voice agent?",
    reply:
      "1. STT streams speech → text with low latency.\n2. LLM reasons over the transcript + tools/knowledge.\n3. TTS speaks the response naturally.\n\nKeep turns short, confirm critical actions, and log the full transcript for QA.",
  },
];

export const sttDemoSamples: SttDemoSample[] = [
  {
    id: "support-call",
    title: "Support call",
    language: "English (India)",
    duration: "0:18",
    description: "Two-speaker customer support snippet with diarized labels.",
    segments: [
      {
        time: "0:00",
        speaker: "Agent",
        text: "Thank you for calling Dial IQO Technologies. How can I help you today?",
      },
      {
        time: "0:05",
        speaker: "Customer",
        text: "Hi, I need help upgrading my plan and checking last month's invoice.",
      },
      {
        time: "0:11",
        speaker: "Agent",
        text: "Sure. I can walk you through the upgrade options and send the invoice to your email.",
      },
    ],
  },
  {
    id: "hindi-meeting",
    title: "Team sync",
    language: "Hindi",
    duration: "0:14",
    description: "Short Hindi meeting excerpt with native-script output.",
    segments: [
      {
        time: "0:00",
        speaker: "Speaker 1",
        text: "नमस्ते टीम, आज हम स्पीच टू टेक्स्ट डेमो को फाइनल करेंगे।",
      },
      {
        time: "0:05",
        speaker: "Speaker 2",
        text: "जी, डायराइज़ेशन और एक्सपोर्ट फॉर्मैट दोनों टेस्ट कर लिए हैं।",
      },
      {
        time: "0:10",
        speaker: "Speaker 1",
        text: "बढ़िया। फिर लाइव प्लेग्राउंड में भी एक बार चला लेते हैं।",
      },
    ],
  },
  {
    id: "ivr",
    title: "IVR menu",
    language: "English",
    duration: "0:12",
    description: "Single-speaker IVR prompt—good for caption export demos.",
    segments: [
      {
        time: "0:00",
        text: "Welcome to ebma AI. For speech to text, press 1. For text to speech, press 2. To speak with an operator, press 0.",
      },
    ],
  },
];

export const ttsDemoSamples: TtsDemoSample[] = [
  {
    id: "hi-welcome",
    label: "Hindi welcome",
    language: "Hindi",
    langCode: "hi-IN",
    text: "नमस्ते, ebma AI में आपका स्वागत है। आवाज़ और भाषा की बुद्धिमत्ता, एक ही प्लेटफ़ॉर्म पर।",
  },
  {
    id: "en-product",
    label: "Product line",
    language: "English",
    langCode: "en-IN",
    text: "Intelligence that speaks your language. Build voice agents, captions, and assistants with ebma AI.",
  },
  {
    id: "en-support",
    label: "Support prompt",
    language: "English",
    langCode: "en-US",
    text: "Thanks for waiting. Your ticket has been updated, and a specialist will call you within two minutes.",
  },
  {
    id: "ta-short",
    label: "Tamil short",
    language: "Tamil",
    langCode: "ta-IN",
    text: "வணக்கம். ebma AI உங்கள் குரலை உரையாக மாற்ற உதவுகிறது.",
  },
];
