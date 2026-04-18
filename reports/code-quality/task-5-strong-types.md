# Task 5: Strong Type Audit

I audited the repo for weak typing patterns, broad casts, and weak library boundaries. The main issues were concentrated around the AI model selector, Radix `Select` value handling, API response parsing, and a few local `Record<string, ...>` / stringly typed helpers.

## Findings

1. `components/settings-menu.tsx`, `components/workout-header.tsx`, and `lib/hooks/use-workout-form.ts` were using plain `string` for the AI model even though the repo already has a fixed allowlist.
2. `components/experience-level-selector.tsx`, `components/duration-selector.tsx`, `components/split-workout-selector.tsx`, and `components/equipment-selector.tsx` were using `as` casts to coerce raw select values into literal unions.
3. `lib/utils.ts` was treating the API response as an untyped object and only checking fields opportunistically.
4. `lib/hooks/use-copy-to-clipboard.ts` used `Record<string, boolean>` even though the keys are a fixed set.
5. `app/api/workout/route.ts` still had a boundary `unknown` for parsed request JSON, which is appropriate there, but the downstream model typing was wider than necessary.

## Changes Made

- Introduced shared AI model IDs and a shared `AIModelId` type in `lib/ai-models.ts`.
- Tightened `WorkoutRequestSchema.model` to a validated enum default instead of a nullable string.
- Updated the AI model props/state in `components/settings-menu.tsx`, `components/workout-header.tsx`, and `lib/hooks/use-workout-form.ts` to use `AIModelId`.
- Replaced select casts with a generic literal guard in `lib/literal-guards.ts`.
- Narrowed clipboard state keys to `CopyStateKey`.
- Added schema-backed response validation in `lib/utils.ts` so `fetchWorkout` only accepts the expected response shape.
- Added schema-backed OpenRouter response validation in `app/api/workout/route.ts`.

## Assessment

The repo is now materially stricter without overfitting. The remaining `unknown` in `app/api/workout/route.ts` is a real boundary type for `request.json()`, so I left it in place. I also kept one localized `as` inside the generic literal guard because the DOM/Radix `Select` API yields `string` and the helper is the right place to concentrate that cast.

## Validation

I verified the changes with:

```bash
pnpm lint
pnpm exec tsc --noEmit
```

Both passed after the edits.

## Files Changed

- `app/api/workout/route.ts`
- `components/duration-selector.tsx`
- `components/equipment-selector.tsx`
- `components/experience-level-selector.tsx`
- `components/settings-menu.tsx`
- `components/split-workout-selector.tsx`
- `components/workout-header.tsx`
- `lib/ai-models.ts`
- `lib/hooks/use-copy-to-clipboard.ts`
- `lib/hooks/use-workout-form.ts`
- `lib/literal-guards.ts`
- `lib/utils.ts`
- `lib/workout-options.ts`
