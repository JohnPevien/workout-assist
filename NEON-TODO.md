# NEON Project TODO — run on the other machine after `git pull`

Scope: add auth + Neon Postgres to workout-assist. DB-only, login required.
Locked: Managed Better Auth (`@neondatabase/auth`, NOT legacy Stack Auth) + Drizzle + `@neondatabase/serverless` + normalized history (`users -> workout_sessions -> session_exercises -> set_logs`).

## 0. Confirm Round 2 (defaults if you skip)
- [ ] Q1 Better Auth confirm: use Managed Better Auth (Stack Auth no longer onboards new projects)
- [ ] Q2 Login methods: email/password + Google for v1
- [ ] Q3 Protection: all routes protected, `/login` public only
- [ ] Q4 User link: `workout_sessions.userId -> Better Auth user.id (text)`, no mirrored users table

## 1. Create Neon project
- [ ] console.neon.tech → New Project → `workout-assist`, closest region, Postgres 17
- [ ] Project Dashboard → Connect → copy pooled `DATABASE_URL` (runtime) + unpooled `DATABASE_URL_UNPOOLED` (migrations)

## 2. Wire env (other machine, never commit)
- [ ] Create `.env.local`:
```env
DATABASE_URL="postgresql://user:pass@endpoint-pooler.region.aws.neon.tech/db?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://user:pass@endpoint.region.aws.neon.tech/db?sslmode=require"
NEON_AUTH_BASE_URL="https://ep-xxx.neonauth.region.aws.neon.tech/db/auth"
NEON_AUTH_COOKIE_SECRET="$(openssl rand -base64 32)"
```

## 3. Enable Managed Better Auth
- [ ] Same Neon project → Auth → Enable Managed Better Auth
- [ ] Enable providers chosen in Q2, copy `NEON_AUTH_BASE_URL` into `.env.local`

## 4. Install + config
- [ ] `pnpm add drizzle-orm @neondatabase/serverless @neondatabase/auth`
- [ ] `pnpm add -D drizzle-kit dotenv`
- [ ] Add `drizzle.config.ts` (schema `./lib/db/schema.ts`, out `./drizzle`, unpooled URL for migrations)
- [ ] Add `lib/db` client with pooled URL (`neon` + `drizzle(..., { schema })`)

## 5. Model + migrate
- [ ] Define `workout_sessions`, `session_exercises`, `set_logs` with `userId text` FK to Better Auth user
- [ ] `pnpm drizzle-kit generate` → `pnpm drizzle-kit migrate`

## 6. Cut over app
- [ ] Replace localStorage in `app/page.tsx` with server actions / route handlers reading Neon
- [ ] Add middleware protection + `/login` using `@neondatabase/auth` UI
- [ ] Update `CONTEXT.md` terms if they change (`WorkoutSession` vs `AuthSession` already locked)

## 7. Verify
- [ ] `pnpm lint` + `pnpm build`
- [ ] Manual: sign up → plan → start session → toggle sets → timer → reset → history persists across devices
