# Task 1: DRY / Duplication Audit

I reviewed the repo with a focus on duplicated configuration, repeated UI patterns, and repeated transformation logic. The codebase is small and already fairly coherent, so the main risk was over-abstracting. I only consolidated places where the shared shape was obvious and the new shared code stayed simpler than the repeated copies.

## Assessment

The strongest duplication was the AI model configuration. The same allowlist and default model were effectively being maintained in multiple places: the settings UI, the workout form state, and the API route. That is the kind of duplication that drifts quickly because one file changes while another is forgotten.

The second clear duplicate was the workout export formatting. `formatWorkoutAsText` and `formatWorkoutAsTemplate` shared the same header, exercise iteration, and footer logic. The only real difference was whether to include form tips or per-set placeholders.

There was also repeated JSX for the small ghost `Clear` button used in multiple optional fields. That repetition was low-risk, but still worth centralizing because the button semantics are identical and the component is simple.

## Recommendations

Accepted:

- Centralize AI model metadata and IDs in one shared module, then consume it from the settings menu, the form hook, the request schema, and the API route.
- Factor the workout copy/template formatters through a shared builder so the shared document structure exists in one place.
- Extract the repeated `Clear` button into a tiny reusable component.

Rejected:

- Merge `ExperienceLevelSelector` and `DurationSelector` into a generic select wrapper. The shared surface is too small to justify the extra abstraction.
- Collapse `BodyPartsSelector` and `EquipmentSelector` into one selection widget. They share UI patterns but have different data models and behavior.
- Normalize the muscle-group config object into derived logic. The current explicit mapping is clearer than code that computes icons/categories indirectly.

## Changes Made

- Added `components/clear-button.tsx` and used it in the optional field selectors.
- Centralized AI model metadata in `lib/ai-models.ts` and wired the form, settings UI, and API validation to it.
- Updated `lib/workout-options.ts` so request model validation consumes the shared AI model IDs.
- Consolidated `formatWorkoutAsText` and `formatWorkoutAsTemplate` in `lib/utils.ts` through a shared document builder.

## Files Changed

- `components/clear-button.tsx`
- `components/additional-details-input.tsx`
- `components/duration-selector.tsx`
- `components/equipment-selector.tsx`
- `components/experience-level-selector.tsx`
- `components/settings-menu.tsx`
- `lib/ai-models.ts`
- `lib/hooks/use-workout-form.ts`
- `lib/workout-options.ts`
- `lib/utils.ts`
- `app/api/workout/route.ts`
- `reports/code-quality/task-1-dry.md`
