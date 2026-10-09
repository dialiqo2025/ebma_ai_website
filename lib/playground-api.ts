const trimSlash = (value: string) => value.replace(/\/$/, "");

export const API_BASE_URL = trimSlash(
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api/v1",
);

export type PlaygroundApi = "tts" | "stt";

export type PlaygroundTrialMeta = {
  remaining: number;
  limit: number;
  loginUrl?: string;
};

export type PlaygroundStatus = PlaygroundTrialMeta & {
  api: PlaygroundApi;
  used: number;
  exhausted: boolean;
};

export class PlaygroundApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
    public readonly meta?: Partial<PlaygroundTrialMeta> & { retryAfterSeconds?: number },
  ) {
    super(message);
    this.name = "PlaygroundApiError";
  }
}

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

async function parseJson<T>(response: Response): Promise<ApiEnvelope<T>> {
  let payload: ApiEnvelope<T> | null = null;
  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new PlaygroundApiError(
      "Unexpected playground response",
      "invalid_response",
      response.status,
    );
  }

  if (!response.ok || !payload.success) {
    const data = (payload.data ?? {}) as Partial<PlaygroundTrialMeta> & {
      code?: string;
      retryAfterSeconds?: number;
    };
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

export async function fetchPlaygroundStatus(api: PlaygroundApi): Promise<PlaygroundStatus> {
  const response = await fetch(`${API_BASE_URL}/playground/status?api=${api}`, {
    method: "GET",
    credentials: "omit",
  });
  const payload = await parseJson<PlaygroundStatus>(response);
  return payload.data;
}

export async function runPlaygroundTts(input: {
  text: string;
  language?: string;
}): Promise<
  PlaygroundTrialMeta & {
    api: "tts";
    mimeType: string;
    audioBase64: string;
  }
> {
  const response = await fetch(`${API_BASE_URL}/playground/tts`, {
    method: "POST",
    credentials: "omit",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: input.text,
      language: input.language || "en",
    }),
  });
  const payload = await parseJson<
    PlaygroundTrialMeta & { api: "tts"; mimeType: string; audioBase64: string }
  >(response);
  return payload.data;
}

export async function runPlaygroundStt(file: Blob, filename = "recording.webm") {
  const form = new FormData();
  form.append("file", file, filename);
  const response = await fetch(`${API_BASE_URL}/playground/stt`, {
    method: "POST",
    credentials: "omit",
    body: form,
  });
  const payload = await parseJson<
    PlaygroundTrialMeta & { api: "stt"; transcript: string }
  >(response);
  return payload.data;
}

export function audioBase64ToObjectUrl(base64: string, mimeType: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: mimeType || "audio/wav" });
  return URL.createObjectURL(blob);
}
