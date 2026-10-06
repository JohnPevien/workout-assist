# Workout Assist: Product Spec

## Current implementation

The current app is a browser-only Next.js single-page MVP. `app/page.tsx` owns workout and mode state, synchronizes it to `localStorage`, and delegates planning/tracking views to `app/components/`. There is currently no backend, database, authentication, reusable plan storage, or session history. The intended product expansion is defined in `prd.md`.

## Current behavior

The MVP supports planning one session, tracking set completion, an optional 30-second rest timer, and confirmed session reset. The current session and mode survive refreshes in the same browser through `localStorage`.

## Technical baseline

The intentional stack is Next.js 15 App Router, React 19, TypeScript 5, Tailwind CSS v4, shadcn/Radix UI primitives, Lucide React, and pnpm. Shared UI primitives live under `components/ui`; feature components currently live under `app/components`.

The durable workout shape is an exercise name, set count, rep target, and per-set completion flags for an active local session. When backend persistence is implemented, reusable plans and active sessions must be separate concepts so session progress cannot mutate a plan or leak between sessions.

## Data and validation

User input and persisted data are untrusted boundaries. The agreed behavior for invalid persisted data is to discard it and start a fresh planning session; this validation is not yet implemented in the MVP. The backend transition must replace browser-only persistence without exposing data across users.

## Current acceptance behavior

1. **Plan:** The user can add an exercise with a name, number of sets, and reps per set. New entries default to 3 sets and 12 reps. The planning list displays those values and allows removing an entry. An empty plan shows an empty state; starting a session is available once at least one exercise exists.
2. **Track:** Starting a session switches to tracking mode. For each exercise, the user sees the reps target, an individually labeled checkbox for every set, and the completed/total set count. A set can be marked complete or incomplete, and the count follows those changes.
3. **Rest:** A rest timer can be shown or hidden in tracking mode. Its initial value is 30 seconds; the user can edit the seconds while paused, start, pause, and reset it to 30 seconds. It stops at zero. The timer is optional to the workout flow.
4. **Resume:** After a refresh in the same browser, the plan, completed sets, and current mode remain available through local storage. If saved session data is invalid, discard it and start a fresh planning session (agreed behavior, not yet implemented). This does not promise that the app shell loads without a network connection.
5. **Reset:** Tracking mode offers a confirmation before resetting the session. Confirming clears the exercises and progress and returns to planning; canceling leaves the session untouched.
## Known gaps

- The MVP has no runtime validation for loaded `localStorage` data, no backend, and no user-facing validation errors.
- Reusable plans, session history, identity/access control, and backend data contracts are planned in `prd.md`, not implemented.
- Timer state is local to the tracking view and is not persisted across refreshes.
- Import/export, coaching, social features, analytics, and PWA offline behavior are outside the current PRD scope.

## Sources

`prd.md` is the product source of truth. This technical spec records the current implementation and agreed constraints; the superseded scaffold, status briefing, and migration plan have been removed. `README.md` remains the project entry point, and `taste.md` records engineering preferences.

