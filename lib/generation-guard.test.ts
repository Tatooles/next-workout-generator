import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  GENERATION_GLOBAL_LIMIT,
  GENERATION_PER_IP_LIMIT,
  GENERATION_RATE_WINDOW_MS,
  MAX_GENERATION_BODY_BYTES,
  RequestGuardError,
  clientKey,
  createGenerationRateLimiter,
  generationGuardResponse,
  readGuardedGenerationBody,
} from "@/lib/generation-guard";

const validBody = JSON.stringify({
  bodyParts: ["Chest"],
  workoutType: "Push Workout",
});

function generationRequest(
  body?: BodyInit | null,
  headers: Record<string, string> = {},
  url = "http://localhost:3000/api/workout",
) {
  return new Request(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: new URL(url).origin,
      "sec-fetch-site": "same-origin",
      ...headers,
    },
    body,
    duplex: body instanceof ReadableStream ? "half" : undefined,
  });
}

function testLimiter(
  perIpLimit: number,
  globalLimit = 100,
  windowMs = 60_000,
  now: () => number = Date.now,
) {
  return createGenerationRateLimiter({
    perIpLimit,
    globalLimit,
    windowMs,
    now,
  });
}

async function expectGuardError(
  request: Request,
  options?: Parameters<typeof readGuardedGenerationBody>[1],
) {
  try {
    await readGuardedGenerationBody(request, options);
  } catch (error) {
    assert.ok(error instanceof RequestGuardError);
    return error;
  }

  assert.fail("expected RequestGuardError");
}

describe("generation request guard", () => {
  it("accepts the same-origin JSON request the page sends", async () => {
    const body = await readGuardedGenerationBody(generationRequest(validBody), {
      limiter: testLimiter(5),
    });

    assert.deepEqual(body, {
      bodyParts: ["Chest"],
      workoutType: "Push Workout",
    });
  });

  it("accepts a same-origin browser request that omits Origin", async () => {
    const request = generationRequest(validBody, {
      origin: "",
      "sec-fetch-site": "same-origin",
    });
    request.headers.delete("origin");

    const body = await readGuardedGenerationBody(request, {
      limiter: testLimiter(5),
    });

    assert.deepEqual(body, JSON.parse(validBody));
  });

  it("accepts a matching Referer when Origin is absent", async () => {
    const request = generationRequest(
      validBody,
      { referer: "http://localhost:3000/" },
      "http://localhost:3000/api/program",
    );
    request.headers.delete("origin");
    request.headers.delete("sec-fetch-site");

    const body = await readGuardedGenerationBody(request, {
      limiter: testLimiter(5),
    });

    assert.deepEqual(body, JSON.parse(validBody));
  });

  it("rejects cross-origin requests before spending a rate-limit slot", async () => {
    const limiter = testLimiter(1);
    const error = await expectGuardError(
      generationRequest(validBody, { origin: "https://evil.example" }),
      { limiter },
    );

    assert.equal(error.status, 403);
    assert.match(error.message, /workout generator site/);

    const body = await readGuardedGenerationBody(generationRequest(validBody), {
      limiter,
    });
    assert.deepEqual(body, JSON.parse(validBody));
  });

  it("rejects browser requests that are not same-origin", async () => {
    const error = await expectGuardError(
      generationRequest(validBody, { "sec-fetch-site": "cross-site" }),
    );

    assert.equal(error.status, 403);
  });

  it("rejects requests with no origin evidence", async () => {
    const request = generationRequest(validBody);
    request.headers.delete("origin");
    request.headers.delete("sec-fetch-site");

    const error = await expectGuardError(request);
    assert.equal(error.status, 403);
  });

  it("rejects an origin that only looks like the site host", async () => {
    const error = await expectGuardError(
      generationRequest(validBody, {
        origin: "https://evil.example@localhost:3000",
      }),
    );

    assert.equal(error.status, 403);
  });

  it("rejects a non-JSON content type", async () => {
    const error = await expectGuardError(
      generationRequest(validBody, { "content-type": "text/plain" }),
    );

    assert.equal(error.status, 415);
  });

  it("rejects invalid JSON", async () => {
    const error = await expectGuardError(generationRequest("{"), {
      limiter: testLimiter(5),
    });
    assert.equal(error.status, 400);
    assert.equal(error.message, "Invalid JSON body.");
  });

  it("accepts a JSON media type with a charset", async () => {
    const body = await readGuardedGenerationBody(
      generationRequest(validBody, {
        "content-type": "application/json; charset=utf-8",
      }),
      { limiter: testLimiter(5) },
    );

    assert.deepEqual(body, JSON.parse(validBody));
  });

  it("accepts the public Vercel host when the internal URL differs", async () => {
    const body = await readGuardedGenerationBody(
      generationRequest(
        validBody,
        {
          origin: "https://workout-generator-zeta.vercel.app",
          "x-forwarded-host": "workout-generator-zeta.vercel.app",
        },
        "http://localhost:3000/api/workout",
      ),
      { limiter: testLimiter(5), env: { VERCEL: "1" } },
    );

    assert.deepEqual(body, JSON.parse(validBody));
  });

  it("ignores a forged forwarded host off Vercel", async () => {
    const error = await expectGuardError(
      generationRequest(validBody, {
        origin: "https://evil.example",
        "x-forwarded-host": "evil.example",
      }),
      { limiter: testLimiter(5), env: {} },
    );

    assert.equal(error.status, 403);
  });

  it("rejects a declared body larger than 8 KB before rate limiting", async () => {
    const limiter = testLimiter(1);
    const request = generationRequest(validBody);
    request.headers.set(
      "content-length",
      String(MAX_GENERATION_BODY_BYTES + 1),
    );

    const error = await expectGuardError(request, { limiter });
    assert.equal(error.status, 413);

    const body = await readGuardedGenerationBody(generationRequest(validBody), {
      limiter,
    });
    assert.deepEqual(body, JSON.parse(validBody));
  });

  it("rejects a stream that grows past the body cap", async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("x".repeat(64)));
        controller.close();
      },
    });
    const error = await expectGuardError(
      generationRequest(stream, {}, "http://localhost:3000/api/workout"),
      { limiter: testLimiter(5), maxBodyBytes: 32 },
    );

    assert.equal(error.status, 413);
  });

  it("limits repeated generation attempts for one client", async () => {
    let now = 1_000;
    const limiter = testLimiter(2, 10, 1_000, () => now);
    const options = { limiter, env: { VERCEL: "1" } };
    const headers = { "x-vercel-forwarded-for": "203.0.113.10" };

    assert.deepEqual(
      await readGuardedGenerationBody(
        generationRequest(validBody, headers),
        options,
      ),
      JSON.parse(validBody),
    );
    await readGuardedGenerationBody(
      generationRequest(validBody, headers),
      options,
    );

    const blocked = await expectGuardError(
      generationRequest(validBody, headers),
      options,
    );
    assert.equal(blocked.status, 429);
    assert.equal(blocked.retryAfterSeconds, 1);
    assert.match(blocked.message, /1 second/);

    const response = generationGuardResponse(blocked);
    assert.equal(response.status, 429);
    assert.equal(response.headers.get("retry-after"), "1");
    assert.equal(response.headers.get("cache-control"), "no-store");

    now += 1_000;
    await readGuardedGenerationBody(
      generationRequest(validBody, headers),
      options,
    );
  });

  it("does not let a forged forwarding header dodge the limit", async () => {
    const limiter = testLimiter(1);
    const options = { limiter, env: { VERCEL: "1" } };

    await readGuardedGenerationBody(
      generationRequest(validBody, { "x-forwarded-for": "1.1.1.1" }),
      options,
    );
    const blocked = await expectGuardError(
      generationRequest(validBody, { "x-forwarded-for": "2.2.2.2" }),
      options,
    );

    assert.equal(blocked.status, 429);
    assert.equal(
      clientKey(
        generationRequest(validBody, {
          "x-forwarded-for": "8.8.8.8",
          "x-real-ip": "203.0.113.8",
        }),
        { VERCEL: "1" },
      ),
      "203.0.113.8",
    );
  });

  it("does not retain clients rejected by the process cap", () => {
    const limiter = testLimiter(5, 1);

    limiter.consume("203.0.113.1");
    assert.equal(limiter.trackedClientCount(), 1);

    for (let index = 0; index < 100; index += 1) {
      assert.throws(
        () => limiter.consume(`198.51.100.${index}`),
        (error: unknown) => error instanceof RequestGuardError,
      );
    }

    assert.equal(limiter.trackedClientCount(), 1);
  });

  it("tracks platform client addresses separately and enforces the process cap", async () => {
    const limiter = testLimiter(5, 2);
    const options = { limiter, env: { VERCEL: "1" } };

    await readGuardedGenerationBody(
      generationRequest(validBody, {
        "x-vercel-forwarded-for": "203.0.113.1, 10.0.0.1",
      }),
      options,
    );
    await readGuardedGenerationBody(
      generationRequest(validBody, { "x-vercel-forwarded-for": "203.0.113.2" }),
      options,
    );
    const blocked = await expectGuardError(
      generationRequest(validBody, { "x-vercel-forwarded-for": "203.0.113.3" }),
      options,
    );

    assert.equal(blocked.status, 429);
  });

  it("shares one local bucket when the app is not on Vercel", () => {
    const request = generationRequest(validBody, {
      "x-vercel-forwarded-for": "203.0.113.9",
      "x-forwarded-for": "198.51.100.9",
    });

    assert.equal(clientKey(request, {}), "local");
  });

  it("uses the published limits", () => {
    assert.equal(GENERATION_PER_IP_LIMIT, 15);
    assert.equal(GENERATION_GLOBAL_LIMIT, 40);
    assert.equal(GENERATION_RATE_WINDOW_MS, 15 * 60 * 1000);
    assert.equal(MAX_GENERATION_BODY_BYTES, 8 * 1024);
  });
});
