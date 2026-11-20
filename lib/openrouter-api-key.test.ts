import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  GenerationError,
  fetchOpenRouterCompletion,
} from "@/lib/ai-generation";
import { DEFAULT_MODEL } from "@/lib/model-options";
import {
  MissingOpenRouterApiKeyError,
  openRouterAuthorizationHeader,
} from "@/lib/openrouter-api-key";

describe("openRouterAuthorizationHeader", () => {
  it("rejects a missing, empty, or blank API key", () => {
    for (const apiKey of [undefined, "", "   "]) {
      assert.throws(
        () => openRouterAuthorizationHeader(apiKey),
        (error: unknown) => {
          assert.ok(error instanceof MissingOpenRouterApiKeyError);
          assert.equal(
            error.message,
            "Server configuration error: OPENROUTER_API_KEY is not set.",
          );
          assert.equal(JSON.stringify(error).includes("Bearer"), false);
          return true;
        },
      );
    }
  });

  it("returns a bearer token for a trimmed key", () => {
    assert.equal(
      openRouterAuthorizationHeader(" sk-test "),
      "Bearer sk-test",
    );
  });
});

describe("fetchOpenRouterCompletion", () => {
  it("fails before calling OpenRouter when the API key is missing", async () => {
    const previous = process.env.OPENROUTER_API_KEY;
    process.env.OPENROUTER_API_KEY = "  ";
    let called = false;
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => {
      called = true;
      throw new Error("OpenRouter should not be called");
    }) as typeof fetch;

    try {
      await assert.rejects(
        () =>
          fetchOpenRouterCompletion(
            "prompt",
            DEFAULT_MODEL,
            "Workout Generator",
          ),
        (error: unknown) => {
          assert.ok(error instanceof GenerationError);
          assert.equal(error.status, 500);
          assert.equal(
            error.message,
            "Server configuration error: OPENROUTER_API_KEY is not set.",
          );
          return true;
        },
      );
      assert.equal(called, false);
    } finally {
      globalThis.fetch = originalFetch;
      if (previous === undefined) {
        delete process.env.OPENROUTER_API_KEY;
      } else {
        process.env.OPENROUTER_API_KEY = previous;
      }
    }
  });
});
