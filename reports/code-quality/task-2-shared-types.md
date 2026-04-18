# Task 2: Shared Type Audit

I audited every `type`, `interface`, and `type alias` in `app/`, `components/`, and `lib/` by searching the repo-wide type definitions and then checking how each one is consumed.

## Assessment

The repo is already fairly disciplined about type locality. Most `Props` interfaces are only used by a single component, which is the right tradeoff for a small Next.js app. There is no sign of a type dump that would benefit from a large central shared-types module.

The one real cross-module duplication was the workout request payload shape:

- `lib/utils.ts` had a separate `WorkoutParams` interface for API submission.
- `lib/workout-options.ts` already exported `WorkoutRequest` from the schema used by the prompt builder and API route.

Those should be the same contract. Keeping both made the request boundary drift-prone for no benefit.

I also tightened one local type that was already using an indirect lookup instead of the exported shared type:

- `components/workout-results.tsx` now uses the exported `Exercise` type directly instead of `WorkoutData["exercises"][0]`.

## Recommendations

Accepted:

- Remove `WorkoutParams` and use the existing shared `WorkoutRequest` type across the request path.
- Use the exported `Exercise` type directly where the workout result card needs a single exercise shape.
- Keep the request payload typed at the page boundary so the form submission object is checked against the shared contract.

Rejected:

- Centralizing every component `Props` interface. Most of them are single-use and clearer when local.
- Moving UI-only types like `AIModel` into a broader shared module. They are scoped correctly to `components/settings-menu.tsx`.
- Creating a new catch-all `shared-types` file. That would add indirection without reducing complexity in this codebase.

## Files Changed

- `app/page.tsx`
- `components/workout-results.tsx`
- `lib/hooks/use-workout-submit.ts`
- `lib/utils.ts`
- `reports/code-quality/task-2-shared-types.md`
