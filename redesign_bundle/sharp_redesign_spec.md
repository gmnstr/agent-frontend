# Sharp Redesign Spec (Operations Console)

One‑line: tighten corners, remove soft glow, add crisp keylines, switch to square badges, prefer compact data tables, and use direct microcopy to signal competence, calm, and control.

## Visual language
- Corners: 4–6 px for buttons, inputs, and cards; circular is reserved for avatars only. Shapes should read as engineered, not playful.
- Color: deep neutrals form the base, with a single brand accent. Keep saturated backgrounds for hover/active/focus only; idle states stay restrained so content leads.
- Contrast + elevation: maintain comfortable body contrast, and replace soft drop‑shadows with precise 1 px strokes. Draw hierarchy with spacing and keylines rather than blur.
- Density: use an 8 px spacing grid; tables default to compact (row height ~40–44 px, header ~44–48 px). Increase density before truncating content.
- Iconography: stroke‑only icons at ~1.5 px weight, aligned to text cap‑height. Icons should confirm meaning already clear from text, not carry it.

## Information hierarchy
- Title row then input bar (no jumbo hero). Put essential context and actions in the first viewport without scrolling.
- Overview promotes metrics first (Active tasks, Status mix, Last deploy) to anchor situational awareness before activity feeds.
- Lists prefer tables over cards (Tasks, Environments). Cards summarize; tables operate.
- Status relies on readable labels and consistent shapes; color supports but never replaces text.

## Components
- **Input bar:** square 6 px, ~48–52 px tall. Placeholder: “Describe the task. The agent will plan and open a PR.” Include a compact action group on the right; default actions are outline/ghost.
- **Buttons:** outline/ghost by default; reserve solid brand for the single primary action. No gradients; no soft shadows.
- **Tabs:** underline (2 px) for selection instead of filled pills; keep hit‑targets generous while visuals stay minimal.
- **Status badge:** square/rounded‑square 6 px with a 6 px dot and short label. Same typography everywhere it appears to build instant recognition.
- **Tables:** sticky header, left‑align text, right‑align numbers. Subtle row hover (tinted background 4–6%). Use a 1 px divider under the header.

## Motion & a11y
- Transitions 120–160 ms, opacity/background/color only. Avoid scale or bounce; the UI should feel precise, not bouncy.
- Minimum 4.5:1 contrast for text and 3:1 for icons/lines. Respect reduced‑motion preferences.
- Focus states must be visible on all interactives (keyboard and pointer). Prefer a 2 px outline plus a slight background tint.
- Target sizes ~40×40 px minimum for primary controls; tables may go slightly tighter but keep cell controls comfortably clickable.

## Typography & spacing
- Type: system UI or Inter/SF for clarity. Body 14–15 px in dense surfaces; headings +1–3 steps with modest tracking.
- Line length ~60–80 characters for body text; keep microcopy short.
- Spacing rhythm: 8/16/24 px for intra‑section layout; 16–20 px from headings to content; 8–12 px from table header to first row.

## Status taxonomy & color mapping
- Open: neutral foreground, neutral background tint, thin neutral stroke. Reads as “ready”.
- Running: brand‑tinted background and brand foreground; avoid pulsing animations—use the label.
- Merged: neutral‑strong foreground with light neutral tint; communicates finality without celebration.
- Failed: error foreground and tint; avoid heavy fills that shout. The label carries meaning.

## Tables: behavior and presets
- Presets: provide saved column sets (By status, By age, By repo) with stable widths to reduce fiddling.
- Sorting: default to most recent activity; keep secondary sorts deterministic.
- Empty states: show a concise explanation and a single action; avoid decorative illustrations.
- Loading: use lightweight skeletons; do not shift layout on completion.

## Implementation notes
- Add `sharpTheme.ts` and switch the provider to `sharpDarkTheme`/`sharpLightTheme`. This removes soft shadows, tightens radii, and preserves your brand ramp.
- Replace the existing pill component with `TaskStatusBadge` to normalize shape, size, and typography for statuses across lists and detail views.
- Apply style patches to TopBar and MainInput to eliminate pill shapes, reduce vertical height, and align visuals to the keyline‑first hierarchy. Remove any remaining `shadow*` token usage on surface components.
- Review screens for consistency: tables over cards for dense data, square badges for status everywhere, and a single primary action per context.

## Acceptance checklist
- No soft shadows on persistent surfaces; elevation is expressed by borders and layering only.
- Status visuals are square badges with labels; no lozenges/pills remain.
- Overview shows metrics first; the main input is compact and placed directly beneath the title row.
- Tables are compact with sticky headers, subtle hover, and consistent alignment.
- All focus states are visible, and contrast targets are met.

