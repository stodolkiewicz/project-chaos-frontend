# Phase 1 Data Model: Celebration Animation on Task Completion

**Feature**: `001-confetti-on-completion`
**Date**: 2026-04-27

## Summary

This feature introduces **zero new persisted entities** and **zero new shared
types**. It is a pure UI side-effect that consumes existing types. This file
exists for completeness of the Spec Kit workflow and to make the consumed-type
map explicit.

## Consumed entities (existing types)

| Type | Source | Used for |
|------|--------|----------|
| `ColumnDTO` | `app/types/ColumnDTO.ts` | The `columns` array passed to `isLastColumn(columnId, columns)`. Only `id` and `position` are read. |
| `BoardTaskDTO` | `app/types/BoardTasksDTO.ts` | The dragged task's `column.id` (source column) is read by `handleDragEnd`. |
| `UpdateTaskColumnDTO` | `app/types/UpdateTaskColumnDTO.ts` | Existing argument shape for `useMoveTaskMutation`; `targetColumnId` is the destination read by the celebration check. |

```ts
// Reference shapes (do not redefine; import from their existing modules):

interface ColumnDTO {
  id: string;
  name: string;
  position: string; // fractional-index ordering; treated opaquely
}

interface BoardTaskDTO {
  taskId: string;
  // ... other fields ...
  column: { id: string; name: string };
  positionInColumn: number;
}

interface UpdateTaskColumnDTO {
  targetColumnId: string;
  positionInColumn: number;
  nearestNeighboursPositionInColumn: number[];
}
```

## New types

**None** — the helper module exposes plain functions:

```ts
// lib/celebrate.ts (new)

export function celebrate(origin?: { x: number; y: number }): void;
export function isLastColumn(columnId: string, columns: ColumnDTO[]): boolean;
```

`celebrate(origin?)` returns `void` (the underlying `confetti(...)` returns
`Promise<null>` but we deliberately do not await — fire-and-forget per
Clarification Q1).

The optional `origin` parameter is in `canvas-confetti`'s viewport-fraction
coordinate system (`x`, `y` ∈ [0, 1], top-down). When omitted, the helper
falls back to a viewport-centred origin. The DnD handler passes the dropped
task's centre, computed from `event.active.rect.current.translated`, so the
celebration originates from under the task.

`isLastColumn` is a pure boolean predicate. Its definition is co-located with
`celebrate` because they are conceptually one feature; introducing a separate
`lib/columns.ts` would violate Reuse Before Creating (one tiny utility, one
file).

## State transitions

**None.** No client-side state is added by this feature. Each celebration is
ephemeral: the `canvas-confetti` library mounts a transient canvas, plays
particles, and self-cleans within ≤5 s. The Redux store is not touched.

The only data-flow visible to the user is:

```
[user drops task]
       ↓
DnD onDragEnd  →  await moveTask({ targetColumnId, ... })
       ↓ (resolved)
isLastColumn(targetColumnId, columns)?
       ↓ (true)
celebrate()  →  canvas-confetti fires
       ↓
[animation auto-plays for ~3 s, then disappears]
```

No persisted state, no Redux actions, no RTK Query cache changes triggered by
the celebration itself.

## Validation rules

| Source field | Rule | Where enforced |
|---|---|---|
| `targetColumnId` (from `event.over.id` in DnD) | Must equal `columns[columns.length - 1].id` for the celebration to fire. | `isLastColumn` predicate inside `handleDragEnd`. |
| Source column ID (read from the dragged `BoardTaskDTO.column.id`) | Must NOT equal `targetColumnId` (FR-002, FR-003). If equal, no celebration — the user reordered within the same column. | `handleDragEnd` short-circuits before calling `celebrate`. |
| `prefers-reduced-motion: reduce` | If matched at fire time, suppress the animation entirely; the move still completes. | `canvas-confetti` library's built-in flag (`disableForReducedMotion: true` in `celebrate()` options). |
