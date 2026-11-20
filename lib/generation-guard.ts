export const GENERATION_PER_IP_LIMIT = 15;
export const GENERATION_GLOBAL_LIMIT = 40;
export const GENERATION_RATE_WINDOW_MS = 15 * 60 * 1000;
export const MAX_GENERATION_BODY_BYTES = 8 * 1024;

const GLOBAL_BUCKET = "*";
const MAX_TRACKED_CLIENTS = 2_000;

export class RequestGuardError extends Error {
  readonly status: number;
  readonly retryAfterSeconds?: number;

  constructor(message: string, status: number, retryAfterSeconds?: number) {
    super(message);
    this.name = "RequestGuardError";
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

type RuntimeEnv = NodeJS.ProcessEnv;

type RateLimiterOptions = {
  perIpLimit: number;
  globalLimit: number;
  windowMs: number;
  now?: () => number;
};

export type GenerationRateLimiter = {
  consume(client: string): void;
};

type GuardOptions = {
  limiter?: GenerationRateLimiter;
  env?: RuntimeEnv;
  maxBodyBytes?: number;
};

const defaultLimiter = createGenerationRateLimiter({
  perIpLimit: GENERATION_PER_IP_LIMIT,
  globalLimit: GENERATION_GLOBAL_LIMIT,
  windowMs: GENERATION_RATE_WINDOW_MS,
});

export function createGenerationRateLimiter(
  options: RateLimiterOptions,
): GenerationRateLimiter {
  const hits = new Map<string, number[]>();
  const now = options.now ?? Date.now;

  return {
    consume(client: string) {
      const currentTime = now();
      const ipStamps = freshHits(
        hits.get(client) ?? [],
        currentTime,
        options.windowMs,
      );
      const globalStamps = freshHits(
        hits.get(GLOBAL_BUCKET) ?? [],
        currentTime,
        options.windowMs,
      );
      const ipBlocked = ipStamps.length >= options.perIpLimit;
      const globalBlocked = globalStamps.length >= options.globalLimit;

      if (ipBlocked || globalBlocked) {
        hits.set(client, ipStamps);
        hits.set(GLOBAL_BUCKET, globalStamps);
        const retryAfterSeconds = Math.max(
          ipBlocked
            ? retryAfterSecondsFor(ipStamps, currentTime, options.windowMs)
            : 0,
          globalBlocked
            ? retryAfterSecondsFor(globalStamps, currentTime, options.windowMs)
            : 0,
        );
        throw new RequestGuardError(
          tooManyRequestsMessage(retryAfterSeconds),
          429,
          retryAfterSeconds,
        );
      }

      ipStamps.push(currentTime);
      globalStamps.push(currentTime);
      hits.delete(client);
      hits.set(client, ipStamps);
      hits.set(GLOBAL_BUCKET, globalStamps);
      pruneClients(hits, currentTime, options.windowMs);
    },
  };
}

export function clientKey(
  request: Request,
  env: RuntimeEnv = process.env,
): string {
  if (!env.VERCEL) {
    return "local";
  }

  // x-forwarded-for is client-controlled. Only platform-set headers count.
  const platformAddress =
    normalizeAddress(request.headers.get("x-vercel-forwarded-for")) ??
    normalizeAddress(request.headers.get("x-real-ip"));

  return platformAddress ?? "unidentified";
}

export async function readGuardedGenerationBody(
  request: Request,
  options: GuardOptions = {},
): Promise<unknown> {
  if (request.method !== "POST") {
    throw new RequestGuardError("Method not allowed.", 405);
  }

  assertSameOrigin(request, options.env ?? process.env);
  assertJsonContentType(request);
  assertDeclaredContentLength(
    request.headers.get("content-length"),
    options.maxBodyBytes ?? MAX_GENERATION_BODY_BYTES,
  );

  const limiter = options.limiter ?? defaultLimiter;
  limiter.consume(clientKey(request, options.env ?? process.env));

  const bytes = await readBodyWithLimit(
    request,
    options.maxBodyBytes ?? MAX_GENERATION_BODY_BYTES,
  );

  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw new RequestGuardError("Invalid JSON body.", 400);
  }
}

export function generationGuardResponse(error: RequestGuardError): Response {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  };

  if (error.retryAfterSeconds !== undefined) {
    headers["Retry-After"] = String(error.retryAfterSeconds);
  }

  return new Response(JSON.stringify({ error: error.message }), {
    status: error.status,
    headers,
  });
}

export function assertSameOrigin(
  request: Request,
  env: RuntimeEnv = process.env,
): void {
  const fetchSite = request.headers.get("sec-fetch-site")?.trim().toLowerCase();

  if (fetchSite && fetchSite !== "same-origin") {
    throw crossOriginError();
  }

  const hosts = allowedHosts(request, env);

  if (hosts.size === 0) {
    throw crossOriginError();
  }

  const origin = request.headers.get("origin");

  if (origin) {
    const originHost = parseHost(origin);

    if (!originHost || !hosts.has(originHost)) {
      throw crossOriginError();
    }
    return;
  }

  if (fetchSite === "same-origin") {
    return;
  }

  const referer = request.headers.get("referer");
  const refererHost = referer ? parseHost(referer) : null;

  if (refererHost && hosts.has(refererHost)) {
    return;
  }

  throw crossOriginError();
}

function crossOriginError(): RequestGuardError {
  return new RequestGuardError(
    "This action is only available from the workout generator site.",
    403,
  );
}

function assertJsonContentType(request: Request): void {
  const mediaType = request.headers
    .get("content-type")
    ?.split(";")[0]
    ?.trim()
    .toLowerCase();

  if (mediaType !== "application/json") {
    throw new RequestGuardError("Content-Type must be application/json.", 415);
  }
}

function assertDeclaredContentLength(
  header: string | null,
  maxBytes: number,
): void {
  if (header === null) {
    return;
  }

  const declared = header.trim();

  if (!/^\d+$/.test(declared)) {
    throw new RequestGuardError("Invalid content length.", 400);
  }

  if (Number(declared) > maxBytes) {
    throw new RequestGuardError("Request body is too large.", 413);
  }
}

async function readBodyWithLimit(
  request: Request,
  maxBytes: number,
): Promise<Uint8Array> {
  const stream = request.body;

  if (!stream) {
    return new Uint8Array();
  }

  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      if (!value) {
        continue;
      }

      total += value.byteLength;

      if (total > maxBytes) {
        throw new RequestGuardError("Request body is too large.", 413);
      }

      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }

  const body = new Uint8Array(total);
  let offset = 0;

  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return body;
}

function allowedHosts(
  request: Request,
  env: RuntimeEnv,
): Set<string> {
  const hosts = new Set<string>();
  const add = (value: string | null | undefined) => {
    const parsed = value ? parseHost(value.split(",")[0] ?? "") : null;

    if (parsed) {
      hosts.add(parsed);
    }
  };

  add(request.headers.get("host"));

  // Vercel overwrites this header. Off-platform it is client-controlled.
  if (env.VERCEL) {
    add(request.headers.get("x-forwarded-host"));
  }

  try {
    hosts.add(new URL(request.url).host.toLowerCase());
  } catch {
    // Ignore a malformed request URL and rely on the headers above.
  }

  return hosts;
}

function parseHost(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed || trimmed.toLowerCase() === "null") {
    return null;
  }

  try {
    const url = trimmed.includes("://")
      ? new URL(trimmed)
      : new URL(`http://${trimmed}`);

    if (url.username || url.password) {
      return null;
    }

    return url.host.toLowerCase();
  } catch {
    return null;
  }
}

function normalizeAddress(value: string | null): string | null {
  const first = value?.split(",")[0]?.trim().toLowerCase() ?? "";

  if (!first || first.length > 128 || !/^[0-9a-f:.]+$/.test(first)) {
    return null;
  }

  return first;
}

function freshHits(stamps: number[], now: number, windowMs: number): number[] {
  return stamps.filter((stamp) => now - stamp < windowMs);
}

function retryAfterSecondsFor(
  stamps: number[],
  now: number,
  windowMs: number,
): number {
  const oldest = stamps[0] ?? now;
  return Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
}

function tooManyRequestsMessage(retryAfterSeconds: number): string {
  if (retryAfterSeconds < 60) {
    const seconds = Math.max(1, retryAfterSeconds);
    return `Too many generation requests. Try again in ${seconds} ${
      seconds === 1 ? "second" : "seconds"
    }.`;
  }

  const minutes = Math.ceil(retryAfterSeconds / 60);
  return `Too many generation requests. Try again in ${minutes} ${
    minutes === 1 ? "minute" : "minutes"
  }.`;
}

function pruneClients(
  hits: Map<string, number[]>,
  now: number,
  windowMs: number,
): void {
  if (hits.size <= MAX_TRACKED_CLIENTS) {
    return;
  }

  for (const [key, stamps] of [...hits.entries()]) {
    if (key === GLOBAL_BUCKET) {
      continue;
    }

    if (freshHits(stamps, now, windowMs).length === 0) {
      hits.delete(key);
    }
  }

  for (const key of [...hits.keys()]) {
    if (hits.size <= MAX_TRACKED_CLIENTS) {
      return;
    }

    if (key === GLOBAL_BUCKET) {
      continue;
    }

    hits.delete(key);
  }
}
