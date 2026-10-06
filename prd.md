# Workout Assist: Product Requirements

## Purpose and audience

Workout Assist helps an individual plan workouts, complete sets during a session, and revisit what they did later. It should remain quick to use during a workout on a phone. The product is moving from a browser-local single-session tracker to a backend-backed system with reusable plans and session history.

## Product scope

1. **Reusable workout plans:** Create and keep exercise plans with a name, sets, and reps per set; retrieve a plan for another session. The existing exercise-entry defaults are 3 sets and 12 reps. How plans are named, edited, and versioned remains to be designed.
2. **Active session:** Start a session from a plan, see each exercise and its target, mark or unmark individual sets, and see completed/total sets. Progress belongs to that session, not to the reusable plan. An unfinished active session must be saved so the user can resume it later.
3. **Offline continuity:** The active session must remain usable without a network connection. If the user taps **Finish workout** while offline, record the finish locally as a pending history write and make it available for synchronization rather than losing it.
4. **Rest timer:** An optional timer in the active session can be shown or hidden, configured in seconds, started, paused, and reset. The existing default is 30 seconds. Timer persistence and notifications are not yet decided.
5. **Session history:** Tapping **Finish workout** records the session in backend history, even if some planned sets were not completed. Preserve the recorded set progress and exercise targets so the user can review what actually happened and future statistics can use the data. A statistics dashboard is not in the current scope.
6. **Continuity and ownership:** Plans and sessions must remain available beyond a browser refresh and on return visits through backend persistence. The initial product supports multiple users with separate accounts; plans and history are private to their owner by default. Sharing the app means inviting friends to use their own accounts, not sharing workout data or plans. The authentication provider remains an open decision.

## Offline and reconciliation requirements

The app must retain pending offline writes locally until they synchronize successfully. An unfinished active session can be resumed after interruption or temporary loss of connectivity. Finishing while offline creates one pending history record that synchronizes after connectivity returns and is not lost.

When conflicting copies of the same session exist for a single day, the copy with the latest event date-time wins. The reconciliation implementation must preserve that rule across local and cloud data; the storage technology and sync mechanism remain open decisions.

## Current product versus intended product

Today the app supports one local plan/session in a two-mode, single-page interface. It stores the plan, completion flags, and mode in browser `localStorage`; resetting clears them. It has no database, backend persistence, sign-in, reusable plan library, or session history. The capabilities above are the newly requested product direction, **not** claims that they already work.

## Acceptance outcomes for the expansion

- A user can save a plan and use it for more than one session without overwriting the original plan.
- Finishing a partially completed workout saves its actual progress in history; returning later does not erase that record or earlier sessions.
- An unfinished session can be resumed after an interruption, including loss of connectivity; progress in one session does not leak into another started from the same plan.
- Data is not exposed across users once an identity/access model is chosen.
- Finishing while offline queues one history write, keeps it locally until synchronization succeeds, and does not duplicate the history record on retry; the set-tracking and optional-rest-timer flow remains usable on a phone.

## Boundaries and open decisions

The scope does not currently include coaching, social features, analytics, import/export, or an installable offline PWA. Before implementing the expansion, decide:

- **Identity and ownership:** support multiple users with separate accounts and private-by-default plans/history. Choose the authentication provider, account lifecycle, and authorization boundary before implementation.
- **Persistence and API:** database/provider, server boundary, and data contracts; none has been selected.
- **Plan/session lifecycle:** decide plan naming/editing, which timestamps and targets are captured, and how edits to plans affect historical records.
- **Migration:** whether to import existing `localStorage` sessions/plans, and how to handle invalid saved data when moving to the backend.
- **Offline implementation:** choose local queue storage, sync triggers, and idempotency. Working offline, resuming unfinished sessions, and datetime-based latest-wins reconciliation are requirements; an installable PWA or background sync is not assumed.

## Provenance

This PRD consolidates the product-purpose content formerly held in the retired scaffold and status briefing. The backend, reusable-plan, and history direction comes from the current user decision. Technical state lives in `spec.md`; user-confirmed engineering preferences live in `taste.md`.
