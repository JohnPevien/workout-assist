You are working in a repository that uses two persistent root-level context files:

- [`spec.md`](http://spec.md)
- [`taste.md`](http://taste.md)

These files are shared context for any coding agent that works on this repository.

Your responsibility is to read them before meaningful work and keep them accurate as the project evolves.

# Core distinction

Use this mental model:

[`spec.md`](http://spec.md) = WHAT this software is, how it works, and what has been decided.

[`taste.md`](http://taste.md) = HOW I prefer software to be designed and implemented.

Do not mix the two.

---

# Before starting work

Before making meaningful implementation, architecture, API, UI, styling, dependency, testing, or refactoring decisions:

1. Read [`spec.md`](http://spec.md)
2. Read [`taste.md`](http://taste.md)
3. Inspect the relevant existing code
4. Follow the current task instructions

Use this priority order when instructions conflict:

1. My current explicit instructions
2. Current task / PRD / acceptance criteria
3. Correctness, security, accessibility, and technical constraints
4. Existing repository architecture and conventions
5. [`spec.md`](http://spec.md)
6. [`taste.md`](http://taste.md)

If an older entry in either file conflicts with a newer explicit decision from me, update the file rather than silently preserving stale information.

---

# [`spec.md`](http://spec.md)

[`spec.md`](http://spec.md) is the persistent specification and technical context for THIS PROJECT.

It should help a new agent answer:

- What are we building?
- Why does it exist?
- Who is it for?
- What are the important product behaviors?
- What architecture does the project use?
- What technologies and major libraries are intentional?
- What important constraints exist?
- What interfaces, contracts, or invariants must remain true?
- What major decisions have already been made?
- What parts of the system interact with each other?
- What does "correct behavior" mean for important features?

## What belongs in [`spec.md`](http://spec.md)

Record durable project-specific information such as:

### Product

- Product purpose
- Target users
- Important user workflows
- Feature behavior
- Business rules
- Important terminology
- Acceptance-level behavior that should remain true

### Architecture

- High-level architecture
- Application boundaries
- Data flow
- State-management approach
- Authentication approach
- API architecture
- Server/client boundaries
- Major modules and their responsibilities

### Technology

- Frameworks
- Important libraries
- Database/storage choices
- External integrations
- Testing stack
- Build/deployment architecture

Only mention technologies when their use is intentional or relevant to future work.

### Contracts and invariants

Record things future agents must not accidentally break.

Examples:

- Authentication state is resolved server-side before rendering protected routes.
- Money is stored internally in integer cents.
- API responses use the shared `ApiResult<T>` format.
- Components in the design system must remain usable without JavaScript where feasible.
- The frontend never directly accesses private service credentials.

### Important decisions

Record architectural or product decisions that are likely to matter again.

Example:

Bad:

"Today I changed the modal implementation."

Good:

"Dialogs use the native `<dialog>` element wrapped by the shared Dialog component. Do not introduce a second modal system unless there is a concrete limitation."

Include the reasoning when the reasoning prevents future agents from undoing the decision.

### Known constraints

Examples:

- Must support specific browsers
- Must satisfy WCAG requirements
- API rate limits
- Legacy system constraints
- Performance budgets
- Deployment restrictions
- Compatibility requirements

### Important repository conventions

Only include conventions that describe THIS repository.

Examples:

- Feature-specific components live alongside their feature.
- Shared UI primitives live under `components/ui`.
- Server-only modules use the `.server.ts` suffix.
- API schemas are defined once and reused by client and server.

---

# What does NOT belong in [`spec.md`](http://spec.md)

Do not turn [`spec.md`](http://spec.md) into a work log.

Do NOT record:

- Every file you edited
- Every command you ran
- Temporary debugging information
- Completed TODOs that no longer matter
- Git history
- Minor implementation details discoverable immediately from the code
- One-off bugs
- Temporary workarounds that have already been removed
- Speculation
- Unconfirmed assumptions
- Your reasoning transcript
- Generic programming advice
- My personal coding preferences

Bad:

"Edited Header.tsx and fixed padding."

Bad:

"Ran pnpm lint successfully."

Bad:

"User likes simple code."

The first two are temporary work history.

The last one belongs in [`taste.md`](http://taste.md) if it is sufficiently established.

---

# Suggested [`spec.md`](http://spec.md) structure

Keep the structure proportional to the size of the project.

Prefer something like:

# Project Specification

## Overview

## Users and Core Workflows

## Product Behavior

## Architecture

## Data and State

## APIs and Integrations

## UI Architecture

## Authentication and Authorization

## Testing

## Accessibility

## Performance

## Important Invariants

## Repository Conventions

## Architectural Decisions

## Known Constraints

Do not create empty sections purely for completeness.

---

# [`taste.md`](http://taste.md)

[`taste.md`](http://taste.md) represents my persistent engineering taste.

It describes HOW I generally prefer software to be built.

It should gradually learn from my feedback across tasks.

A useful [`taste.md`](http://taste.md) allows a new agent to make implementation choices that are more likely to match what I would choose myself.

Taste is NOT a project specification.

Taste is also NOT an absolute rule.

Treat each preference as a strong default unless the current task, existing architecture, correctness, accessibility, security, or explicit instructions provide a better reason to do otherwise.

---

# What counts as developer taste

Look for signals such as:

- I explicitly say I prefer something.
- I explicitly say I dislike something.
- I correct your implementation approach.
- I replace one pattern with another.
- I repeatedly make the same kind of correction.
- I reject unnecessary complexity.
- I repeatedly prefer a specific API design.
- I repeatedly choose one architectural style over another.
- My code review comments reveal a reusable engineering principle.
- My manual changes reveal a clear recurring preference.

Examples:

Specific feedback:

"Don't create a hook just for this. It's only used once."

Possible taste:

"Prefer keeping one-off logic local rather than extracting hooks without a meaningful reuse or abstraction boundary."

Specific feedback:

"Use the native button instead of a div with role=button."

Possible taste:

"Prefer native semantic HTML before recreating equivalent semantics with ARIA."

Specific feedback:

"We already have a utility for this. Don't add lodash."

Possible taste:

"Prefer existing project or platform capabilities for small problems before introducing another dependency."

Specific feedback:

"This component has way too many boolean props."

Possible taste:

"Prefer composition or explicit variants over reusable components controlled by many boolean props."

---

# What does NOT count as taste

Do NOT add something to [`taste.md`](http://taste.md) merely because:

- You chose that solution.
- The existing repository happens to use it.
- A framework recommends it.
- A task required it once.
- Technical constraints forced the choice.
- It appears in one piece of existing code.
- You think I would probably like it.

Your own generated decisions are NOT evidence of my preferences.

Do not create a feedback loop where:

1. You choose a pattern.
2. You write that pattern into [`taste.md`](http://taste.md).
3. Future agents treat your choice as my preference.

Taste should primarily originate from MY behavior, feedback, corrections, approvals, and repeated choices.

---

# Project convention vs taste

This distinction is important.

Example:

"This project uses Tailwind CSS."

→ [`spec.md`](http://spec.md)

"Prefer utility classes over creating custom CSS abstractions for simple styling."

→ [`taste.md`](http://taste.md)

---

"This repository uses Zustand for global client state."

→ [`spec.md`](http://spec.md)

"Prefer local state until state genuinely needs to be shared."

→ [`taste.md`](http://taste.md)

---

"The shared Button component uses CVA."

→ [`spec.md`](http://spec.md)

"Prefer small explicit variant APIs over many boolean styling props."

→ [`taste.md`](http://taste.md)

---

"Forms currently use React Hook Form."

→ [`spec.md`](http://spec.md)

"Prefer native browser behavior and simple controlled inputs for small forms before reaching for complex form abstractions."

→ [`taste.md`](http://taste.md)

---

# Task requirement vs persistent context

Do not persist something merely because it appeared in a ticket.

Example:

Task:

"Use a two-column layout on the billing settings page."

Unless this represents a broader product rule, do not add that to either persistent file.

However:

"All settings pages use the same responsive settings-shell layout."

That may belong in [`spec.md`](http://spec.md).

---

# How to update [`taste.md`](http://taste.md)

When I give feedback, ask internally:

"Would knowing this improve an agent's decisions on an unrelated future task?"

If NO, do not save it.

If YES, consider adding it.

When adding taste:

- Write the general principle, not the specific incident.
- Make it actionable.
- Keep it concise.
- Preserve important nuance.
- Avoid absolute language unless I explicitly established an absolute rule.
- Merge overlapping preferences.
- Refine an existing entry instead of adding duplicates.
- Remove stale preferences when newer evidence clearly contradicts them.

Bad:

"Don't extract UserCardHeader."

Better:

"Avoid extracting components that only rename a small piece of markup without creating a meaningful semantic, reusable, or complexity boundary."

---

# Suggested [`taste.md`](http://taste.md) structure

Use categories only when they contain useful information.

Possible sections:

# Developer Taste

## General Engineering

## Architecture

## React

## TypeScript

## Components and APIs

## State Management

## CSS / Tailwind

## UI / UX

## Accessibility

## Data Fetching

## Dependencies

## Testing

## Performance

## Code Style

## Agent Workflow

Do not create empty sections just to fill out the template.

---

# Quality standard for [`taste.md`](http://taste.md)

Preferences should be specific enough to affect a decision.

Weak:

- Prefer clean code.
- Prefer good UX.
- Keep things simple.
- Write maintainable code.

These are too vague to be useful.

Better:

- Prefer straightforward control flow over clever abstractions that reduce line count but increase cognitive overhead.
- Avoid extracting components until there is a meaningful semantic, reuse, testing, or complexity boundary.
- Prefer native semantic HTML before introducing custom accessibility behavior.
- Prefer extending an existing project abstraction before creating a parallel abstraction.
- Avoid new dependencies for functionality that can be implemented clearly with existing project or platform capabilities.

---

# Maintaining both files

After meaningful work, consider whether anything happened that changes persistent context.

Ask two separate questions:

1. Did we learn or decide something durable about THIS PROJECT?

If yes, update [`spec.md`](http://spec.md).

2. Did I reveal a reusable preference about HOW I like software built?

If yes, update [`taste.md`](http://taste.md).

Do not update either file simply because a task was completed.

Updates should be selective.

The goal is not maximum documentation.

The goal is high-signal context that makes future agents better.

---

# Keep both files compact

Periodically clean them up.

Remove:

- Duplicate rules
- Stale information
- Superseded decisions
- Obvious statements
- Information easily discovered from one glance at the code
- Excessive prose
- Historical narration

Prefer:

- Short declarative statements
- Bullets
- Explicit invariants
- Concise rationale when rationale matters

A future agent should be able to read both files quickly before starting work.

---

# Contradictions

If you discover that:

- the code,
- [`spec.md`](http://spec.md),
- [`taste.md`](http://taste.md),
- and my current instruction

do not agree, do not silently guess.

Use my current explicit instruction as authoritative.

Then, when appropriate, update the persistent file so the contradiction does not remain for the next agent.

If the contradiction appears accidental or materially changes the product architecture, surface it to me.

---

# Important final rule

Do not use [`spec.md`](http://spec.md) and [`taste.md`](http://taste.md) as dumping grounds.

Think of them as compressed persistent memory:

[`spec.md`](http://spec.md)  
= durable truth about this project

[`taste.md`](http://taste.md)  
= durable truth about how I tend to prefer engineering decisions

Every entry should earn its place by being likely to help a future agent make a better decision.