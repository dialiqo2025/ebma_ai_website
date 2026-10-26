(function () {
  const LANGUAGE_INITIALS = {
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
    es: "A",
    fr: "A",
    de: "A",
    ar: "ا",
    ja: "あ",
    zh: "中",
    ko: "가",
    ru: "А",
    pt: "A",
    th: "ก",
  };

  const LANGUAGE_SAMPLES = {
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
    es: "¡Hola!",
    fr: "Bonjour",
    de: "Hallo",
    ar: "مرحبا",
    ja: "こんにちは",
    zh: "你好",
    ko: "안녕하세요",
    ru: "Привет",
    pt: "Olá",
    th: "สวัสดี",
  };

  function languageInitial(code, name) {
    if (LANGUAGE_INITIALS[code]) return LANGUAGE_INITIALS[code];
    const letter = name.trim().charAt(0);
    return letter ? letter.toUpperCase() : "?";
  }

  function languageSample(code, name) {
    if (LANGUAGE_SAMPLES[code]) return LANGUAGE_SAMPLES[code];
    return name;
  }

  function buildLanguage(code, name) {
    return {
      code,
      name,
      initial: languageInitial(code, name),
      sample: languageSample(code, name),
    };
  }

  const showcaseLanguages = [
    buildLanguage("es", "Spanish"),
    buildLanguage("fr", "French"),
    buildLanguage("de", "German"),
    buildLanguage("ar", "Arabic"),
    buildLanguage("ja", "Japanese"),
    buildLanguage("zh", "Mandarin"),
    buildLanguage("ko", "Korean"),
    buildLanguage("ru", "Russian"),
    buildLanguage("pt", "Portuguese"),
    buildLanguage("th", "Thai"),
  ];

  const supportedLanguages = [
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
    ...showcaseLanguages,
  ];

  function withShowcaseLanguages(list) {
    const seen = new Set(list.map((item) => item.code));
    const extras = showcaseLanguages.filter((item) => !seen.has(item.code));
    return extras.length ? [...list, ...extras] : list;
  }

  function mapApiLanguages(items) {
    return withShowcaseLanguages(
      items
        .filter((item) => item.code && item.code !== "auto")
        .map((item) => buildLanguage(item.code, item.name)),
    );
  }

  window.EBMA_LANGUAGES = {
    supportedLanguages,
    showcaseLanguages,
    languageInitial,
    languageSample,
    mapApiLanguages,
    withShowcaseLanguages,
  };
})();
