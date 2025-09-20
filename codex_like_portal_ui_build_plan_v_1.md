# Codex-like Portal UI — Build Plan (G-level, v1)

## 1) Scope
- Routes: `/tasks`, `/tasks/:id` (tabs: `diff` | `logs`), `/settings/environments`.
- UX primitives: left rail + top bar shell; task list with status and +/- counts; task detail view with sidebar (Summary/Files) and main tabs (Diff/Logs); Settings → Environments table.
- Accessibility: WCAG 2.1 AA baseline; keyboard-first navigation; prefers-reduced-motion support.
- Performance: smooth diff rendering for large files, streamed logs, virtualized lists.

## 2) Technology & Libraries
- **App**: React 18 + TypeScript with Vite bundler.
- **Routing**: React Router v6.
- **Server state**: TanStack Query.
- **Design system**: Fluent UI v9 (dark-first tokens, supports light).
- **Syntax highlighting**: highlight.js (batched).
- **Local UI state**: Zustand (blades, preferences, modals).
- **Testing**: Vitest + React Testing Library; Playwright for smoke tests.

## 3) Repository Layout
```
portal/
  src/
    app/               # route files, loaders, error boundaries
    components/        # DataGrid, Diff, Logs, Pills, Toolbar, BladeStack, Sidebar
    api/               # ApiClient, adapters, DTOs, zod validators
    state/             # zustand stores (prefs, blades, toasts)
    theme/             # tokens, theme boot (dark/light), global styles
  public/
```
- Deep-link helper encodes UI state in URL (e.g., `?tab=logs&mode=inline`).

## 4) Phase Plan

### Phase 0 — Scaffold & Theme Boot
- Initialize Vite React TS project; add ESLint/Prettier.
- Wire Fluent v9 Provider; pre-paint theme boot (sets `data-theme` + `color-scheme`).
- Set up Router, ErrorBoundary, basic layout shell and placeholder routes.

**Exit criteria**: App builds and routes render; dark mode loads without flash.

---

### Phase 1 — Task List
- Implement left rail (Tasks, Archive [placeholder], Settings) and top bar actions.
- Build `TaskList` using Fluent `DataGrid` with windowing/virtualization.
- Columns: Title, Repo, Status pill (open|running|merged|archived|failed), `+/-` counts, Created time.
- Search input focused by `/`, Enter opens focused row; sort by time/status.

**Exit criteria**: Fetch & display tasks; search/sort work; keyboard navigation passes axe checks.

---

### Phase 2 — Task Detail Layout
- Two-pane layout.
  - **Sidebar**: request text, worked-time chip, bullet Summary, Testing badges, expandable Files with per-file `+/-` counts.
  - **Main**: tabbed area with `Diff` (default) and `Logs`.
- Sticky toolbar (Archive, Share, View PR) with responsive breakpoints.

**Exit criteria**: Navigating to a task shows populated sidebar and tabs; toolbar actions wired (no-ops allowed in v1).

---

### Phase 3 — Diff Viewer MVP
- Support split and inline modes; sticky hunk headers; line numbers.
- File list in Sidebar drives per-file pagination (`?file=<path>&hunk=<n>` optional).
- Virtualize long files; batch-highlight visible chunks only; use `content-visibility: auto` to avoid offscreen cost.
- Persist per-user preference for mode and wrapping.

**Exit criteria**: 10k+ visible lines remain responsive (<30ms paint for visible window); toggle split/inline; deep-linking works.

---

### Phase 4 — Logs Streaming
- SSE (preferred) or WebSocket tail with `Follow` toggle.
- Backfill older logs via cursor param; lazy paginate upwards.
- Preserve scroll position on tab switch; resume stream after refresh.

**Exit criteria**: Live logs append smoothly; follow toggle works; backfill loads prior segments.

---

### Phase 5 — Settings → Environments
- Table with: Name, Repo, Number of tasks, Creator, Created at.
- "Create environment" modal (name, repo, token). Optimistic create with undo toast.

**Exit criteria**: List renders; create flow persists and shows in table.

---

### Phase 6 — API Wiring & Actions
- Adapter layer isolates backend specifics.
- Endpoints (illustrative):
  - `GET /tasks`, `POST /tasks` (create from prompt/task form)
  - `GET /tasks/:id`, `POST /tasks/:id/archive`, `POST /tasks/:id/retry`
  - `GET /tasks/:id/diff?file=...&from=...`
  - `GET /tasks/:id/logs` (SSE/WS)
  - `GET /environments`, `POST /environments`
- Auth: per-environment token; keep tokens out of bundle; gateway sets same-site cookie when possible.

**Exit criteria**: All screens use real data; error mapping and retry policies implemented.

---

### Phase 7 — A11y, Perf & Polish
- WCAG 2.1 AA sweep: focus order, visibles, ARIA on tabs/grids/pills; reduced-motion variants for spinners/transitions.
- Announce dynamic counts via `aria-live` (e.g., “+1054 −897 changes”).
- RUM/tracing: instrument route/toggle events (`task_opened`, `tab_changed`, `pr_clicked`).

**Exit criteria**: Axe-core clean; interactions meet perf budget; telemetry events visible in console.

## 5) Key Tickets
1. App scaffold & theme boot.
2. TaskList DataGrid + search/sort/virtualization.
3. TaskDetail layout (Sidebar + Tabs + toolbar).
4. Diff viewer MVP (split/inline, paging, virtualization).
5. Logs tail (SSE) with follow/backfill.
6. Environments table + create flow.
7. API adapter + actions + auth.
8. A11y/perf sweep + RUM hooks.

## 6) CI/CD & Quality Gates
- GitHub Actions: typecheck, unit tests, Playwright smoke (headless), build.
- Size-limit gate on vendor bundle; report route-based chunks.
- Preview deploy on PR (Vercel/Netlify) with basic health probe `/health`.

## 7) Risks & Mitigations
- **Huge diffs**: paginate per file; windowed list; batch syntax highlight.
- **Backend variance**: keep `ApiAdapter` thin; provide mock server; write contract tests.
- **Auth/Secrets**: avoid embedding tokens; short-lived tokens via gateway; strict CORS.

## 8) Deliverables (v1)
- Running SPA with the three routes and functional list/detail/settings.
- Virtualized diff viewer and streamed logs.
- A11y AA baseline and perf budget checks in CI.

## 9) Optional — One-shot Scaffold Prompt
```
Create a React 18 + TypeScript + Vite app named "portal".
Add: Fluent UI v9, React Router v6, TanStack Query, highlight.js, Zustand.
Routes: /tasks, /tasks/:id (tabs diff|logs via ?tab=), /settings/environments.
Shell: left rail (Tasks, Archive placeholder, Settings), top bar actions.
TaskList: Fluent DataGrid with virtualization; columns Title, Repo, Status pill, +/- counts, Created time; search on "/"; Enter opens row.
TaskDetail: left Sidebar (request text, worked-time, Summary, Testing badges, Files with +/- counts); right Tabs (Diff default, Logs).
Diff: inline/split toggle; virtualize; sticky hunk headers; line numbers; per-file pager; remember mode.
Logs: SSE tail with Follow toggle; backfill older chunks; preserve scroll on tab switch.
Settings/Environments: table + Create modal.
API adapter layer and illustrative endpoints; TanStack Query clients; auth header per environment.
A11y AA; reduced-motion; aria-live for change counts. CI with typecheck, tests, e2e smoke, build, size-limit.
```

