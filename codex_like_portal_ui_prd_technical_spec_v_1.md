# Codex‑like Portal UI — PRD & Technical Spec v1

> Goal: Recreate the user experience of ChatGPT Codex Web (portal‑style “Tasks → Diff → Logs → Settings/Environments”), using **React + Fluent UI v9**, with clean API boundaries so it can drive **Codex CLI**, Claude Code, or any coding agent.

---

## 1) Problem & Outcomes
**Problem.** We want a portal UX for coding agents (task queue, diffs, logs, PR integration) that feels like Codex Web but is open source and adaptable.

**Primary outcomes.**
- Submit and track tasks across multiple repositories/environments.
- Review agent changes: file list, grouped diffs, inline summaries; open PR links.
- Inspect logs and test results; retry/cancel/archive tasks.
- Manage environments (repo binding, credentials, limits), with deep links.

**Success criteria.**
- A human can create a task, watch progress, view diffs, and open PR in ≤ 3 clicks.
- Blade stack preserves state across refresh and deep‑links.
- 10k+ line diffs remain responsive (<16ms scripting budget on average interactions).

**Non‑goals (v1).**
- No built‑in chat thread; no rich PR review replies.
- No on‑prem secrets management beyond Bring‑Your‑Own (Vault/Azure Key Vault/etc.).

---

## 2) Users & Modes
- **Solo engineer** — submits ad‑hoc tasks to their personal or team repos.
- **Reviewer** — opens an existing task from a link, scans summary + diff, clicks "View PR".
- **Operator** — monitors multiple environments; triages failures; tunes limits.

Modes: **Tasks list**, **Task detail (Diff/Logs tabs)**, **Settings → Environments**.

---

## 3) UX Overview (reverse‑engineered targets)
- **Azure‑Portal‑like shell**: left rail nav, top bar actions, main canvas.
- **Task List**: searchable, sortable list with per‑row status and change counts (+/−).
- **Task Detail**: left sidebar (request + summary + files), main panel with tabs: **Diff** (default) and **Logs**. Sticky toolbar for actions: Archive / Share / View PR / Close.
- **Blades**: secondary panels slide in from the right, stackable, and URL‑addressable.
- **Settings → Environments**: table of environments (Name, Repo, tasks count, creator, created at) with Create flow.

Keyboard: focus‑visible, arrow navigation in lists, `Esc` closes the topmost blade, `Enter` activates primary, `/` focuses search.

---

## 4) Information Architecture
- **/tasks** → task list
- **/tasks/:taskId** → detail (default tab: `diff`); query `?tab=logs`
- **/settings/environments** → environments table
- Blade stack encoded in query: `?blades=task:new,logs:tail`

Breadcrumbs: **Tasks** → *Task title*; top‑right actions (View PR, Share, Archive).

---

## 5) Major Components
- **Shell**: left rail (`Navigation`), top bar (`Toolbar` + overflow), main thread container.
- **TaskList**: `DataGrid` (Fluent UI) with virtualized rows, status pill, change counts.
- **TaskDetail**
  - **Sidebar**: request text, worked‑time chip, bullet Summary, Testing badges, expandable Files list with per‑file diff counts.
  - **Diff Viewer**: split/inline modes; syntax highlighting (Highlight.js); large‑file virtualization; sticky headers and line numbers; inline widget affordances.
  - **Logs**: streaming viewer with bottom‑anchoring and lazy pagination.
- **BladeStack**: right‑side drawers, stacked by Z, deep‑linkable.
- **Toasts**: optimistic feedback (save, archive, retry), undo where applicable.

---

## 6) Visual Design & Theming
- **Design system**: Fluent UI v9; base themes `webLight`/`webDark` with token overrides for radius, neutral surfaces, strokes, and focus outlines.
- **Theme boot**: read from localStorage and `prefers-color-scheme` *before first paint*; set `data-theme` on `<html>`; also set `color-scheme` for native controls.
- **Thread container**: CSS container queries (`cqw`/`cqh`) to cap content width and gutters. Variables like `--thread-content-max-width`, `--thread-gutter`.
- **Diff tokens**: CSS variables for additions, deletions, hovers, inline widgets; configure both light and dark palettes to match familiar GitHub‑like contrast.

---

## 7) Accessibility
- **WCAG 2.1 AA**: minimum contrast, focus rings, reduced motion opt‑in.
- **Keyboard model**: list row focus, `Space` to select, `o` to open, `Esc` closes blade.
- **ARIA**: `role="grid"` for TaskList, `role="dialog"` for blades with focus traps; describe counts with live regions (e.g., “+1054 −897 changes”).

---

## 8) Performance Targets
- First interaction (open a task) under 150ms on warmed cache.
- Diff viewport render under 30ms for 300 visible lines.
- Virtualize long diffs; suspend hidden tabs; `content-visibility: auto` for large panes.
- Route‑level code splitting; prefetch on hover for detail routes.

---

## 9) Observability & Ops
- RUM + tracing IDs injected in head; page‑view + route‑change metrics.
- Client events: task_opened, tab_changed, diff_mode_toggled, pr_clicked, env_created.
- Error boundaries dispatch `error_surface_shown` with fingerprint.

---

## 10) Security & Privacy
- All API calls via a gateway with per‑environment tokens; no secrets in the client bundle.
- CORS locked to allowed origins; CSRF via same‑site cookies or token header.
- Optional sandbox **sentinel iframe** for cross‑origin SDKs / feature gates.

---

## 11) Data & API (reference shape)
> Transport‑agnostic: backends may proxy to Codex CLI, Claude Code, OpenHands, etc.

**Task**
```ts
Task {
  id: string;
  title: string;                 // e.g., "Implement dependency_ci_slimming_spec.md"
  repo: string;                  // org/repo
  branch?: string;
  status: "open" | "running" | "merged" | "archived" | "failed";
  createdAt: string;             // ISO
  createdBy: string;             // email or handle
  plus: number; minus: number;   // summary counts
}
```

**TaskDetail**
```ts
TaskDetail {
  task: Task;
  request: string;               // user prompt / instruction
  workedTimeMinutes?: number;
  summary: string[];             // bullet points
  tests: { framework: string; status: "pass" | "fail"; }[];
  files: { path: string; plus: number; minus: number; }[];
  pr?: { url: string; number?: number; status?: "open"|"merged" };
}
```

**Diff** (paged by file)
```ts
GET /api/tasks/:id/diff?file=<path>&mode=split|inline&from=<n>
→ { chunks: DiffChunk[], eof: boolean }
```

**Logs** (streaming)
```ts
GET /api/tasks/:id/logs?cursor=<ts>
→ SSE stream or WebSocket lines; server truncation window configurable
```

**Environments**
```ts
Environment { id, name, repo, tasksCount, creator, createdAt }
```

**Actions**
- `POST /api/tasks` (title, repo, envId, options)
- `POST /api/tasks/:id/retry` · `POST /api/tasks/:id/archive`

---

## 12) State & Routing
- React Router v6 for routes; TanStack Query for server state.
- Blade stack encoded in query string; refresh restores open blades.
- Error boundaries at route + diff loader levels.

---

## 13) Technology Choices
- **React 18 + TypeScript** (Vite build)
- **Fluent UI v9** for components
- **TanStack Query** for data fetching/caching
- **Highlight.js** for syntax highlighting
- **Zustand** for light UI state (blade stack, preferences)

---

## 14) Directory Sketch
```
portal/
  src/
    app/ (routes, loaders)
    components/ (DataGrid wrappers, BladeStack, Diff, Logs)
    theme/ (tokens, boot.ts)
    api/ (client, types)
    state/ (store.ts)
```

---

## 15) Acceptance Criteria (v1)
- Can create a task against a bound repo/environment and see it appear in the list.
- Opening a task shows Summary + Files + Diff tab with working virtualization.
- Logs tab tailing works and is resumable after refresh.
- Settings → Environments lists items and supports creation.
- Deep links restore UI, including an open blade stack.

---

## 16) Milestones
1. **Shell + TaskList** (nav, theming boot, grid with fake data)
2. **TaskDetail scaffold** (Summary/Files; Diff placeholder; Logs placeholder)
3. **Diff MVP** (HLJS, split/inline, large‑file virtualization)
4. **Logs streaming** (SSE/WebSocket, tail + backfill)
5. **Environments** (table + create modal)
6. **API wiring** (real backend; errors, retries, archive)
7. **A11y & Perf pass** (axe clean, profiling)

---

## 17) Risks & Mitigations
- **Huge diffs** → virtualize, use `content-visibility`, avoid layout thrash.
- **Backend variety** → define a thin adapter layer; start with Codex CLI gateway.
- **Auth complexity** → enforce per‑environment tokens; keep secrets server‑side.

---

## 18) Open Questions
- Preferred backend for v1 (Codex CLI via gateway vs direct service)?
- Do we need PR review comments in‑app, or just an external link?
- Should task creation allow attaching files/patches, or prompt‑only?

---

## 19) Reference Screenshots
*(For UI fidelity; not shipped assets.)*

![Task list — dark](sandbox:/mnt/data/Screenshot%202025-09-20%20at%2013.18.03.png)

![Task detail — diff](sandbox:/mnt/data/Screenshot%202025-09-20%20at%2013.18.18.png)

![Task list (alt state)](sandbox:/mnt/data/Screenshot%202025-09-20%20at%2013.18.29.png)

![Settings → Environments](sandbox:/mnt/data/Screenshot%202025-09-20%20at%2013.18.39.png)

---

## 20) Appendix — Implementation Notes
- Boot theme early to avoid flash; set `color-scheme` for native scrollbars.
- Prefer container queries over global breakpoints for thread width.
- Expose `?mode=inline|split` and remember per‑user in localStorage.
- Add a hidden sentinel iframe if we later integrate cross‑origin SDKs.

