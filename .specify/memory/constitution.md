<!--
SYNC IMPACT REPORT
==================
Version change: TEMPLATE (unfilled) → 1.0.0
Bump rationale: Initial ratification — every placeholder was unfilled prior to this
  amendment, so this is the first concrete adoption (MAJOR baseline, not an upgrade).

Modified principles (placeholder → concrete):
  - [PRINCIPLE_1_NAME] → I. Type Safety as the First Line of Defense
  - [PRINCIPLE_2_NAME] → II. Server State Through RTK Query
  - [PRINCIPLE_3_NAME] → III. Reuse Before Creating (NON-NEGOTIABLE)
  - [PRINCIPLE_4_NAME] → IV. Brand-Consistent Design System
  - [PRINCIPLE_5_NAME] → V. App Router Discipline

Added sections:
  - Technology Stack & Constraints (replaces [SECTION_2_NAME])
  - Development Workflow & Quality Gates (replaces [SECTION_3_NAME])

Removed sections:
  - Governance — removed at maintainer's request. This is a solo project; the
    constitution is edited at will and does not need a formal amendment process,
    semantic-versioning bumps, or per-PR compliance statements.

Templates requiring updates:
  - ✅ .specify/templates/plan-template.md — Constitution Check gate references the
    constitution file dynamically; no edit required, gate now resolves to the five
    principles defined here.
  - ✅ .specify/templates/spec-template.md — no constitution-coupled content; no edit
    required.
  - ✅ .specify/templates/tasks-template.md — generic categorization compatible with
    these principles (no principle mandates new task categories); no edit required.
  - ✅ CLAUDE.md — runtime guidance file already aligns with adopted principles
    (file-existence check, RTK Query for API calls, primary-* palette, App Router
    conventions); referenced from Governance below as the canonical guidance file.

Follow-up TODOs: none.
-->

# Project Chaos Frontend Constitution

## Core Principles

### I. Type Safety as the First Line of Defense

This codebase has no automated test suite and does not run a linter; the
TypeScript compiler (executed as part of `npm run build`) is therefore the only
mechanical correctness gate. All shared types MUST live under `/app/types/`
and be imported from there — no inline `interface` duplications across files.
The use of `any` is forbidden in production code; use `unknown` with a narrowing
guard if the shape is genuinely dynamic. `npm run build` MUST succeed before any
change is considered complete, because Next.js performs the project type-check as
part of the build.

**Rationale**: Without unit/integration tests in the dependency tree
(no jest, no vitest, no playwright) and without a lint step, the type system is
the only mechanical verification available. Weakening it is equivalent to
disabling tests in a tested project.

### II. Server State Through RTK Query

Every HTTP call to the Spring Boot backend MUST go through an RTK Query endpoint
defined in `/app/state/api/`. Components MUST consume RTK Query hooks
(`useXxxQuery`, `useXxxMutation`); raw `fetch`, `axios`, or ad-hoc `useEffect +
fetch` patterns inside components are forbidden. Cache invalidation MUST use
RTK Query's `tagTypes` / `invalidatesTags` mechanism, not manual refetching.

**Rationale**: Centralised API definitions give a single place for auth headers,
error handling, optimistic updates, and tag-based invalidation. Components that
fetch directly bypass the cache, multiply error-handling code, and break the
mental model on which the rest of the app is built.

### III. Reuse Before Creating (NON-NEGOTIABLE)

Before creating any new file, the contributor MUST first verify (via `Glob`,
`Grep`, or `ls`) that no existing file already serves the purpose. The only
exempt files are framework-mandated `layout.tsx` and `page.tsx` whose locations
are dictated by the Next.js App Router. Before authoring a new low-level UI
primitive, `/components/ui/` (shadcn/ui) MUST be checked first; before authoring
a new utility, `/lib/` MUST be checked first.

**Rationale**: Solo-developer projects accumulate duplicated components and
utilities far faster than team projects, because there is no second pair of eyes
in PR review. Mechanically enforcing "look first" is the cheapest defence against
the codebase becoming an attic.

### IV. Brand-Consistent Design System

The custom `primary-*` palette (`primary-lighter-3` through `primary-darker-4`,
defined in the Tailwind config) is the canonical brand colour source. Generic
Tailwind colours (`blue-500`, `slate-700`, etc.) MUST NOT be used where a
`primary-*` shade fits. Section headers MUST follow the established pattern
`bg-primary text-primary-foreground` with `px-6 py-4` padding. Dashboard-specific
accents (`azure-600`, `green-600`, `green-200`) are the next preference if the
`primary-*` palette does not fit; only after both are exhausted may a new
Tailwind colour be introduced — and that introduction MUST be justified in the
PR description.

**Rationale**: Visual consistency is a contract with the user. Drifting palettes
across components produce a "stitched-together" feel that no test suite catches
and that is expensive to retrofit later.

### V. App Router Discipline

The Next.js 15 / 16 App Router model is non-negotiable. `'use client'` MUST be
added only when the component needs client-only capability (state, effects,
browser APIs, event handlers, hooks). Authentication boundaries MUST be enforced
in `middleware.ts`, not duplicated across layouts. Authenticated routes MUST live
under `/app/(routes)/` and share `/app/(routes)/layout.tsx`. Route, file, and
directory names MUST be `kebab-case`; component identifiers MUST be `PascalCase`.

**Rationale**: Mixing server and client components arbitrarily defeats the
performance benefits of server rendering and produces hydration bugs that are
hard to diagnose. A single, explicit boundary is easier to defend than scattered
ad-hoc checks.

## Technology Stack & Constraints

The following stack is locked in for the lifetime of this constitution version;
swapping any item MUST be accompanied by a constitutional amendment (MAJOR bump):

- **Framework**: Next.js (App Router, standalone output) + React 19
- **Language**: TypeScript (strict mode)
- **State (client)**: Redux Toolkit
- **State (server / API cache)**: RTK Query — slices live in `/app/state/api/`
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`)
- **UI primitives**: shadcn/ui (Radix UI under the hood) — `/components/ui/`
- **Forms**: `react-hook-form`
- **Drag & drop**: `@dnd-kit/core` + `@dnd-kit/modifiers`
- **Rich text**: TipTap (`@tiptap/react` + starter kit + extensions)
- **Notifications**: `sonner` toasts — used uniformly for both success and error
- **Auth**: JWT decoded via `jwt-decode`; route protection in `middleware.ts`
- **Icons**: `lucide-react` and `react-icons` (Font Awesome / Material families)
- **Date handling**: `date-fns`

The frontend talks exclusively to the Spring Boot backend at
`https://github.com/stodolkiewicz/project-chaos-backend`. No third-party API may
be added without an amendment to this section.

## Development Workflow & Quality Gates

The following gates MUST pass before any change is merged to `main`:

1. `npm run build` — Next.js production build succeeds. This implicitly executes
   the TypeScript type-check and is the primary mechanical correctness gate
   (no separate `typecheck` or `lint` step is part of the workflow in this
   project; `next lint` exists in `package.json` but is intentionally NOT used).
2. **Manual UI verification** — for any change that touches UI or data flow, the
   author MUST start `npm run dev`, exercise the affected feature in a browser
   (golden path + at least one edge case), and confirm no regression in adjacent
   features. Type-check passing is not a substitute for verifying the feature
   actually works.
3. **Pre-deploy ritual** (see `README.md`): comment out `output: "standalone"` in
   `next.config.js`, run `npm run build && npx next start`, smoke-test the app,
   re-enable `output: "standalone"`, then tag the commit with the next semantic
   version (`git describe --tags --abbrev=0` shows the previous tag).

Commit messages SHOULD follow the existing terse, imperative style visible in
`git log` (e.g. "cleanup", "fix task display in column", "Attachments in Task
comments"). Branches MUST be merged via fast-forward or squash; long-lived
feature branches are discouraged for a solo project.

**Created**: 2026-04-27
