(function () {
  const trimSlash = (value) => value.replace(/\/$/, "");

  const SITE_URL = trimSlash("http://localhost:3001");
  const PORTAL_URL = trimSlash("http://localhost:3000");
  const API_BASE_URL = trimSlash("http://localhost:5001/api/v1");
  const DOCS_URL = trimSlash("https://docs.ebma.ai");
  const supportEmail = "hello@ebma.ai";
  const customPricingEmail = supportEmail;

  function portalPath(path) {
    if (!path || path === "/") return PORTAL_URL;
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${PORTAL_URL}${normalized}`;
  }

  function docsUrl(path) {
    if (!path || path === "/") return DOCS_URL;
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${DOCS_URL}${normalized}`;
  }

  window.EBMA_CONFIG = {
    SITE_URL,
    PORTAL_URL,
    API_BASE_URL,
    DOCS_URL,
    supportEmail,
    customPricingEmail,
    PORTAL_SESSION_HINT_COOKIE: "ebma-session-active",
    portalLoginUrl: portalPath("/"),
    portalSignupUrl: portalPath("/?mode=signup"),
    portalSttUrl: portalPath("/platform/speech-to-text"),
    portalTtsUrl: portalPath("/platform/text-to-speech"),
    portalPlatformUrl: portalPath("/platform"),
    portalDashboardUrl: portalPath("/platform"),
    productSttPath: "/products/speech-to-text",
    productTtsPath: "/products/text-to-speech",
    productLlmPath: "/products/llm",
    pricingPath: "/pricing",
    portalPath,
    docsUrl,
  };
})();
