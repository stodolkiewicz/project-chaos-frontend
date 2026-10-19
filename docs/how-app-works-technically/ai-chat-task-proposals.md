# AI Chat & Task Proposals

The AI assistant can propose creating or deleting a task. The task changes only after the user confirms the proposal.

The decision behind this flow is described in the backend repository, in `docs/design-decisions/10-hitl.md`.

## How the chat response reaches the frontend

The answer is streamed as **Server-Sent Events (SSE)**. SSE is a text format in which the server sends a series of events over one open HTTP response.

Each event has a name and data:

```
event:token
data:{"text":" Hello"}

event:RequestDeleteTask
data:{"taskId":"5b0d...","title":"Zakupy"}
```

The request is sent to:

```
POST /api/v1/projects/{projectId}/users/{userId}/chat
```

The native browser `EventSource` sends only `GET` requests. The chat needs `POST` with a body and an `Authorization` header, so `aiService.ts` uses `fetchEventSource` from `@microsoft/fetch-event-source`.

### Events

| Event | Data | What the frontend does |
|---|---|---|
| `token` | `{ text }` | Appends `text` to the assistant message in the RTK Query cache |
| `RequestCreateTask` | `{ title, description }` | Adds a create proposal to the queue |
| `RequestDeleteTask` | `{ taskId, title }` | Adds a delete proposal to the queue |

The backend wraps each token in JSON. The SSE standard tells clients to strip one space after `data:`. A plain token `" H1"` would arrive as `"H1"`, and markdown would break.

### `fetchEventSource` options

- `openWhenHidden: true` keeps the stream open when the browser tab is hidden. By default the library closes the stream on a hidden tab and reopens it later. Reopening would send the user's message again.
- `onopen` throws when the response status is not OK. This turns a `429` (AI request limit) into a chat error.
- `onerror` rethrows the error. Rethrowing stops the library from retrying the request.

## Where the proposal comes from

The model has two tools on the backend: `createTask` and `deleteTask`. Neither tool changes a task. Each tool only sends an SSE event into the open stream.

The event can arrive before the model finishes writing its answer.

## What the frontend does with a proposal

1. `useAIChat` keeps proposals in a `proposals` array. Each proposal gets a random `id`.
2. `AIChatSheet` shows the first proposal from the array. The next one appears after the current one is closed.
3. `RequestCreateTask` opens `AICreateTaskDialog`. The dialog renders the regular `CreateTaskForm`, prefilled with the title and description from the model. The user can edit both fields.
4. The task is added at the end of the first board column. The dialog reads the columns and board tasks to compute `positionInColumn`.
5. Saving calls the regular `POST /api/v1/projects/{projectId}/tasks`.
6. `RequestDeleteTask` opens `AIDeleteTaskAlertDialog`. Confirming calls `DELETE /api/v1/projects/{projectId}/tasks/{taskId}` through the `deleteTask` mutation.
7. The `deleteTask` mutation invalidates the board, backlog and archived task lists. The event does not say which list holds the task.
8. Closing a dialog removes the proposal from the array. No request goes to the backend.

## What the model knows

The model never learns whether the user accepted a proposal. The system prompt tells it to read the current tasks after proposing a change. The task table is the only source of truth.

## Proposals are not stored

Proposals live only in React state. Reloading the page loses them. The user has to ask the AI again.
