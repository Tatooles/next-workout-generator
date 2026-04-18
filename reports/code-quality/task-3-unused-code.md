# Task 3: Unused Code Audit

## Summary

I ran `knip` against the current Next.js/TypeScript workspace and manually verified every candidate before deleting anything. The repo had a small but real amount of dead surface:

- An unused dialog wrapper component file.
- Several exported component helpers that were never imported anywhere in the repo.
- A duplicated AI model helper layer that had drifted into extra exports.
- A clipboard hook type alias and a workout schema helper that were only used internally.
- Two unused Tailwind animation packages.

The codebase is otherwise fairly tight. The remaining `knip` warning is `postcss` being unlisted in `postcss.config.js`; that is a tooling/configuration false positive, not dead code.

## Tooling

- `pnpm dlx knip --reporter compact`
- `rg` for manual call-site verification
- `pnpm lint`
- `pnpm build`

## Changes Made

- Removed `components/ui/dialog.tsx` after verifying there were no imports anywhere else in the repo.
- Removed dead export surface from `components/ui/command.tsx`, `components/ui/popover.tsx`, `components/ui/button.tsx`, `components/ui/badge.tsx`, and `components/ui/select.tsx`.
- Made `CopyStateKey` local to `lib/hooks/use-copy-to-clipboard.ts`.
- Made `ExerciseSchema` local to `lib/workout-types.ts` while keeping the exported `Exercise` type.
- Made `AIModel` local in `lib/ai-models.ts` while keeping the exported `AIModelId`, `AI_MODEL_IDS`, `DEFAULT_AI_MODEL`, and `AI_MODELS` that are still in use.
- Removed the duplicated `workoutTypeIcons` and exported `MuscleGroupConfig` surface from `lib/workout-options.ts`.
- Removed `@radix-ui/react-dialog`, `tailwindcss-animate`, and `tw-animate-css` from `package.json` after confirming no code or config references remained.

## Safe Removals

- `components/ui/dialog.tsx` was safe to delete because the file had no remaining consumers after the command-palette cleanup.
- The removed component exports were safe because manual search found no imports or references outside their defining files.
- The package removals were safe because there were no runtime, CSS, or config references left in the repo.

## Retained

- `react-dom` and `@types/react-dom` were intentionally retained. `knip` can flag these in a Next app, but they remain part of the framework/tooling setup.
- `postcss` is still reported as unlisted by `knip`, but `@tailwindcss/postcss` already brings it in transitively. I left that alone because the app builds successfully and the warning is not about unused code.

## Verification

- `pnpm lint` passed.
- `pnpm build` passed.
- Final `knip` output only reported the `postcss` unlisted-dependency warning.
