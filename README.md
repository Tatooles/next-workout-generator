# Workout Generator

A Next.js app for generating single-workout plans and weekly training programs from structured fitness preferences.

## Development

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Quality Checks

```bash
pnpm lint
pnpm test
pnpm build
```

## Configuration

The API routes call OpenRouter and require:

```bash
OPENROUTER_API_KEY=...
```

If that variable is missing or blank, `/api/workout` and `/api/program` return HTTP 500 and do not call OpenRouter.

## Request limits

The site has no accounts. Visitors generate plans in the browser, and the page calls those routes on the same origin. The routes reject cross-origin calls, request bodies over 8 KB, and more than 15 generation attempts from one client address in 15 minutes (40 for that server process). Counters live in process memory and reset on restart. On Vercel, `/api/workout` and `/api/program` are separate functions, and each running instance has its own counters. The client address is taken from `x-vercel-forwarded-for` or `x-real-ip`. Off Vercel, including local development, that address is not available, so every caller shares the 15-request bucket. No additional services or environment variables are required.
