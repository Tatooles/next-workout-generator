# Task 7: Legacy / Fallback Cleanup

I audited the repo for compatibility shims, legacy naming, dead branches, fallback paths, deprecated APIs, and old workaround comments.

## Assessment

The main legacy smell in this codebase was duplicated model configuration. The model list and default model were previously hardcoded in multiple places, which created separate “truths” for the settings UI, form state, and API route. That is the kind of legacy drift that makes future changes brittle because every model update has to be remembered in more than one module.

I also found a stale UX workaround in the settings popover: a timeout-based `mounted` flag that only existed to defer theme rendering. That was a leftover implementation pattern rather than a necessary runtime constraint.

There was one unreferenced hook path, `resetWorkout`, that no caller used. Keeping it around would only enlarge the surface area without providing a real code path.

## Recommendations Implemented

I implemented the high-confidence cleanup items:

- Centralized AI model metadata in `lib/ai-models.ts`.
- Made `WorkoutRequestSchema` validate `model` against the shared model ids.
- Removed the API route’s separate allowlist branch and used the shared default model.
- Updated the form hook to use the shared default model.
- Removed the unused `resetWorkout` hook path.
- Replaced the settings popover’s timeout-based hydration workaround with direct theme state.

## What I Left Alone

I did not remove legitimate error-handling branches in the workout API or copy helpers, since those still handle real boundary conditions:

- malformed request JSON,
- upstream API failures,
- invalid AI output,
- clipboard failures.

Those are not legacy code paths; they are actual runtime guards.

## Verification

I verified the cleanup with:

```bash
npm run lint
npx tsc --noEmit
```

Both passed after the cleanup.

## Files Changed

- `app/api/workout/route.ts`
- `components/settings-menu.tsx`
- `lib/ai-models.ts`
- `lib/hooks/use-workout-form.ts`
- `lib/hooks/use-workout-submit.ts`
- `lib/workout-options.ts`
- `reports/code-quality/task-7-legacy-cleanup.md`
