const trimSlash = (value: string) => value.replace(/\/$/, "");

export const SITE_URL = trimSlash(
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001",
);

export const PORTAL_URL = trimSlash(
  process.env.NEXT_PUBLIC_PORTAL_URL || "http://localhost:3000",
);

export function portalPath(path = "/") {
  if (!path || path === "/") return PORTAL_URL;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${PORTAL_URL}${normalized}`;
}

/** Portal auth entry (signin) */
export const portalLoginUrl = portalPath("/");

/** Portal signup */
export const portalSignupUrl = portalPath("/?mode=signup");

/** Product playgrounds inside the portal */
export const portalSttUrl = portalPath("/platform/speech-to-text");
export const portalTtsUrl = portalPath("/platform/text-to-speech");
export const portalPlatformUrl = portalPath("/platform");

/** Marketing product pages */
export const productSttPath = "/products/speech-to-text";
export const productTtsPath = "/products/text-to-speech";
export const productLlmPath = "/products/llm";
export const pricingPath = "/pricing";

/** Standalone docs host (Sarvam-style subdomain). */
export const DOCS_URL = (
  process.env.NEXT_PUBLIC_DOCS_URL || "https://docs.ebma.ai"
).replace(/\/$/, "");

export function docsUrl(path = "/") {
  if (!path || path === "/") return DOCS_URL;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${DOCS_URL}${normalized}`;
}

export const docsPath = DOCS_URL;

export const supportEmail = "hello@ebma.ai";
