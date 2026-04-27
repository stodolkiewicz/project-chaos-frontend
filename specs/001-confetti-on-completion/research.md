# Phase 0 Research: Celebration Animation on Task Completion

**Feature**: `001-confetti-on-completion`
**Date**: 2026-04-27

This document records the technical decisions made before implementation. Each
section follows the format **Decision / Rationale / Alternatives considered**.

---

## R-001: Animation library — `canvas-confetti`

**Decision**: Use [`canvas-confetti`](https://github.com/catdad/canvas-confetti)
v1.9.x as the particle animation library.

**Rationale**:
- Tiny (~3 KB gzipped runtime), zero dependencies, single canvas overlay.
- Imperative API (`confetti(options)` returns a `Promise<null>`) — pairs
  perfectly with our fire-and-forget trigger model from Clarification Q1
  (Stack: every move fires its own independent burst).
- Auto-mounts and auto-cleans the canvas DOM element; we never have to
  `unmount`. This makes the "stack" semantics trivial: each call is independent.
- Officially typed via `@types/canvas-confetti` (DefinitelyTyped, current).
- The library's name is what Dawid wrote in the original prompt — alignment
  with user intent.

**Alternatives considered**:
- **`react-confetti`**: requires a mounted `<Confetti />` component with
  `width`/`height`/`numberOfPieces` props and lifecycle management. Stack
  semantics (Q1) become awkward — you'd need to map `Set<celebrationId>` to
  multiple mounted components. Rejected: more code for the same outcome.
- **`react-rewards`**: hook-based, requires a target ref to attach to.
  Hook-per-trigger doesn't match our "fire from a single point in
  `handleDragEnd`" model and would push the trigger logic up into the column
  component. Rejected: forces architectural change for no benefit.
- **Hand-rolled CSS keyframe animation**: would need to avoid layout thrash,
  handle stacking, hit 60 fps with 100+ particles. Reinvents `canvas-confetti`
  for no gain. Rejected.

---

## R-002: "Standard" intensity preset

**Decision**: A single helper `celebrate(origin?)` calls `confetti(...)` with
the following concrete parameters, derived from Clarification Q3 (Standard,
not subtle, not over-the-top). The `origin` is parameterised so the caller
can fire the burst from the dropped task's screen position; if omitted, a
viewport-centred fallback is used.

```ts
const STANDARD_BURST = {
  particleCount: 120,
  spread: 70,
  startVelocity: 35,
  ticks: 200,
  colors: ['#abdcff', '#2b7fff', '#1953bf', '#ffffff'],
  disableForReducedMotion: true,
};

celebrate(origin?: { x: number; y: number }): void
// → confetti({ ...STANDARD_BURST, origin: origin ?? { x: 0.5, y: 0.6 } })
```

The DnD handler in `DashboardContent.tsx` passes
`event.active.rect.current.translated` converted to viewport fractions:

```ts
const rect = event.active.rect.current.translated;
const origin = rect && {
  x: (rect.left + rect.width / 2) / window.innerWidth,
  y: (rect.top + rect.height / 2) / window.innerHeight,
};
celebrate(origin);
```

This makes the burst originate **from under the task** (the task's centre at
the moment of drop), not from a fixed point on screen — the celebration
"comes from where the work happened".

**Rationale**:
- `particleCount: 120` — visibly celebratory without overwhelming. The library's
  default is 50 (Subtle territory); fireworks-style would push 200+.
- `spread: 70°` — wide enough that particles fan across most of the visible
  board area, narrow enough to feel directional.
- `startVelocity: 35` — particles travel about 1/3 of the viewport height
  before gravity dominates; combined with `ticks: 200` (~3.3 s playback at
  60 fps) the burst lands inside SC-002 (≤5 s).
- `origin`: passed by the caller; computed as the dropped task's centre in
  viewport-fraction coordinates (top-down, matching `canvas-confetti`'s axis).
  Fallback `{ x: 0.5, y: 0.6 }` only used if the DnD event lacks a translated
  rect (defensive — should not happen in practice).
- **Colour palette**: `primary-lighter-1`, `primary`, `primary-darker-1` from
  the Tailwind brand palette, plus white for contrast. Satisfies Constitution
  Principle IV (Brand-Consistent Design System).
- `disableForReducedMotion: true` — built-in `canvas-confetti` flag that calls
  `window.matchMedia('(prefers-reduced-motion: reduce)')` internally and
  no-ops the call. Satisfies FR-004 and SC-004 with zero extra code.

**Alternatives considered**:
- Use one of `canvas-confetti`'s shipped presets (e.g., `"fireworks"`,
  `"snow"`, `"school pride"`): all are too thematic ("fireworks" reads as
  New Year, not "task done"; "snow" is wintery; "school pride" requires
  sustained two-side streams that fight the "stack" model).
- Centralise `colors` in a `lib/theme.ts` module: not yet justified — only one
  caller. Will revisit when a second feature needs the same palette.

---

## R-003: `prefers-reduced-motion` detection

**Decision**: Rely on `canvas-confetti`'s built-in
`disableForReducedMotion: true` option. Do NOT additionally call
`window.matchMedia` ourselves before the call.

**Rationale**:
- The library performs the check at the moment `confetti()` is called — exactly
  the timing we want. The OS preference can flip mid-session and the next
  drop will respect the new value without any cache invalidation on our side.
- Avoids duplicate logic and a footgun where our memoised matchMedia listener
  could drift from the library's check.
- Satisfies FR-004 ("MUST suppress") and SC-004 (100% suppression rate) by
  delegating to a battle-tested implementation.

**Alternatives considered**:
- Implement our own `useReducedMotion` hook (returns boolean, listens to
  `change` event): more code, no behavioural advantage. Rejected for solo
  project (Constitution Principle III: Reuse Before Creating).
- Add an explicit guard `if (matchMedia('(prefers-reduced-motion: reduce)').matches) return`
  before calling `confetti(...)`: redundant with library's flag. Rejected.

---

## R-004: "Last column" determination

**Decision**: Compute the right-most column at fire time as
`columns[columns.length - 1]` after sorting `columns` by `position` ascending.
The board's `ColumnDTO[]` is already sorted server-side in the existing
`useGetColumnsQuery` response (verified by manual inspection of board rendering
order in `DashboardContent.tsx`); we treat the last element of the array as
authoritative.

**Helper signature**:
```ts
isLastColumn(columnId: string, columns: ColumnDTO[]): boolean
// returns columns.length > 0 && columns[columns.length - 1].id === columnId
```

**Rationale**:
- Spec (Clarifications + Edge Cases): "last column = right-most by visual
  position". The same array that drives column rendering drives this check —
  so the celebration is provably aligned with what the user sees.
- Handles the **renamed column** edge case (FR-001 is positional, not
  name-based): we never look at `column.name`.
- Handles the **reordered columns** edge case: the next render of the board
  refreshes `columns`, and the next drop uses the new last column.
- `ColumnDTO.position: string` (likely a fractional-index string like `"a0"`,
  `"a1"`, `"b"`...) is *not* sorted by us — we trust server ordering. If
  ordering ever needs to be re-derived client-side, that is a future task,
  not part of this feature.

**Alternatives considered**:
- Sort on the client by `position` lexicographically before checking: redundant
  if the API already returns sorted; introduces drift if the API ever changes
  to a non-lexicographic scheme. Rejected unless future evidence shows the
  array can arrive unsorted.
- Mark the last column with a server-side `isFinal: boolean` flag: requires
  backend change, out of scope for this frontend feature, and misses the
  "user customises which column is rightmost" assumption.

---

## R-005: Where the trigger lives — in `handleDragEnd`, not in the mutation

**Decision**: Fire `celebrate()` inside the existing `handleDragEnd` callback in
`app/(routes)/dashboard/components/DashboardContent.tsx`, immediately after the
existing `await moveTask({...}).unwrap()` / `await moveTask({...})` call
returns successfully. NOT inside `onQueryStarted` of the RTK Query mutation
endpoint, and NOT inside `transformResponse`.

**Rationale**:
- Clarification Q2 explicitly limits the trigger to drag-and-drop on the
  board. If the trigger were inside the mutation thunk, **any** caller of
  `useMoveTaskMutation` would fire a celebration (e.g., a future task-detail
  modal that lets the user change column would unexpectedly celebrate). The
  DnD handler is the only path where the user has actually "dragged the task
  home", which is the celebration's emotional contract.
- The handler already `await`s the mutation; firing after the await means we
  satisfy "after the move happens" without rolling back optimistic visuals
  (per the earlier decision: trigger is immediate, not blocked on backend
  confirmation — but in this code path, the `await` resolves quickly and the
  user perception is "instant").
- Zero plumbing through Redux store or RTK Query lifecycle hooks.

**Alternatives considered**:
- Trigger inside `onQueryStarted` (RTK Query lifecycle hook on the mutation):
  rejected — fires for any caller, violates Q2.
- Subscribe to a Redux action via `addMatcher` / middleware listener: extra
  abstraction with no benefit over a direct call from the handler. Rejected.
- Wrap `useMoveTaskMutation` in a custom hook `useMoveTaskWithCelebration`
  that the board uses but the (future) modal does not: would work, but is
  over-engineered for a 3-line addition; loses the simplicity of "the DnD
  handler calls a helper". Rejected.

---

## Resolution Summary

| Clarification | Resolved by |
|---------------|-------------|
| Q1 (Stack concurrent celebrations) | R-001 (canvas-confetti's fire-and-forget) |
| Q2 (DnD only) | R-005 (trigger lives in `handleDragEnd`) |
| Q3 (Standard intensity) | R-002 (concrete `confetti(...)` params) |
| FR-004 reduced-motion | R-003 (delegate to library flag) |
| FR-001 last-column logic | R-004 (positional, last array element) |

No `NEEDS CLARIFICATION` markers remain. Phase 0 complete.
