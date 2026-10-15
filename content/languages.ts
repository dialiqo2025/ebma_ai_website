export type SupportedLanguage = {
  code: string;
  name: string;
  /** Native-script “a” (or Latin A for English) shown in the honeycomb cell */
  initial: string;
  /** Short native greeting / sample phrase for interactive preview */
  sample: string;
};

/** Native-script initials keyed by STT language code. */
const LANGUAGE_INITIALS: Record<string, string> = {
  hi: "अ",
  en: "A",
  bn: "অ",
  ta: "அ",
  te: "అ",
  mr: "अ",
  gu: "અ",
  kn: "ಅ",
  ml: "അ",
  pa: "ਅ",
  or: "ଅ",
  ur: "ا",
  as: "অ",
  ne: "अ",
  sa: "अ",
  sd: "ا",
  ks: "ا",
  kok: "अ",
  mai: "अ",
  doi: "अ",
  brx: "ब",
  mni: "ꯑ",
  sat: "ᱚ",
  bho: "अ",
  hne: "अ",
  bgc: "अ",
  bhb: "अ",
};

/** Native sample phrases for interactive honeycomb preview. */
const LANGUAGE_SAMPLES: Record<string, string> = {
  hi: "नमस्ते",
  en: "Hello",
  bn: "নমস্কার",
  ta: "வணக்கம்",
  te: "నమస్కారం",
  mr: "नमस्कार",
  gu: "નમસ્તે",
  kn: "ನಮಸ್ಕಾರ",
  ml: "നമസ്കാരം",
  pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
  or: "ନମସ୍କାର",
  ur: "السلام علیکم",
  as: "নমস্কাৰ",
  ne: "नमस्ते",
  sa: "नमस्ते",
  sd: "سلام",
  ks: "آداب",
  kok: "नमस्कार",
  mai: "प्रणाम",
  doi: "नमस्ते",
  brx: "खुलुम",
  mni: "ꯈꯨꯔꯨꯝꯖꯔꯤ",
  sat: "ᱡᱚᱦᱟᱨ",
  bho: "प्रणाम",
  hne: "नमस्कार",
  bgc: "राम राम",
  bhb: "जय श्री",
};

/**
 * Fallback catalog (matches backend `STT_LANGUAGES`, excluding `auto`).
 * Used when `/playground/languages` is unavailable.
 */
export function languageInitial(code: string, name: string): string {
  if (LANGUAGE_INITIALS[code]) return LANGUAGE_INITIALS[code]!;
  const letter = name.trim().charAt(0);
  return letter ? letter.toUpperCase() : "?";
}

export function languageSample(code: string, name: string): string {
  if (LANGUAGE_SAMPLES[code]) return LANGUAGE_SAMPLES[code]!;
  return name;
}

function buildLanguage(code: string, name: string): SupportedLanguage {
  return {
    code,
    name,
    initial: languageInitial(code, name),
    sample: languageSample(code, name),
  };
}

export const supportedLanguages: SupportedLanguage[] = [
  buildLanguage("hi", "Hindi"),
  buildLanguage("en", "English (Indian)"),
  buildLanguage("bn", "Bengali"),
  buildLanguage("ta", "Tamil"),
  buildLanguage("te", "Telugu"),
  buildLanguage("mr", "Marathi"),
  buildLanguage("gu", "Gujarati"),
  buildLanguage("kn", "Kannada"),
  buildLanguage("ml", "Malayalam"),
  buildLanguage("pa", "Punjabi"),
  buildLanguage("or", "Odia"),
  buildLanguage("ur", "Urdu"),
  buildLanguage("as", "Assamese"),
  buildLanguage("ne", "Nepali"),
  buildLanguage("sa", "Sanskrit"),
  buildLanguage("sd", "Sindhi"),
  buildLanguage("ks", "Kashmiri"),
  buildLanguage("kok", "Konkani"),
  buildLanguage("mai", "Maithili"),
  buildLanguage("doi", "Dogri"),
  buildLanguage("brx", "Bodo"),
  buildLanguage("mni", "Manipuri"),
  buildLanguage("sat", "Santali"),
  buildLanguage("bho", "Bhojpuri"),
  buildLanguage("hne", "Chhattisgarhi"),
  buildLanguage("bgc", "Haryanvi"),
  buildLanguage("bhb", "Bhili"),
];

export function mapApiLanguages(
  items: Array<{ code: string; name: string }>,
): SupportedLanguage[] {
  return items
    .filter((item) => item.code && item.code !== "auto")
    .map((item) => buildLanguage(item.code, item.name));
}
