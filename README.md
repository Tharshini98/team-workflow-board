# Team Workflow Board

A small Trello/Jira-style board: view tasks grouped by status, create and
edit them through a validated form, filter and sort with state that lives in
the URL, and persist everything to `localStorage` with a versioned schema and
a migration path. Includes a small reusable component library
(`src/components/ui`).

Built with **React + plain JavaScript (JSX)** — no TypeScript — and
**Tailwind CSS**, on **Vite**.

## Running it

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run test      # run the test suite once (Vitest + React Testing Library)
npm run test:watch
```

## Architecture overview

### Folder structure

```
src/
  components/ui/     # the design-system components (Button, TextInput, TextArea,
                      # Select, Tag/Badge, Card, Modal, Toast) — no app-specific logic
  features/tasks/     # board UI: TaskBoard, TaskColumn, TaskCard, TaskForm, FiltersBar
  hooks/               # useTasks, useUrlFilters, useDirtyGuard — the app's state layer
  utils/               # storage.js, id.js, relativeTime.js — small, pure, testable
  data/                # seed.js — first-run sample data + shared enums (STATUSES, PRIORITIES)
  tests/               # Vitest + Testing Library specs
```

The split follows: **ui/** (presentational, reusable, zero app knowledge) →
**features/tasks/** (composes ui/ into the actual board) → **hooks/**
(container logic: state, persistence, URL sync) → **utils/** (pure functions,
no React). `TaskBoard` is the only component that talks to hooks directly;
everything under it just receives props and callbacks, which is what keeps
`TaskCard` cheap to test and cheap to re-render.

### State & data flow

- **`useTasks`** owns the task array. It loads from `localStorage` on mount
  (running migrations if needed — see below), and re-saves on every change.
  It exposes `createTask`, `updateTask`, `moveTask`, `deleteTask`, plus
  `status` (`'loading' | 'ready' | 'unavailable'`) so the UI can show a clear
  message if storage isn't usable (private browsing, quota exceeded, etc.)
  instead of failing silently.
- **`useUrlFilters`** reads status/priority/search/sort/direction from the
  URL's query string (via `react-router-dom`'s `useSearchParams`) and writes
  back to it on every change, with `replace: true` so filtering doesn't spam
  the browser history. This makes a filtered, sorted view copy-pasteable and
  restorable on refresh. `applyFilters()` — the actual filter/sort logic — is
  a plain, exported function, deliberately kept out of the hook so it can be
  unit-tested without rendering anything (see `tests/filters.logic.test.js`).
- **`useDirtyGuard`** attaches a `beforeunload` listener while a form is
  dirty, covering the "warn before leaving with unsaved changes" requirement
  for tab close/refresh. In-app modal close is guarded separately with a
  `window.confirm()` in `TaskBoard`, since `beforeunload` can't intercept
  clicking the backdrop or the Cancel button.

No external state management library is used — `useState`/`useReducer`-style
local state plus two focused custom hooks was enough for this scope, and
avoids the "justify why you added Redux/Zustand" conversation for a
single-page, single-collection app. If the app grew multiple independently-
cached collections (tasks, users, projects) with cross-cutting cache
invalidation, I'd reach for something like Zustand or React Query at that
point rather than before.

### Storage & migration approach (`utils/storage.js`)

Data on disk is one JSON blob: `{ schemaVersion, tasks }`.

- `CURRENT_SCHEMA_VERSION` is the shape the app currently expects.
- `migrations` is a map keyed by the version being migrated **from** — e.g.
  `migrations[1]` turns a v1 blob into a v2 blob (v1 predates the `priority`
  and `tags` fields; the migration defaults `priority: 'Medium'` and
  `tags: []` onto every existing task).
- `runMigrations()` walks forward one step at a time until the data is on
  `CURRENT_SCHEMA_VERSION`, so adding a v3 later only means adding
  `migrations[2]` — the walking logic itself doesn't change.
- `loadTasks()` runs this on load and immediately re-persists the upgraded
  shape, so a user only pays the migration cost once. If a migration ran,
  `useTasks` surfaces a small dismissible banner ("Your saved data was
  upgraded to the latest format") rather than a blocking dialog — the
  "non-intrusive notification" requirement.
- `isStorageAvailable()` does a cheap write/delete probe so the app can
  detect a fully-unavailable `localStorage` (private mode in some browsers,
  storage disabled by policy) up front, rather than only discovering it on
  the first failed write.

### Component library (`components/ui`)

- **Field.jsx** is a small internal helper (not exported as part of the
  public component list) that centralizes label/error/hint markup and
  `aria-describedby`/`aria-invalid` wiring, shared by `TextInput`, `TextArea`
  and `Select` — composition over repeating that plumbing three times.
- **Modal** implements its own focus trap (Tab/Shift+Tab cycling), focuses
  the first focusable element on open, restores focus to the trigger element
  on close, and closes on `Escape` or backdrop click. It's rendered through a
  portal so it isn't clipped by any ancestor's `overflow: hidden`.
- **Toast** is a context provider (`ToastProvider` + `useToast()`) rendering
  into an `aria-live="polite"` region, so screen readers announce "Task
  saved." without stealing focus.
- **Button** takes `variant` (`primary | secondary | destructive | ghost`)
  and `size` (`sm | md | lg`) as the only two axes of variation, which is
  most of what came up in practice across the app.

### A refactor made during the build

`TaskColumn` originally received the full `tasks` array plus a `status`
string and filtered inline with `tasks.filter(t => t.status === status)`
inside the render. That meant every column re-ran the filter on every
render, and it duplicated the same `.filter()` three times (once per
column). It's now `TaskBoard`'s job to group tasks by status once
(`useMemo` over `filtered`, producing `byStatus`), and each `TaskColumn` just
receives the slice it should render — cheaper, and it also made
`TaskColumn` trivially testable in isolation with a plain array.

### Known limitations / trade-offs

- Drag-and-drop uses the native HTML5 DnD API rather than a library — no
  extra dependency, but it means no touch support out of the box (a
  status `<Select>`-driven "move to…" fallback would be the next addition
  for mobile).
- Tags are entered as a single comma-separated text field rather than a
  proper multi-select/token input — simpler to build and validate, at some
  cost to discoverability of existing tags.
- No undo for delete beyond the confirm dialog; a toast-based "Undo" action
  would be a nicer pattern than a blocking `window.confirm`.
- `beforeunload` cannot intercept SPA-internal navigation (there isn't any
  in this app beyond the modal, which is guarded manually) — noting this in
  case the app grows additional routes later.
- Storage is `localStorage` only; for a larger dataset or offline-first
  needs, IndexedDB would scale better, but the storage module is the only
  place that would need to change.

### If asked to extend this live

The most natural next feature is probably per-column WIP limits or a
"my tasks" quick filter — both slot into `useUrlFilters`/`applyFilters`
without touching the storage layer. A live refactor candidate: extracting
`TaskForm`'s validation into its own testable module the way `applyFilters`
already is, instead of the inline `validate()` function.
