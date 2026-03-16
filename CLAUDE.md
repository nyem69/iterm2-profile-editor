# iTerm2 Profile Editor

Visual web editor for iTerm2 Dynamic Profiles JSON files. Fully client-side, no server routes.

## Tech Stack

- **Svelte 5** (runes mode: `$state`, `$derived`, `$effect`, `$props`, `$bindable`)
- **SvelteKit 2** with `@sveltejs/adapter-cloudflare`
- **Tailwind CSS 4** via `@tailwindcss/vite` plugin (no tailwind.config.js)
- **shadcn-svelte** (bits-ui based) — imports from `$lib/components/ui/[component]/index.js`
- **@lucide/svelte** — Svelte 5 only, use deep imports: `@lucide/svelte/icons/[name]`
- **svelte-sonner** — toast notifications
- **Cloudflare Workers** deployment via `wrangler.toml`

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm check` — svelte-check type checking
- `pnpm preview` — preview production build

## Architecture

- **Client-side only** — no server routes, all processing in browser
- **localStorage persistence** — auto-save with 500ms debounce, auto-restore on app init
- **Class-based reactive store** — singleton `profileStore` in `src/lib/stores/profiles.svelte.ts`
- **Module-level `$state`** — used in `ProfileList.svelte` for persistent tag expand/collapse state

## Key Patterns

- Use `$effect` only for side effects (DOM, localStorage). Prefer `$derived` for computed values
- Use `$effect.pre` when state must be set before render
- Use `untrack()` when writing reactive state inside effects to avoid loops
- Use `JSON.parse(JSON.stringify())` instead of `structuredClone` for Svelte 5 proxy objects
- Preserve original `Color Space` and `Alpha Component` when editing colors — pass them through `hexToColor()`
- Credential masking in `src/lib/utils/mask.ts` is display-only (TerminalPreview), not in editor views
- Dark mode: `.dark` class on `<html>`, inline script in `app.html` for FOUC prevention
- TagGroup uses lazy render (`hasBeenExpanded`) — children mount after first expand, stay in DOM for animation

## Conventions

- Icons: always deep imports (`@lucide/svelte/icons/arrow-left`), never barrel imports
- Components: shadcn components in `src/lib/components/ui/`, app components in `src/lib/components/`
- Path alias: `$components` maps to `src/lib/components`
- Color values: iTerm2 uses 0-1 float range, convert to 0-255 for display
- Profile validation: require `Name` (string), auto-generate `Guid` if missing, max 1000 profiles
