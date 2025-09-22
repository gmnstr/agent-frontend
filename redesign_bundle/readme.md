# Codex UI — Sharp Redesign Bundle

This bundle sharpens the UI from a round, pill-based look to a crisp, professional operations console. It is non-invasive: new theme + one new status badge + small style patches.

## Files included

```
portal/src/theme/sharpTheme.ts
portal/src/components/data/TaskStatusBadge.tsx
patches/ThemeProvider.patch
patches/TopBar.patch
patches/MainInputComponent.patch
sharp-redesign-spec.md
README.md
```

## Apply the update

1. **Add the theme**\
   Copy `portal/src/theme/sharpTheme.ts` into your repo.

2. **Switch the provider to sharp theme**\
   Apply `patches/ThemeProvider.patch` (or manually):

   - Replace webDarkTheme/webLightTheme with `sharpDarkTheme`/`sharpLightTheme`.
   - Keep your color-scheme detection logic.

3. **Add the square status badge**\
   Copy `portal/src/components/data/TaskStatusBadge.tsx` and replace usages of `TaskStatusPill` with `TaskStatusBadge`:

   ```tsx
   import { TaskStatusBadge } from '@/components/data/TaskStatusBadge'
   // <TaskStatusBadge status="running" />
   ```

4. **Top bar + main input styles**\
   Apply `patches/TopBar.patch` and `patches/MainInputComponent.patch` (or port the changes by hand if your files have drifted). The changes remove soft shadows, tighten spacing, and use square shapes.

5. **Run & verify**

   - `pnpm dev` (or your script) and confirm: crisper keylines, square badges, compact input bar, and a lean top bar.
   - Scan for remaining `shadow*` usage and remove if any.

## Notes

- The badge supports `open | running | merged | failed`. If your status names differ, map them at the call site.
- The theme keeps your brand colors but avoids saturated backgrounds at rest.
- No state/data logic touched; you can roll back by reverting theme & component imports.

