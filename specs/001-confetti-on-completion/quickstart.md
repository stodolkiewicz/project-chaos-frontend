# Quickstart: Celebration Animation on Task Completion

**Feature**: `001-confetti-on-completion`
**Date**: 2026-04-27
**Audience**: developer verifying the feature works end-to-end after `/speckit-implement`

This is the manual smoke-test recipe. It maps directly to the spec's
Independent Test (User Story 1) and to Success Criteria SC-001..SC-005. There
is no automated test suite in this project, and lint is not used either
(Constitution Principle I: the TypeScript compiler — run as part of
`npm run build` — is the only mechanical correctness gate); manual
verification is the contract.

---

## Prerequisites

- `canvas-confetti` and `@types/canvas-confetti` installed (`npm install`).
- Spring Boot backend running (separate repo:
  `https://github.com/stodolkiewicz/project-chaos-backend`).
- Frontend dev server running:
  ```bash
  npm run dev
  ```
- Logged-in user with at least one project that has ≥2 columns and ≥1 task.
- Browser dev tools open; "Console" tab visible (to spot any errors).

---

## Smoke Test 1 — Happy path (SC-001, SC-002, SC-003-positive)

1. Navigate to the dashboard at `http://localhost:3000/dashboard`.
2. Open a project whose board has at least 2 columns and at least 1 task in a
   non-final column.
3. Drag a task from a non-final column into the **right-most** column.
4. **Expect**:
   - Within ~500 ms of releasing the drop, a confetti burst appears in the
     centre-bottom area of the viewport (≈60% down). (SC-001)
   - The burst plays for roughly 3 seconds and fully disappears within 5
     seconds total. (SC-002)
   - The task remains in the right-most column after the animation ends.
   - Browser console has no errors.

## Smoke Test 2 — Negative: middle-to-middle move (SC-003-negative)

1. From the same board, drag a task between two non-final columns
   (e.g., column 1 → column 2 of 3).
2. **Expect**: NO confetti animation plays. Move completes silently.

## Smoke Test 3 — Re-celebration (Acceptance Scenario 3, FR-006)

1. Drag a task from the right-most column back to a non-final column
   (no animation expected).
2. Drag the same task back into the right-most column.
3. **Expect**: confetti plays AGAIN. Each return is its own celebration.

## Smoke Test 4 — Stack semantics (Q1: Stack)

1. Quickly drag 2-3 tasks one after another into the right-most column
   (within ~1 second).
2. **Expect**: multiple confetti bursts visibly overlap on screen. None
   cancels another. None is queued — they all fire concurrently.

## Smoke Test 5 — Reduced motion (FR-004, SC-004)

1. Enable OS-level "reduced motion":
   - **macOS**: System Settings → Accessibility → Display → Reduce Motion.
   - **Windows**: Settings → Accessibility → Visual effects → Animation effects → Off.
   - **Linux (GNOME)**: Settings → Accessibility → Reduce Animation.
   - **DevTools shortcut**: Chrome → Rendering panel → "Emulate CSS media
     feature `prefers-reduced-motion`" → "reduce".
2. Reload the page.
3. Drag a task into the right-most column.
4. **Expect**: the move completes normally. **No confetti animation plays.**
5. Restore the OS setting (or the DevTools emulation) and reload — confetti
   should fire again.

## Smoke Test 6 — Non-blocking interaction (SC-005)

1. Drop a task into the right-most column to start a celebration.
2. While the animation is playing, perform any of:
   - Click another task to open its detail.
   - Start dragging another task.
   - Scroll the board.
3. **Expect**: every interaction works with no perceivable delay. Confetti is
   purely cosmetic and on a separate canvas; it does not intercept pointer
   events.

## Smoke Test 7 — Trigger scope (FR-001 second clause / Q2)

1. Open a task detail (modal or detail panel) for a task that is in a
   non-final column.
2. If the detail panel offers a way to change the task's column (dropdown,
   menu, etc.), use it to set the column to the right-most one.
3. **Expect**: the task moves to the right-most column. **No confetti plays.**
   The celebration is exclusively the reward for a drag-and-drop on the board.

   *(If no such non-DnD column-change affordance exists in the current build,
   this test is vacuously satisfied — record the outcome as "N/A: no non-DnD
   change path available".)*

## Smoke Test 8 — Edge: newly created task in last column (FR-003)

1. Use the "Create task" affordance and place the new task directly into the
   right-most column.
2. **Expect**: NO confetti — only column-to-column transitions celebrate.

---

## Build gate (Constitution §"Development Workflow & Quality Gates")

After implementation, run **before** declaring the feature done:

```bash
npm run build   # must succeed (this is the type-check)
```

`npm run lint` is intentionally NOT part of the workflow in this project. The
`build` step is the only mechanical correctness gate; if it fails, stop and
fix — do not skip.

## Reverting

If you need to disable the feature locally without reverting the commit
(e.g., to debug an unrelated DnD issue), comment out the call to `celebrate()`
inside `app/(routes)/dashboard/components/DashboardContent.tsx`. The helper in
`lib/celebrate.ts` is dormant when not invoked.
