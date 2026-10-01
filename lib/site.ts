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

export const supportEmail = "hello@ebma.ai";
