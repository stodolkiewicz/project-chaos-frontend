---
description: "Task list for feature 001-confetti-on-completion"
---

# Tasks: Celebration Animation on Task Completion

**Input**: Design documents from `specs/001-confetti-on-completion/`
**Prerequisites**: `plan.md` (loaded), `spec.md` (loaded), `research.md` (loaded), `data-model.md` (loaded), `quickstart.md` (loaded)

**Tests**: Not generated — the spec did not request automated tests, this
project has no test runner (no jest/vitest/playwright per Constitution §I) and
does not lint either; correctness is defended by TypeScript strict mode (run as
part of `npm run build`) plus the manual smoke tests in `quickstart.md`. Manual
smoke testing is included as T005.

**Organization**: Tasks are grouped by user story. The spec contains exactly
one user story (US1, P1) — *Celebrate task completion* — which is the entire
MVP and the entire feature.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Maps task to a user story from `spec.md` (US1)
- File paths are absolute or repo-relative

## Path Conventions

This is a Next.js (App Router) frontend; paths follow the existing layout:

- App routes & components: `app/(routes)/dashboard/components/...`
- Utilities: `lib/...`
- Shared types: `app/types/...` (no edits in this feature)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the runtime dependency required for the feature.

- [X] T001 Install `canvas-confetti@^1.9.4` (runtime) and `@types/canvas-confetti@^1.9.0` (dev) via `npm install canvas-confetti && npm install --save-dev @types/canvas-confetti` — verify both appear in `package.json` and `package-lock.json` regenerates cleanly.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the celebration helper module before any user-story wiring depends on it.

**⚠️ CRITICAL**: User Story 1 (Phase 3) cannot start until Phase 2 is complete.

- [X] T002 Create new file `lib/celebrate.ts` exporting two functions: `celebrate(): void` (calls `confetti({ particleCount: 120, spread: 70, startVelocity: 35, ticks: 200, origin: { x: 0.5, y: 0.6 }, colors: ['#abdcff', '#2b7fff', '#1953bf', '#ffffff'], disableForReducedMotion: true })` per `research.md` R-002 and R-003) and `isLastColumn(columnId: string, columns: ColumnDTO[]): boolean` (returns `columns.length > 0 && columns[columns.length - 1].id === columnId` per `research.md` R-004). Import `confetti` from `'canvas-confetti'` and `ColumnDTO` from `'@/app/types/ColumnDTO'`. No `any` types, no `as` casts (Constitution §I).

**Checkpoint**: `npm run build` MUST succeed after T002 — the helper compiles in isolation before being wired up.

---

## Phase 3: User Story 1 — Celebrate task completion (Priority: P1) 🎯 MVP

**Goal**: When a user drags-and-drops a task into the right-most column from any non-final column, a `canvas-confetti` "Standard" burst plays for ~3 seconds, with `prefers-reduced-motion` respected and concurrent celebrations stacking freely.

**Independent Test**: Per `quickstart.md` Smoke Test 1 — drag a task from a non-final column into the right-most column; observe the confetti burst within 500 ms; verify the task remains in the right-most column after the animation; verify zero browser console errors.

### Implementation for User Story 1

- [X] T003 [US1] Modify `app/(routes)/dashboard/components/DashboardContent.tsx`: import `{ celebrate, isLastColumn }` from `'@/lib/celebrate'`, capture the source column ID from the dragged task **before** the `await moveTask(...)` call (read from `event.active.data.current` — type the data via `BoardTaskDTO['column']` shape — or via lookup of the task ID into `groupedTasks` to find which column it currently sits in), then immediately after the existing `await moveTask({...})` resolves successfully, call `celebrate()` only when (a) `isLastColumn(columnBeingDroppedIntoId, columns)` is true AND (b) the source column ID differs from `columnBeingDroppedIntoId` (FR-002, FR-003). Do not `await` `celebrate()` (fire-and-forget per `research.md` R-005 and Q1 stack semantics). Keep all existing behaviour (error handling via `handleApiError`) untouched.

**Checkpoint**: User Story 1 fully functional. Verified by Smoke Tests 1–8 in `quickstart.md`.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates per Constitution §"Development Workflow & Quality Gates". Lint is NOT used in this project — only `npm run build` and manual smoke tests.

- [X] T004 Run `npm run build` from repo root — MUST succeed. This implicitly executes the TypeScript strict type-check; any `any` slip-through or missing import will fail the gate. Constitution §I requires this to pass before declaring the change complete.
- [ ] T005 Execute the 8 manual smoke tests from `specs/001-confetti-on-completion/quickstart.md` in the running dev server (`npm run dev`): (1) happy path, (2) middle-to-middle no-celebration, (3) re-celebration on re-entry, (4) stack semantics with rapid drops, (5) reduced-motion suppression, (6) non-blocking interaction during playback, (7) trigger scope (DnD-only), (8) no celebration on freshly-created task placed in last column. Record any deviation; all 8 must pass.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (T001)**: No dependencies — can start immediately.
- **Foundational (T002)**: Depends on T001 (the helper imports from `canvas-confetti`).
- **User Story 1 (T003)**: Depends on T002 (the handler imports from `lib/celebrate.ts`).
- **Polish (T004, T005)**: Depends on T003 (gates verify completed feature).

### Within User Story 1

- T003 is a single edit in a single file; no internal parallelism.

### Parallel Opportunities

- None in this list. T004 (`npm run build`) and T005 (manual smoke tests in `npm run dev`) cannot run in parallel — they would race for the `.next/` folder. Run sequentially.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

User Story 1 *is* the MVP. There are no follow-on stories. Sequence:

1. T001 — Install dependencies.
2. T002 — Create `lib/celebrate.ts`.
3. T003 — Wire `celebrate()` into `handleDragEnd`.
4. T004 — `npm run build` (must succeed).
5. T005 — Manual smoke tests (`quickstart.md`).
6. **Stop**: feature is complete. No additional incremental delivery is expected.

### Single-shot Strategy

For a feature this small (1 new file ~30 LOC, 1 modified file ~5 LOC delta, 2 deps), all five tasks are realistically completable in one focused session. The phase boundaries exist primarily as **gates**, not as separate work sessions.

---

## Notes

- No `[P]` markers in this list — all five tasks have linear dependencies.
- The spec defines no automated test tasks (per Constitution §I, this codebase has no test runner) and lint is not used in this project. T005 (manual smoke tests) is the only verification step beyond the build gate (T004).
- `lib/celebrate.ts` colocates `celebrate()` and `isLastColumn()` deliberately — splitting them across two files would violate Constitution §III (Reuse Before Creating) for a feature this small.
- Commit at the end of T003 (full feature wired) and again after T005 (gates clean), or as a single commit after T005 — Dawid's preference per recent style ("cleanup", terse imperative — see `git log`).
- Avoid: introducing `any`, adding new Tailwind colours outside the brand palette, adding new RTK Query endpoints, adding new shared types in `app/types/`. None of these are needed.
