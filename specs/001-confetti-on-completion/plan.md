# Implementation Plan: Celebration Animation on Task Completion

**Branch**: `001-confetti-on-completion` | **Date**: 2026-04-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-confetti-on-completion/spec.md`

## Summary

Wire a small, self-contained "completion celebration" into the existing
drag-and-drop flow on the Kanban board. When the user drops a task into the
right-most column from any non-final column, fire a `canvas-confetti`
"Standard"-intensity burst exactly once per drop. Stack overlapping celebrations
freely (no dedup). Suppress when `prefers-reduced-motion: reduce`.

The change is local: one new tiny utility (`lib/celebrate.ts`), a 3-line
addition to the existing `handleDragEnd` in `app/(routes)/dashboard/components/
DashboardContent.tsx`, plus the `canvas-confetti` dependency. No backend
contract changes, no Redux store changes, no new RTK Query slices, no new
shared types.

## Technical Context

**Language/Version**: TypeScript (strict mode), Next.js 16.1, React 19.2
**Primary Dependencies** (added by this feature):
- `canvas-confetti@^1.9.4` — runtime particle animation library
- `@types/canvas-confetti@^1.9.0` — type declarations (devDependency)

**Existing dependencies leveraged**: `@dnd-kit/core` (already wires
`DndContext` / `onDragEnd`), `@reduxjs/toolkit` + RTK Query (mutation
`useMoveTaskMutation` already in place).

**Storage**: N/A — feature is purely client-side UX; no persistence.
**Testing**: Manual UI verification per Constitution §"Development Workflow &
Quality Gates" (no automated test runner exists in this project; `npm run lint`
is also not part of the workflow).
**Target Platform**: Modern desktop browsers (Chrome, Firefox, Safari, Edge).
Mobile is out of scope for this feature (drag-and-drop on touch devices is a
separate, pre-existing concern).
**Project Type**: Web frontend (Next.js App Router) talking to an external
Spring Boot backend.
**Performance Goals**:
- Animation visible within 500 ms of drop confirmation (SC-001).
- Animation completes within 5 s (SC-002).
- No perceivable input loss during playback (SC-005).
**Constraints**:
- No automated test suite and no lint step in the workflow; correctness
  defended by TypeScript strict mode (run as part of `npm run build`) per
  Constitution Principle I.
- Trigger MUST live in the DnD handler, not in any RTK Query mutation, so that
  non-DnD column changes do not fire the celebration (Clarification Q2 →
  Drag-and-drop only).
- Must respect `prefers-reduced-motion: reduce` via `window.matchMedia` —
  detected at fire-time, not memoised (so the user can flip the OS setting
  mid-session).
**Scale/Scope**: 1 new file (~30 LOC), 1 modified file (~5 LOC delta),
2 dependencies. Zero schema, zero API surface change.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Reasoning |
|-----------|--------|-----------|
| I. Type Safety as the First Line of Defense | ✅ PASS | `@types/canvas-confetti` provides full strict types; helper signature uses concrete `confetti.Options` type, no `any`. `npm run build` will type-check (this is the only mechanical correctness gate in this project — lint is not used). |
| II. Server State Through RTK Query | ✅ PASS (vacuous) | Feature performs no HTTP calls. The existing `useMoveTaskMutation` is reused unchanged; no new fetch / axios introduced. The principle scopes server state, not UI side-effects. |
| III. Reuse Before Creating (NON-NEGOTIABLE) | ✅ PASS | `lib/` checked: only `apiConfig.ts`, `tiptapUtils.ts`, `tokenHelper.ts`, `utils.ts` — no existing celebration utility. `components/ui/` checked: no confetti primitive. `app/hooks/` has only `useErrorHandler.ts` — no animation hook to extend. New file `lib/celebrate.ts` is the minimum to host the helper; it is NOT a component (no `components/` pollution). |
| IV. Brand-Consistent Design System | ✅ PASS | Confetti particle palette uses `primary-*` brand hex values (`#abdcff`, `#2b7fff`, `#1953bf`, plus a contrasting accent — see research.md). No new Tailwind colour introduced. |
| V. App Router Discipline | ✅ PASS | `DashboardContent.tsx` is already `'use client'` (state, hooks, DnD). No new `'use client'` directives needed. No middleware changes. No route layout changes. |

**Constitution Check Verdict**: All five principles PASS. No Complexity Tracking
entries needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-confetti-on-completion/
├── plan.md              # This file (/speckit-plan output)
├── research.md          # Phase 0 output (decisions: lib choice, preset, RM detection, last-column logic)
├── data-model.md        # Phase 1 output (no new entities — reuse map)
├── quickstart.md        # Phase 1 output (manual smoke-test recipe)
├── spec.md              # /speckit-specify + /speckit-clarify output
├── checklists/
│   └── requirements.md  # /speckit-specify validation checklist
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created by this command)
```

**No `contracts/` directory**: this feature exposes no new external interface.
The HTTP contract (`UpdateTaskColumnDTO` → `useMoveTaskMutation`) is unchanged.
Per plan-template guidance ("Skip if project is purely internal..."), `contracts/`
is intentionally omitted.

### Source Code (repository root)

Affected paths in the existing Next.js project:

```text
project-chaos-frontend/
├── app/
│   ├── (routes)/dashboard/components/
│   │   └── DashboardContent.tsx        # MODIFIED — fire celebrate() after successful moveTask
│   ├── state/
│   │   ├── TasksApiSlice.ts            # UNCHANGED — useMoveTaskMutation reused as-is
│   │   └── ColumnsApiSlice.ts          # UNCHANGED — useGetColumnsQuery reused as-is
│   ├── types/
│   │   └── ColumnDTO.ts                # UNCHANGED — { id, name, position: string } already sufficient
│   └── hooks/
│       └── useErrorHandler.ts          # UNCHANGED
├── lib/
│   └── celebrate.ts                    # NEW — exports `celebrate()` and `isLastColumn(columnId, columns)`
└── package.json                        # MODIFIED — adds canvas-confetti + @types/canvas-confetti
```

**Structure Decision**: Strictly additive within the existing Next.js App Router
layout. The single new file lives in `lib/` (not `app/components/` or
`components/ui/`) because it is a pure utility module, not a React component
or shadcn primitive. The DnD wiring stays in `DashboardContent.tsx`, which is
the only `DndContext` host in the app.

## Phase 0 — Research

See [research.md](./research.md) for:
1. **Library choice**: `canvas-confetti` vs `react-confetti` vs `react-rewards`.
2. **"Standard" preset translation**: concrete `confetti({...})` parameters that
   map to clarification answer Q3 (Standard intensity, brand-coloured).
3. **`prefers-reduced-motion` detection**: `window.matchMedia` strategy + why
   not memoise.
4. **"Last column" determination**: how to derive the right-most column from
   `ColumnDTO[]` (which has `position: string`).
5. **Trigger placement**: why inside `handleDragEnd` after `await moveTask(...)`,
   not inside `onQueryStarted` of the RTK Query mutation.

## Phase 1 — Design

See [data-model.md](./data-model.md) for the (small) entity map.
See [quickstart.md](./quickstart.md) for the manual smoke-test sequence.

**Agent context update**: `CLAUDE.md` block between `<!-- SPECKIT START -->`
and `<!-- SPECKIT END -->` updated to reference this plan file.

## Constitution Re-check (Post-Design)

After completing research.md and data-model.md, all five principles still pass:

- **I. Type Safety**: helper signatures finalised in research.md as
  `celebrate(): void` and `isLastColumn(columnId: string, columns: ColumnDTO[]): boolean`.
  Both fully typed, no `any`, no `as` casts.
- **II. RTK Query**: zero new endpoints; `useMoveTaskMutation` reused.
- **III. Reuse**: only `lib/celebrate.ts` is new; existing files extended in
  place.
- **IV. Brand-Consistent Design**: palette confirmed in research.md
  (`#abdcff`, `#2b7fff`, `#1953bf`, plus `#ffffff` for contrast).
- **V. App Router**: no boundary changes.

No violations introduced during design. **Plan is ready for `/speckit-tasks`.**

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified.

*No violations to justify — table intentionally empty.*
