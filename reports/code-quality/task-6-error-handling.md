# Task 6: Error-Handling Audit

## Assessment

The repo had a small number of error-handling hotspots, and most of them were boundary handlers rather than truly unnecessary defensive code. The real issue was not the presence of `try/catch` itself, but the use of silent fallbacks that hid upstream failures and made debugging harder.

The two main problems were:

- `lib/utils.ts` swallowed non-OK response bodies with `response.json().catch(() => ({}))`, which discarded useful error text when the API returned plain text or malformed JSON.
- `app/api/workout/route.ts` fell back to an empty OpenRouter API key and an empty workout content string, which masked both server misconfiguration and upstream response-shape drift.

## What I Changed

- `lib/utils.ts`
  - Replaced the silent JSON fallback in `fetchWorkout` with explicit response-body reading.
  - Preserved the actual error message from the server when possible instead of defaulting to `{}`.
  - Consolidated the request type to `WorkoutRequest` so the client and server use the same validated shape.

- `app/api/workout/route.ts`
  - Replaced the empty-string API key fallback with an explicit 500 when `OPENROUTER_API_KEY` is missing.
  - Replaced the empty-string model-content fallback with an explicit 502 when OpenRouter returns no workout content.
  - Standardized error responses to JSON throughout the route.
  - Improved upstream error logging so the returned body is visible in logs instead of being hidden behind a generic message.

## Removed vs Retained

Removed:

- `response.json().catch(() => ({}))` in the client fetch helper.
- `OPENROUTER_API_KEY ?? ""` in the API route.
- `data.choices?.[0]?.message?.content || ""` in the API route.
- Plain-text fallback responses from the API route when JSON is expected by the client.

Retained:

- `request.json()` parsing catch in the API route, because invalid request bodies are a real boundary condition.
- `parseWorkoutJSON()` parsing catch, because the OpenRouter model output is untrusted external text.
- `copyToClipboard()` catch, because clipboard access is a browser permission / availability boundary.
- `useWorkoutSubmit()` catch, because the UI needs to turn transport failures into user-facing state.

## Recommendation

Keep treating external input and external services as the only legitimate reason to catch. If a failure can be expressed as a normal validation error, return a structured error immediately. If a failure is purely a runtime/environment issue, fail explicitly instead of substituting a default value.

One residual gap remains: clipboard failures are still only logged. That is acceptable for now because the UI has no dedicated error surface for copy actions, but if copy reliability matters, the next step should be an explicit copy-error state in the UI instead of a silent false return.
