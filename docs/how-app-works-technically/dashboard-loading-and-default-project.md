# Dashboard Loading & Default Project Management

## What happens when a user visits `/dashboard`

### 1. Middleware (before anything renders)

`middleware.ts` intercepts every request to `/dashboard/*` before it reaches any page or layout.

It checks the `access_token` cookie:
- **Missing or expired** → redirect to `/` immediately. Nothing else runs.
- **Valid** → request is allowed through.

This is a pure guard — it decodes the JWT and checks `exp`, nothing more.

### 2. Server-side: token extraction

The `Dashboard` page (`app/dashboard/page.tsx`) is a **Next.js Server Component**. Before rendering anything, it reads the `access_token` cookie from the request, decodes the JWT, and extracts user data (name, email, picture, tokens).

The decoded user object is passed as a prop to `AuthenticatedLayout`.

### 3. AuthenticatedLayout — Redux initialization + gate

`AuthenticatedLayout` is a **Client Component**. It does three things:

1. **Wraps everything in a Redux `<Provider>`** — sets up the store for all child components.
2. **Passes the user object to `UserProvider`**, which dispatches `setUser` to the Redux store (`userSlice`). This puts the access token into the store, making it available to all RTK Query requests.
3. **Renders `<TopMenu />`** and the page content below it.

`UserProvider` also calls `useGetDefaultProjectIdQuery()` internally and **blocks rendering of all children** (showing a spinner) until the default `projectId` comes back from the API. This ensures `DashboardContent` never mounts without a valid project ID.

### 4. Client-side: fetching data

Once the layout is rendered, `DashboardContent` (a Client Component) starts making API calls using RTK Query.

The calls happen in two stages:

**Stage 1 — always fires immediately:**

```
GET /api/v1/projects/default
```

Returns the `projectId` of the user's default project.

**Stage 2 — fires in parallel, but only after stage 1 resolves and a valid `projectId` is available:**

```
GET /api/v1/projects/{projectId}          → project name and metadata
GET /api/v1/projects/{projectId}/columns  → board columns (e.g. "To Do", "In Progress")
GET /api/v1/projects/{projectId}/tasks    → all tasks on the board
```

All three stage-2 queries are skipped (`skip: true`) if the access token or `projectId` is missing.

### 3. Rendering

- **No default project** (new user): a "Create your first project" dialog is shown. Columns and tasks are never fetched.
- **Default project exists**: the board renders with all columns and tasks grouped and sorted by `positionInColumn`.

---

## How the default project works

The concept of a "default project" is used to decide **which project to show** when the user lands on the dashboard, without requiring them to select one manually.

- The backend exposes `GET /api/v1/projects/default`, which returns the `projectId` of the user's default project.
- The frontend treats this ID as the entry point — all board data (columns, tasks) is loaded for this project.
- If the endpoint returns no project (e.g. the user just registered), the dashboard renders a prompt to create the first project. Once created, the `DefaultProject` RTK cache tag is invalidated, which triggers a refetch of `/default` and loads the new project automatically.

### Where is the current `projectId` stored?

The `projectId` is **not** stored in Redux slice state. It lives exclusively in the **RTK Query cache** — it's the result of the `getDefaultProjectId` query (`ProjectsApiSlice`).

There is no `currentProjectId` field in `userSlice`. The `userSlice` only holds user identity data: `firstName`, `email`, `pictureUrl`, `accessToken`, `refreshToken`.

Any component that needs the current project ID reads it by calling `useGetDefaultProjectIdQuery()` and accessing `data.projectId`.

> **Note:** `UserProvider` also calls `useGetDefaultProjectIdQuery()` to gate rendering — it blocks the entire dashboard from rendering until the default project ID is available, showing a spinner in the meantime.

### When does the default `projectId` change?

There are two cases:

**1. User creates their first (or a new) project**

The `createProject` mutation (`POST /api/v1/projects`) invalidates the `DefaultProject` RTK tag, which causes RTK Query to automatically re-fetch `GET /api/v1/projects/default`. The response updates the cached `projectId`.

**2. User switches to a different project via the project menu**

`ProjectMenu` shows a dropdown list of all the user's projects (fetched via `GET /api/v1/projects/simple`). Clicking another project calls:

```
PATCH /api/v1/users/default-project
Body: { newDefaultProjectId: "<id>" }
```

This is handled by the `changeProjectForUser` mutation in `UsersApiSlice`. It uses an **optimistic update**: the RTK Query cache for `getDefaultProjectId` is updated immediately (before the backend responds), so the board switches instantly. If the request fails, the cache is rolled back automatically.

### RTK Query cache tags involved

| Tag | Invalidated when |
|---|---|
| `DefaultProject` | A new project is created |
| `Projects` | A new project is created |
| `Columns` | — (refetched on window focus) |
| `Tasks` | Task is created, deleted, or moved |

All queries also use `refetchOnFocus: true`, meaning data is re-fetched automatically when the user returns to the browser tab.
