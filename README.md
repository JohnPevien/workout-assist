# Workout Assist

Workout Assist helps you create workout plans, track sets during an active session, and review completed sessions. The product is moving from a local browser MVP to backend-backed persistence for reusable plans and workout history.

## Product status

The current UI is the localStorage MVP: plan one session, track completed sets, use the optional rest timer, and reset the session. Backend persistence, accounts, reusable plan storage, and session history are planned and are not implemented yet.

Canonical project context lives in:

- [`prd.md`](./prd.md) - product requirements and expansion scope
- [`spec.md`](./spec.md) - technical contract and current implementation
- [`taste.md`](./taste.md) - engineering preferences

## Getting started

Install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Current technologies

- Next.js 15 with App Router and Turbopack
- React 19 and TypeScript 5
- Tailwind CSS v4
- shadcn/Radix UI primitives
- Lucide React
- pnpm

See `spec.md` for current behavior and implementation boundaries. See `prd.md` before making backend or product-scope decisions.
