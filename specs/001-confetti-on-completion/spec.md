# Feature Specification: Celebration Animation on Task Completion

**Feature Branch**: `001-confetti-on-completion`
**Created**: 2026-04-27
**Status**: Draft
**Input**: User description: "chce żeby po przeniesieniu taska do ostatniej kolumny na boardzie, uruchamiała się animacja z canvas confetti. zainstaluj tą bibliotekę też."

## Clarifications

### Session 2026-04-27

- Q: How should concurrent celebrations behave when multiple qualifying moves happen in quick succession? → A: Stack — every move starts its own independent animation; all animations play concurrently and visually overlay on screen; none cancels, queues, or coalesces with another.
- Q: Which user actions for changing a task's column should trigger the celebration? → A: Drag-and-drop on the board only. Other ways of changing a task's column (e.g., task-detail dropdowns, menus, keyboard shortcuts) do NOT trigger the celebration.
- Q: How visually intense should the celebration be? → A: Standard — a clearly celebratory burst at a default, recognisable scale; covers a noticeable portion of the board area for a few seconds. Not subtle (must read as a deliberate celebration), not over-the-top (must not dominate the screen or interfere with usability).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Celebrate task completion (Priority: P1)

A project member is working through tasks on a Kanban board. When they finish a
task, they drag it from its current column into the board's right-most column
(typically the "Done"-style column). The moment the move happens, a short
celebratory animation plays across the board, giving the user a small but
distinct moment of recognition for the completed work. The animation does not
interrupt their workflow — they can immediately continue working with the
board.

**Why this priority**: This is the entire feature. There are no secondary user
journeys; the celebration moment is the whole value.

**Independent Test**: Open a board that has at least two columns and at least
one task in a non-final column. Drag the task into the right-most column.
Observe that a visible celebratory animation plays for a few seconds, then
disappears on its own. Verify that the task remains in the right-most column
after the animation ends and that the rest of the board is responsive during
playback.

**Acceptance Scenarios**:

1. **Given** a board with at least two columns and a task in a non-final column,
   **When** the user moves the task into the right-most column,
   **Then** a celebratory animation plays for a short period (a few seconds) and
   then disappears on its own, while the task stays in the right-most column.
2. **Given** a board with at least three columns and a task in the first column,
   **When** the user moves the task to a middle column,
   **Then** no celebratory animation plays.
3. **Given** a task already in the right-most column,
   **When** the user moves it into a non-final column and then back into the
   right-most column,
   **Then** the celebratory animation plays again (each completion is its own
   celebration).
4. **Given** a user who has the operating-system "reduced motion" accessibility
   preference enabled,
   **When** they move a task into the right-most column,
   **Then** the task move completes normally but no celebratory animation plays.

### Edge Cases

- **Single-column board**: There is no "transition into the last column from
  another column" possible, so the celebration never triggers.
- **Right-most column renamed** (e.g., "Done" → "Closed"): The celebration still
  triggers; the trigger condition is positional, not name-based.
- **Columns reordered**: After reorder, the celebration triggers on whatever is
  now the right-most column. Tasks already sitting in the previously-final
  column are not retroactively celebrated.
- **Newly created task placed directly in the right-most column**: No
  celebration plays — only transitions from another column count.
- **Rapid back-and-forth moves**: A celebration that has already started plays
  through to the end; subsequent moves out of the right-most column do not
  cancel an animation already in progress.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST trigger a visible celebratory animation immediately
  when a user completes a drag-and-drop on the board that places a task into the
  right-most column from any non-final column. Drag-and-drop on the board is the
  ONLY trigger; other affordances for changing a task's column (e.g.,
  dropdowns, menus, keyboard shortcuts) MUST NOT trigger the celebration.
- **FR-002**: System MUST NOT trigger the celebratory animation for moves
  between any two non-final columns.
- **FR-003**: System MUST NOT trigger the celebratory animation when a task is
  newly created directly inside the right-most column (only transitions from
  another column count as completions).
- **FR-004**: System MUST suppress the celebratory animation entirely when the
  user has indicated a preference for reduced motion through standard
  accessibility settings; the underlying task move MUST still complete normally.
- **FR-005**: The celebratory animation MUST be self-dismissing — it disappears
  on its own without requiring any user action — and MUST be non-blocking — the
  user remains able to drag, click, scroll, and otherwise interact with the
  board while it plays.
- **FR-006**: The celebratory animation MUST trigger every time a qualifying
  move occurs; the system MUST NOT deduplicate, throttle, or limit celebrations
  on a per-task or per-session basis. When multiple qualifying moves occur in
  quick succession, all resulting animations MUST play concurrently and overlay
  on screen; no animation may cancel, queue, or coalesce another.
- **FR-007**: The celebratory animation MUST be presented at a "Standard"
  visual intensity — clearly recognisable as a celebration, covering a
  noticeable portion of the board area for the duration of the animation, but
  not so large or aggressive as to dominate the screen or impede the user's
  ability to read or interact with the board.

### Key Entities

- **Task**: A unit of work tracked on a project board; can be moved between
  columns by a user.
- **Column**: A vertical lane on a project board representing a workflow stage;
  has a defined position (ordering) on the board.
- **Board**: The set of columns belonging to a project; has at least one
  column.
- **Move event**: A user-initiated drag-and-drop on the board that changes a
  task's column from one to another.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: When a user moves a task into the right-most column on a board,
  the celebratory animation becomes visible within 500 ms of the move.
- **SC-002**: The celebratory animation completes and is no longer visible
  within 5 seconds of having started.
- **SC-003**: 100% of qualifying moves (transition from any non-final column
  into the right-most column) trigger the animation; 0% of non-qualifying moves
  (between non-final columns, or new tasks created directly in the right-most
  column) trigger it.
- **SC-004**: For users with reduced-motion preferences enabled, 100% of moves
  into the right-most column complete normally with zero animation playback.
- **SC-005**: While the celebratory animation is playing, the user can perform
  any other board interaction (start a new drag, open a task, scroll the board)
  with no perceivable delay or input loss.

## Assumptions

- **"Last column" means the right-most column on the board by visual position**
  — not a column with a specific name like "Done" or "Closed". Boards in this
  product can be customised by users; the celebration follows whichever column
  the user has chosen to place rightmost.
- **A "move" for the purpose of this celebration is specifically a
  drag-and-drop completion on the board.** Other UI affordances that may also
  change a task's column (task-detail dropdowns, menus, keyboard shortcuts,
  programmatic updates) do NOT trigger the celebration, even when the
  destination is the right-most column.
- **Each completion celebrates independently.** Moving the same task in, out,
  and in again counts as two completions and produces two celebrations.
- **The celebration is local to the user who performed the move.** Other
  members of the project viewing the same board in real-time do not see the
  celebration on their screens (real-time propagation is out of scope for this
  feature).
- **Boards have at least one column.** Boards with exactly one column are
  trivially handled — there is no "transition from another column" possible.
- **The reduced-motion preference is detected via standard browser/OS
  accessibility signalling.** No in-app toggle for disabling celebrations is
  introduced in this feature.
- **Out of scope**: handling of failed moves, error notifications, and
  rollback behaviour. Those are existing application concerns and are not
  changed by this feature.
