(function () {
  const API_BASE_URL = window.EBMA_CONFIG?.API_BASE_URL || "http://localhost:5001/api/v1";

  class PlaygroundApiError extends Error {
    constructor(message, code, status, meta) {
      super(message);
      this.name = "PlaygroundApiError";
      this.code = code;
      this.status = status;
      this.meta = meta;
    }
  }

  async function parseJson(response) {
    let payload = null;
    try {
      payload = await response.json();
    } catch {
      throw new PlaygroundApiError(
        "Unexpected playground response",
        "invalid_response",
        response.status,
      );
    }

    if (!response.ok || !payload.success) {
      const data = payload.data ?? {};
      throw new PlaygroundApiError(
        payload.message || "Playground request failed",
        data.code || "request_failed",
        response.status,
        {
          remaining: data.remaining,
          limit: data.limit,
          loginUrl: data.loginUrl,
          retryAfterSeconds: data.retryAfterSeconds,
        },
      );
    }

    return payload;
  }

  async function fetchPlaygroundStatus(api) {
    const response = await fetch(`${API_BASE_URL}/playground/status?api=${api}`, {
      method: "GET",
      credentials: "omit",
    });
    const payload = await parseJson(response);
    return payload.data;
  }

  async function fetchPlaygroundLanguages() {
    const response = await fetch(`${API_BASE_URL}/playground/languages`, {
      method: "GET",
      credentials: "omit",
    });
    const payload = await parseJson(response);
    return payload.data.languages ?? [];
  }

  async function runPlaygroundTts(input) {
    const response = await fetch(`${API_BASE_URL}/playground/tts`, {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: input.text,
        language: input.language || "en",
      }),
    });
    const payload = await parseJson(response);
    return payload.data;
  }

  async function runPlaygroundStt(file, filename) {
    const form = new FormData();
    form.append("file", file, filename || "recording.webm");
    const response = await fetch(`${API_BASE_URL}/playground/stt`, {
      method: "POST",
      credentials: "omit",
      body: form,
    });
    const payload = await parseJson(response);
    return payload.data;
  }

  function audioBase64ToObjectUrl(base64, mimeType) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: mimeType || "audio/wav" });
    return URL.createObjectURL(blob);
  }

  async function fetchPublicPricing(signal) {
    const response = await fetch(`${API_BASE_URL}/billing/public/pricing`, {
      method: "GET",
      cache: "no-store",
      credentials: "omit",
      signal,
    });

    const payload = await response.json();
    if (!response.ok || !payload.success || !payload.data) {
      throw new Error(payload.message || "Current pricing is unavailable");
    }
    return payload.data;
  }

  async function submitContactInquiry(input) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20_000);
    let response;
    try {
      response = await fetch(`${API_BASE_URL}/contact/inquiries`, {
        method: "POST",
        credentials: "omit",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Email delivery took too long. Please email our team directly.");
      }
      throw new Error("We could not reach the contact service. Please email our team directly.");
    } finally {
      window.clearTimeout(timeout);
    }

    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.success) {
      throw new Error(
        payload?.message || "We could not send your inquiry. Please email our team directly.",
      );
    }
    return payload.data;
  }

  window.EBMA_API = {
    PlaygroundApiError,
    fetchPlaygroundStatus,
    fetchPlaygroundLanguages,
    runPlaygroundTts,
    runPlaygroundStt,
    audioBase64ToObjectUrl,
    fetchPublicPricing,
    submitContactInquiry,
  };
})();
