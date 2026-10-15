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

/** Portal dashboard (authenticated workspace home) */
export const portalDashboardUrl = portalPlatformUrl;

/** Shared cookie set by the portal on `.ebma.ai` after login. */
export const PORTAL_SESSION_HINT_COOKIE = "ebma-session-active";

export function hasPortalSessionHint(): boolean {
  if (typeof document === "undefined") return false;
  return new RegExp(`(?:^|; )${PORTAL_SESSION_HINT_COOKIE}=1(?:;|$)`).test(
    document.cookie,
  );
}

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

export const supportEmail =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "hello@ebma.ai";

/** Fallback until the live recipient arrives with the public pricing response. */
export const customPricingEmail =
  process.env.NEXT_PUBLIC_CUSTOM_PRICING_TO_EMAIL || supportEmail;
