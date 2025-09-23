# Codex Portal Implementation Plan
## Path to the Codex Redesign (Spec → Working Product)

> **Document Version**: 1.1.0  
> **Analysis Date**: January 16, 2025  
> **Current Implementation**: `portal/` React app scaffold (LeftRail + TopBar shell, task list grid, placeholder detail/settings views)  
> **Target Specification**: [`codex-portal-redesign-spec.md`](./codex-portal-redesign-spec.md)

---

## 1. Baseline Snapshot

### 1.1 What already works
- React 18 + TypeScript + Vite + ESLint/Vitest project with Fluent UI v9 theme boot (`ThemeProvider.tsx`).
- Global shell composed of `AppShell` (left rail + top bar) rendered through `RootLayout` with contextual toolbar injection (`setToolbar`).
- `/tasks` route delivers a virtualized `DataGrid` (`TaskList.tsx`) backed by TanStack Query mock API data and keyboard shortcuts.
- `TaskDetailPlaceholder` and `EnvironmentsPlaceholder` provide structural scaffolds for future Task Detail and Settings experiences.
- Shared utilities: telemetry shim (`lib/telemetry`), hooks (`useHotkey`, `usePrefersReducedMotion`), task type definitions, and dark/light design tokens.

### 1.2 Gap map (Spec vs. current build)
| Area | Spec expectation | Current state | Gap summary |
| --- | --- | --- | --- |
| Global layout | TopBar-only shell with centered content | `AppShell` renders `LeftRail` + `TopBar` | Remove sidebar; redesign spacing & breakpoints |
| Navigation | TopBar hosts primary nav, settings, docs, profile | Nav links split between rail & top bar | Consolidate nav and align interactions with spec |
| Homepage | Hero prompt "What should we code next?" with voice-enabled composer, Tasks/Archive tabs | Marketing-style hero + highlights grid + task cards | Rebuild hero + composer; redesign task section per spec |
| Main input | Expandable text area w/ Ask + Code buttons, voice controls | No input experience | Build reusable input component + voice support |
| Task list | Simplified list aligned with spec tab switcher, no data grid | Data grid layout with summary cards | Replace grid with list + tabs + spec styling |
| Task detail | Header + sidebar + diff/logs panes + bottom composer | Static placeholder components | Implement data loading, diff viewer, logs, composer |
| Settings → Environments | Table, create modal, filters | Placeholder copy | Build table, CRUD hooks, modal flows |
| Accessibility/perf | Maintain WCAG AA, virtualization, keyboard-first nav | Baseline coverage in current screens | Extend coverage to new components and flows |
| Advanced features | Voice input, advanced search, real-time status | Not started | Net-new workstreams |

### 1.3 Guiding principles
1. Preserve existing architectural strengths (React Query, Zustand-ready patterns, Fluent UI theme) while reshaping UI.
2. Deliver in thin vertical slices—route by route—so QA can validate incrementally.
3. Avoid regressions to current task list functionality while migrating to new layout.

---

## 2. Implementation Goals & Non-goals
- **Goals**: Match the redesign spec visually/interaction-wise, maintain performance (virtualization, streaming), ship production-ready Task → Diff → Logs → Settings flows, keep accessibility budget.
- **Non-goals (v1)**: Backend integration beyond mock APIs, chat thread UI, full observability tooling (telemetry hooks can remain console shims until API work lands).

---

## 3. Workstreams & Tasks
Each workstream lists mandatory tasks (✅ required for spec parity) and optional enhancers (✨ polish). File paths reference the `portal/` package.

### Workstream A — Shell & Theming Foundation (Week 1)
1. **TopBar-only layout refactor** ✅
   - Update `components/layout/AppShell.tsx` to drop `LeftRail` and recenter content (full-width container, max-width clamp per spec).
   - Retire `LeftRail.tsx` (delete or convert into responsive drawer invoked by hamburger).
   - Ensure `RootLayout` still wires `toolbarContent` into `TopBar` but updates focus management (main landmark + skip links).
2. **Navigation redesign** ✅
   - Expand `TopBar.tsx` to include primary nav (Home, Tasks, Archive placeholder, Settings) and command area (Docs, profile).
   - Implement mobile menu (hamburger opens `OverlayDrawer` component) to replace removed rail; new `components/layout/MobileNav.tsx` recommended.
3. **Token alignment** ✅
   - Adjust `ThemeProvider.tsx` to add spec-specific surface/background tokens (TopBar background `#161B22`, border `#30363D`, etc.).
   - Introduce CSS variables for container widths and gutters (e.g., define in `index.css`).
4. **Global utilities** ✅
   - Add skip navigation link (e.g., `components/layout/SkipLink.tsx`).
   - Confirm router-level focus reset is preserved after layout rewrite.
5. **Optional polish** ✨
   - Animate TopBar elevation on scroll; add page-level breadcrumbs component for reuse.

### Workstream B — Homepage Experience (Week 1-2)
1. **Hero prompt & composer** ✅
   - Replace hero section in `routes/home/HomePage.tsx` with spec copy "What should we code next?" and restructure markup to center content.
   - Build `components/home/MainInput.tsx` supporting expandable textarea, Ask/Code buttons, optional attachments, and voice entry indicator.
   - Introduce local Zustand store or component state for input value + voice mode to avoid prop drilling when composer reused elsewhere.
2. **Voice input support** ✅
   - Create `hooks/useVoiceInput.ts` that wraps Web Speech API when available and gracefully degrades.
   - Update MainInput actions to call `onSubmit('ask' | 'code')`; wire to placeholder handlers (console log) until backend ready.
3. **Tasks/Archive tab region** ✅
   - Implement Fluent `TabList` inside `HomePage` for "Tasks" (default) and "Archive".
   - Extract task preview list into `components/home/TaskPreviewList.tsx` using simplified list styling (no cards) with spec typography.
   - Display empty-state messaging for Archive until API support exists.
4. **Telemetry & accessibility** ✅
   - Hook `trackEvent` for key actions (ask, code, voice toggle).
   - Ensure composer has `aria-live` for voice transcription and buttons expose accessible labels.
5. **Optional polish** ✨
   - Add hero background gradients per spec using CSS variables; animate microphone pulse during recording.

### Workstream C — Tasks Surfaces (Week 2-3)
1. **Task list redesign** ✅
   - Replace `DataGrid` in `components/task-list/TaskList.tsx` with custom list aligning to spec layout (title row with status + `+/-` counts, metadata row beneath).
   - Maintain virtualization using `VirtualizerScrollViewDynamic` but adapt row renderer to new markup.
   - Convert summary cards into inline stats above list matching spec (if spec excludes, remove or adapt).
2. **Tabs integration** ✅
   - Align `/tasks` route toolbar to spec: include search input (with `/` shortcut), filter dropdown, and "New task" button hooking to composer (open future modal or reuse hero composer via blade).
3. **Archive view placeholder** ✅
   - Provide `/tasks?view=archive` support to reuse list component with empty-state.
4. **State & telemetry** ✅
   - Keep existing filtering/sorting utilities but map to new UI controls.
   - Extend `trackEvent` usage for filter/sort changes.
5. **Optional polish** ✨
   - Introduce inline diff stats badges; add row-level keyboard shortcuts (`o` open, `enter` view PR) matching spec.

### Workstream D — Task Detail Route (Week 3-4)
1. **Data fetching & layout** ✅
   - Replace placeholder with real layout: fetch task detail via new `api/tasksDetail.ts` (mock data initially).
   - Structure page: header (breadcrumb, actions), sidebar (summary, tests, files), main area (Tabs for Diff/Logs), bottom composer (reuse MainInput with condensed styling).
2. **Diff viewer MVP** ✅
   - Create `components/diff/DiffViewer.tsx` supporting inline/split views, virtualization, sticky hunk headers, highlight.js integration.
   - Add file list controlling viewer (with query params `?file=` + `?mode=` persisted).
3. **Logs panel** ✅
   - Build `components/logs/LogsViewer.tsx` using mock streaming (timeout-based) and `useEffect` cleanup; follow toggle, backfill.
4. **Bottom composer** ✅
   - Reuse MainInput variant anchored at page bottom; add actions (Ask, Ship code) and integrate with voice hook.
5. **Testing & accessibility** ✅
   - Create unit tests for Diff viewer chunk rendering and tab switching (Vitest + RTL).
   - Add keyboard navigation (arrow to move between files, tab to actions) and ensure ARIA roles align with spec.
6. **Optional polish** ✨
   - Implement screenshot minimap, PR link deep-link guard, share dialog stub.

### Workstream E — Settings → Environments (Week 4)
1. **Table implementation** ✅
   - Replace placeholder with Fluent `Table` or lightweight list matching spec columns (Name, Repo, Tasks, Creator, Created).
   - Use React Query to fetch environments via new `api/environments.ts` mock endpoint.
2. **Create environment modal** ✅
   - Add `components/settings/CreateEnvironmentDialog.tsx` with form validation and optimistic updates.
   - Hook to `TaskListToolbar` "Configure" button and Settings route CTA.
3. **Management actions** ✅
   - Provide inline actions (View, Disable placeholder) and status badges.
4. **Accessibility & tests** ✅
   - RTL tests for modal form validation and optimistic update.
5. **Optional polish** ✨
   - Persist table preferences (sorting) in Zustand; add audit log placeholder blade.

### Workstream F — Cross-cutting Infrastructure (Week 4-5)
1. **API adapter layer** ✅
   - Introduce `api/client.ts` to centralize fetch logic + error handling.
   - Define types (`types/taskDetail.ts`, `types/environment.ts`) aligning with spec data contracts.
2. **State management** ✅
   - Add Zustand stores for composer state, voice mode, diff preferences.
   - Ensure stores are serializable for debugging.
3. **Routing enhancements** ✅
   - Support query params for diff mode, selected file, logs cursor.
   - Add lazy route chunks via `React.lazy` + `Suspense` for TaskDetail & Settings.
4. **Testing & automation** ✅
   - Expand Vitest coverage for hooks & stores.
   - Configure Playwright smoke tests (start with `npm run test -- --runInBand` placeholder) to validate route smoke flows.
5. **Optional polish** ✨
   - Instrument telemetry events to console group for easier debugging.

### Workstream G — Advanced UX & Final Polish (Week 5)
1. **Voice enhancements** ✅
   - Provide waveform animation and transcript editing before submission.
2. **Advanced search** ✅
   - Add fuzzy search on tasks (client-side now, API ready later) with `useDeferredValue` for performance.
3. **Real-time updates** ✅
   - Mock SSE client for task status updates (update list badges in place).
4. **Performance sweeps** ✅
   - Audit bundle split (Vite analyze) and ensure diff/logs virtualization meets performance targets.
5. **Accessibility audit** ✅
   - Run axe-core/Storybook (if introduced) or manual audits for WCAG compliance.
6. **Documentation** ✅
   - Update `README.md` and create component docs (MDX or markdown) summarizing usage patterns.

---

## 4. Delivery Sequence & Milestones
| Week | Milestone | Exit criteria |
| --- | --- | --- |
| 1 | Shell refactor complete | TopBar-only layout responsive; navigation functional; lint/tests pass |
| 2 | Homepage redesign | New hero + composer + tabs implemented; voice hook integrated (graceful fallback) |
| 3 | Tasks list alignment | `/tasks` matches spec list design with filtering/search and archive placeholder |
| 4 | Task detail & diff/logs MVP | Diff viewer + logs panel + sidebar functional with mock data; bottom composer active |
| 4-5 | Settings + infrastructure | Environments table + modal shipped; API adapter/stores in place |
| 5 | Polish & QA | Voice enhancements, advanced search, real-time mocks, accessibility/perf audit complete |

Parallel tracks: While Week 3 focuses on Task detail, begin drafting diff/log unit tests and API adapters to compress timeline.

---

## 5. Quality & Testing Strategy
- **Unit/Integration (Vitest + RTL)**: composer interactions, list filtering, diff chunk virtualization, modal validation.
- **End-to-end (Playwright smoke)**: home composer submission flow (mock), open task detail, toggle diff/logs, create environment.
- **Accessibility**: axe-core CLI or `@testing-library/jest-dom` matchers; manual keyboard walkthrough for each route.
- **Performance**: Use Chrome Lighthouse & React Profiler for diff viewer; ensure virtualization prevents >30ms scripting for 10k lines.
- **Regression guardrails**: maintain `npm run lint`, `npm run test`, `npm run build` in CI. Add visual regression baseline once new design lands.

---

## 6. Risks & Mitigations
| Risk | Impact | Mitigation |
| --- | --- | --- |
| Layout refactor regressions | Navigation or focus traps break after removing LeftRail | Ship feature flag (`useFeature('newShell')`) during development; add layout snapshot tests |
| Diff virtualization complexity | Large diffs stutter or break virtualization | Prototype viewer in isolation, add storybook/perf harness, reuse windowing utilities from current TaskList |
| Voice input browser support | Non-supported browsers degrade experience | Feature detect Web Speech API, display tooltip, provide manual input fallback |
| Mock API divergence | Later backend integration requires rework | Centralize types + adapters now; write contract tests using mock server |
| Accessibility drift | New components may miss ARIA roles | Integrate lint rules (`eslint-plugin-jsx-a11y`) and run axe checks in CI |

---

## 7. Resource & Dependency Checklist
- **People**: 1 frontend engineer (full-time), 0.5 UX designer for validation, 0.25 QA for sweeps (same as initial estimate).
- **Dependencies**: highlight.js already installed; may add `@axe-core/react` (dev) and `playwright` when e2e stage begins.
- **Environment**: Existing Vite dev server sufficient; ensure Node ≥18 for Speech API typings if needed.
- **Design assets**: Reference `current-design-*.png` mocks for layout spacing; confirm tokens with design team before shipping.

---

## 8. Acceptance Checklist (Spec Parity)
- [ ] TopBar-only shell with responsive nav + skip link.
- [ ] Homepage composer + voice input + tasks/archive tabs.
- [ ] Task list matches spec styling, retains filtering/search, supports archive view.
- [ ] Task detail route with diff viewer (split/inline), logs streaming, sidebar metadata, bottom composer.
- [ ] Settings → Environments table + create modal + optimistic updates.
- [ ] Voice, advanced search, and real-time updates functioning (mocked where necessary).
- [ ] WCAG 2.1 AA compliance verified; performance metrics within target.
- [ ] Automated test suite updated (lint, unit, e2e) and green.

---

**Prepared by**: Frontend implementation lead  
**Kickoff ready**: Yes — proceed once sign-off received on shell redesign proposal.
