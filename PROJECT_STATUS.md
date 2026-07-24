# ExamHub — Project Status

Gamified exam-prep platform (working title "ExamHub"). Fahrschul-App-style:
pick an exam, then a unified learn flow (practice mode, exam simulation,
gamification). One engine, multiple exams as swappable content — new exam =
new DB rows, no refactor.

Full background/history/decisions: see auto-memory `project_exam_hub.md`
(persists across chat sessions on this machine). This file is the in-repo
snapshot for picking work back up after a `/clear` or in a fresh session.

## Repo & environment

- **Location**: `C:\Users\lucaw\OneDrive\Dokumente\JavaScript\exam-hub` — its
  own standalone git repo, deliberately separate from `examhub`/`rankcard`
  (those are a different, unrelated project — don't confuse them).
- Stack: Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind + Supabase
  (Auth/DB/RLS). No Docker available in this dev environment, so no local
  Supabase stack — everything is pushed straight to the hosted project via
  `npx supabase db push`.
- Supabase project ref: `gpkybiurhledyayvzwst`. `.env.local` (gitignored) has
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SECRET_KEY` (server-only, bypasses RLS — never expose client-side).
- Dev server: `npm run dev` from this folder, http://localhost:3000.
- Sibling `rankcard-next` project (`C:\Users\lucaw\OneDrive\Dokumente\JavaScript\rankcard\rankcard-next`)
  is being used as a reference for auth/Stripe patterns — **read-only, never
  modify it**, it's a separate product.

## Data model (Supabase)

Migrations in `supabase/migrations/`, applied in order:

1. `20260724000000_init_schema.sql` — core schema: `exams > topics >
   questions > answer_options`, `profiles` (extends `auth.users`, has
   `subscription_tier` free/pro + XP/streak fields — not yet wired up to real
   values), `user_topic_progress`, `question_attempts`, `exam_attempts` /
   `exam_attempt_answers`. RLS: content readable per topic tier, user tables
   self-access-only. Trigger auto-creates a `profiles` row on signup.
2. `20260724000001_seed_fiae_ae_pilot.sql` — original placeholder seed
   (superseded).
3. `20260725000000_add_question_review.sql` — added `questions.reviewed`
   (boolean, default false) + `questions.source_key` (unique text). Public
   read policies now require `reviewed = true`, so draft questions are
   invisible to the anon client until approved.
4. `20260725000001_seed_fiae_ae_pilot.sql` — real exam `fiae-ae` "IHK
   Anwendungsentwicklung", 4 topics (Datenbanken, Programmierung, Netzwerke,
   Wirtschafts- & Sozialkunde), 20 original questions (self-written, IHK-style,
   NOT copied from any real exam — see "Content & copyright" below).

**Current content status**: all 20 pilot questions are reviewed/approved and
live (verified via anon client query — 20 visible, 0 drafts).

## App structure

- `/` — marketing landing page (`src/app/page.tsx`), rebuilt 1:1 from a
  Claude-Design export. Client component, light/dark theme toggle, all CTAs
  route to `/app`.
- `/app` — the actual product, gated behind auth (see below). Split into:
  - `src/app/app/page.tsx` — server component, loads the approved `fiae-ae`
    questions/topics/options from Supabase, **shuffles answer options
    server-side** (Fisher-Yates) so correctness is never signaled by
    position, pulls a `SESSION_SIZE = 10`-question practice session.
  - `src/app/app/AppClient.tsx` — client component, the actual state machine
    (also rebuilt 1:1 from a second Claude-Design export): Dashboard → Exam
    Detail → Practice (interactive quiz, per-option correct/wrong feedback,
    animated XP count-up) → Result (score ring, per-topic breakdown,
    confetti if passed). Real score/pass-fail (50% threshold) computed from
    actual answers.
- `/auth` — login/register page (`AuthClient.tsx` + `page.tsx`), email/password
  + Google OAuth button, in the same design system.
- `/auth/callback` — exchanges the OAuth/email-confirmation code for a session.
- `/exams` + `/exams/[slug]` — **orphaned**, earlier Supabase-backed exam
  list/detail pages, nothing links to them anymore since landing points at
  `/app`. Left in place intentionally, not deleted — don't remove without
  asking the user; decide later whether to fold into `/app` or delete.
- `/review` — internal, **unauthenticated** question-review tool
  (`src/app/review/page.tsx` + `actions.ts`). Lists all questions (drafts
  included) via a server-only admin client, with Freigeben/Ablehnen/
  Zurückziehen/Alle-freigeben actions. **Must be put behind auth before any
  real deploy** — currently anyone with the URL can approve/delete questions.

## Design system

- Two Claude-Design ("Clode Design") exports were rebuilt 1:1 as real
  React/Next.js: the landing page, then a combined "Landing + App" export
  with the Dashboard/Detail/Practice/Result screens.
- These exports ship as self-extracting `__bundler` HTML files — the real
  markup lives as JSON inside `<script type="__bundler/template">`, using
  custom pseudo-template syntax (`<x-dc>`, `sc-if`, `{{ }}`, `style-hover`).
  **Not usable as-is** — must be extracted (pull the script tag, `JSON.parse`,
  substitute manifest assets) and hand-translated to real JSX/CSS.
- Design tokens/keyframes/hover classes live in `src/app/globals.css`,
  prefixed `eh`/`.eh-` (e.g. `.eh-feature-card`, `--accent`, `eh-revUp`).
  Fonts: Hanken Grotesk (body) + Space Grotesk (headings) via `next/font`.
  Accent: indigo `oklch(0.585 0.2 264)`. Light/dark via `data-theme` + CSS vars.
- **Known CSS gotcha**: entrance-animated elements (`animation: eh-revUp ...
  both`) that also need a `:hover` transform will have the hover effect
  silently blocked — `animation-fill-mode: both` keeps an inline `transform`
  locked in place after the animation ends, and CSS Animations outrank normal
  (non-`!important`) stylesheet rules in the cascade. Fix: clear the inline
  `animation` style via an `onAnimationEnd` handler once it finishes. Already
  fixed on the landing's feature cards; watch for it anywhere else revUp +
  hover combine.

## Auth (in progress)

- Foundation is built and verified: `/auth` page renders, email/password
  sign-in/sign-up works structurally, Google OAuth button wired up,
  `/auth/callback` exchanges codes, `middleware.ts` redirects unauthenticated
  visitors from `/app` to `/auth?next=/app` (verified via curl: 307 →
  `/auth?next=%2Fapp`). App header shows real user initials + sign-out menu.
- **Critical gotcha that cost real debugging time**: in a `src/`-directory
  Next.js project, `middleware.ts` **must live at `src/middleware.ts`**, not
  the project root. At the root it is silently ignored at runtime — `next
  build` still lists "Proxy (Middleware)" in its output either way, which is
  misleading. Moving it into `src/` is what made the auth gate actually work.
- **Still needs the user to do externally** (Claude won't create accounts or
  handle credentials on their behalf):
  - Supabase dashboard → Authentication: for local testing, either disable
    "Confirm email" or use a real inbox (signup sends a confirmation link to
    `/auth/callback`).
  - Google login: create a Google Cloud OAuth client, add the Supabase
    callback URL, enable the Google provider in Supabase with the
    client id/secret. Code is ready; errors until this is configured.
  - Apple login: explicitly deferred by the user ("maybe wenn das geht") —
    needs a paid Apple Developer account. Not built yet.

## Content & copyright policy (important, keep following this)

- Questions must be **self-written**, not copied or lightly reworded from
  real IHK/AKA exam questions. Facts and topics are free to use; the
  specific wording of a real exam question is protected — a "reworded" copy
  can still count as an unauthorized *Bearbeitung* (§ 23 UrhG) of the
  original work. Simple factual questions have low Schöpfungshöhe (lower
  risk); the classic IHK situational/case questions have more.
  Rule of thumb: same topic, brand-new question — never take a real question
  and swap synonyms.
- Workflow: write in small batches, seed as **drafts** (`reviewed = false`),
  have the user (a subject-matter expert) review via `/review` before they
  go live. Two things the user was asked to double-check but status unclear:
  `prog-encapsulation` (Kapselung vs. Abstraktion distinction) and the
  Wirtschafts-/Sozialkunde difficulty level.

## What's next (the "finish the loop" plan, in order)

User explicitly wants the full loop finished before more polish, in this
order, reusing patterns from `rankcard-next` where applicable:

1. ~~Registration / login~~ — foundation done (see Auth above); Google/Apple
   OAuth need the user's external provider setup to actually work end-to-end.
2. **Stripe** — not started. Reference pattern in `rankcard-next`:
   `app/api/stripe/checkout/route.js` (creates/reuses a Stripe customer,
   subscription-mode Checkout Session, `STRIPE_PRICE_ID` env var),
   `app/api/stripe/webhook/route.js` (on `checkout.session.completed` sets
   pro status + subscription id; on `customer.subscription.deleted` clears
   it), `lib/stripe.js` (bare `Stripe` client). Our schema already has
   `profiles.subscription_tier` ('free'/'pro') and `stripe_customer_id` —
   RankCard uses a boolean `is_pro` instead, adapt accordingly. **Needs from
   the user**: a Stripe account, product/price, and webhook signing secret —
   Claude can write all the code but won't create the Stripe account itself.
3. **IHK-Prüfung wählen** — dashboard exam-selection already exists but only
   has one real exam (`fiae-ae`); more exams are just new DB rows once wanted.
4. **Übungsmodus** — done (see App structure above), pulls real approved
   questions, shuffled options.
5. **Prüfungssimulation** — not really implemented yet; `startSim` in
   `AppClient.tsx` currently just calls the same `startPractice` flow. Needs
   an actual time limit, likely a larger/full question set, and exam-attempt
   tracking in `exam_attempts`/`exam_attempt_answers` (schema already
   supports this).
6. **Polishing** — after the above. Also on the backlog: real per-user
   XP/streak/progress (currently static placeholder values like "7 Serie",
   "34%", "1.240 XP" in the UI), deciding what happens to orphaned `/exams`,
   and putting `/review` behind auth before any real deploy.

## Reminders / house rules for this project

- Code comments, UI strings, variable names in English; chat communication
  in German (per user's original brief).
- No design/architecture decision is "final" until the user confirms it.
- Never create external accounts (Supabase, Google, Stripe, Apple) on the
  user's behalf — write the code, let them do the account/credential setup,
  wire it up together once they have the keys.
- Sensitive keys (Stripe secret, Supabase secret/service-role) should never
  be pasted in chat if avoidable; if they end up there, flag rotating them.
