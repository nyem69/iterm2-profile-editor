# iTerm2 Profile Editor — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a client-side web app for visually editing iTerm2 profile JSON files with color theme presets, bulk operations, and localStorage persistence.

**Architecture:** Fully client-side SvelteKit app. Upload JSON → edit profiles in-memory with Svelte 5 runes store → download modified JSON. Auto-saves to localStorage. No server routes.

**Tech Stack:** SvelteKit 2 + Svelte 5 (runes), Tailwind CSS 4 (`@tailwindcss/vite`), shadcn-svelte, `@lucide/svelte`, `@sveltejs/adapter-cloudflare`

**Reference project:** `/Users/azmi/PROJECTS/LLM/martol` for patterns (svelte.config.js, vite.config.ts, app.css structure).

---

### Task 1: Scaffold SvelteKit Project

**Files:**
- Create: `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`, `src/app.html`, `src/app.css`, `src/routes/+layout.svelte`, `src/routes/+page.svelte`

**Step 1: Create SvelteKit project**

```bash
cd /Users/azmi/PROJECTS/UTILITIES/iterm2-profile-editor
pnpm create svelte@latest . --template minimal --types ts --no-add-ons
```

If the directory already has files, it may prompt — accept overwrite for scaffold files.

**Step 2: Install core dependencies**

```bash
pnpm add svelte@latest @sveltejs/kit@latest
pnpm add -D @sveltejs/adapter-cloudflare @tailwindcss/vite tailwindcss vite typescript svelte-check @cloudflare/workers-types wrangler
pnpm add @lucide/svelte clsx tailwind-merge
```

**Step 3: Configure svelte.config.js**

```javascript
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		}),
		alias: {
			$components: 'src/lib/components'
		}
	}
};

export default config;
```

**Step 4: Configure vite.config.ts**

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()]
});
```

**Step 5: Initialize shadcn-svelte**

```bash
pnpm dlx shadcn-svelte@latest init
```

Accept defaults. This creates `components.json` and `src/lib/utils.ts`.

**Step 6: Add shadcn components**

```bash
pnpm dlx shadcn-svelte@latest add button input dialog tabs select dropdown-menu checkbox badge separator card alert-dialog label textarea switch tooltip
```

**Step 7: Set up app.css**

Replace `src/app.css` — keep whatever shadcn generated for CSS variables, then add at the top:

```css
@import "tailwindcss";

/* ... shadcn CSS variables stay ... */

/* Geist Mono for terminal previews */
@font-face {
	font-family: "Geist Mono";
	src: url("https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-mono/GeistMono-Regular.woff2") format("woff2");
	font-weight: 400;
	font-style: normal;
	font-display: swap;
}
```

**Step 8: Set up app.html**

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
		<title>iTerm2 Profile Editor</title>
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

**Step 9: Verify dev server starts**

```bash
pnpm dev
```

Expected: Dev server starts on port 5173, shows blank page.

**Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold SvelteKit project with Tailwind 4 and shadcn-svelte"
```

---

### Task 2: TypeScript Types & Color Theme Presets

**Files:**
- Create: `src/lib/types/profile.ts`
- Create: `src/lib/data/color-presets.ts`

**Step 1: Define iTerm2 profile types**

Create `src/lib/types/profile.ts`:

```typescript
export interface ITerm2Color {
	'Red Component': number;
	'Green Component': number;
	'Blue Component': number;
	'Alpha Component': number;
	'Color Space': 'sRGB';
}

export const ANSI_COLOR_KEYS = [
	'Ansi 0 Color', 'Ansi 1 Color', 'Ansi 2 Color', 'Ansi 3 Color',
	'Ansi 4 Color', 'Ansi 5 Color', 'Ansi 6 Color', 'Ansi 7 Color',
	'Ansi 8 Color', 'Ansi 9 Color', 'Ansi 10 Color', 'Ansi 11 Color',
	'Ansi 12 Color', 'Ansi 13 Color', 'Ansi 14 Color', 'Ansi 15 Color',
] as const;

export const SPECIAL_COLOR_KEYS = [
	'Background Color', 'Foreground Color', 'Bold Color',
	'Cursor Color', 'Selection Color',
] as const;

export const ALL_COLOR_KEYS = [...SPECIAL_COLOR_KEYS, ...ANSI_COLOR_KEYS] as const;

export type ColorKey = (typeof ALL_COLOR_KEYS)[number];

export interface ITerm2Profile {
	Name: string;
	Guid: string;
	'Dynamic Profile Parent Name'?: string;
	Tags?: string[];

	// Colors
	'Background Color'?: ITerm2Color;
	'Foreground Color'?: ITerm2Color;
	'Bold Color'?: ITerm2Color;
	'Cursor Color'?: ITerm2Color;
	'Selection Color'?: ITerm2Color;
	'Ansi 0 Color'?: ITerm2Color;
	'Ansi 1 Color'?: ITerm2Color;
	'Ansi 2 Color'?: ITerm2Color;
	'Ansi 3 Color'?: ITerm2Color;
	'Ansi 4 Color'?: ITerm2Color;
	'Ansi 5 Color'?: ITerm2Color;
	'Ansi 6 Color'?: ITerm2Color;
	'Ansi 7 Color'?: ITerm2Color;
	'Ansi 8 Color'?: ITerm2Color;
	'Ansi 9 Color'?: ITerm2Color;
	'Ansi 10 Color'?: ITerm2Color;
	'Ansi 11 Color'?: ITerm2Color;
	'Ansi 12 Color'?: ITerm2Color;
	'Ansi 13 Color'?: ITerm2Color;
	'Ansi 14 Color'?: ITerm2Color;
	'Ansi 15 Color'?: ITerm2Color;

	// Font
	'Normal Font'?: string;
	'Non Ascii Font'?: string;

	// Terminal
	Columns?: number;
	Rows?: number;
	'Scrollback Lines'?: number;
	'Unlimited Scrollback'?: boolean;

	// Cursor
	'Cursor Type'?: number;
	'Blinking Cursor'?: boolean;

	// Bell
	'Silence Bell'?: boolean;
	'Visual Bell'?: boolean;

	// Font rendering
	'ASCII Anti Aliased'?: boolean;
	'Non-ASCII Anti Aliased'?: boolean;

	// Command
	'Custom Command'?: 'Yes' | 'No';
	Command?: string;

	// Other
	'Option Key Sends'?: number;
	Transparency?: number;
	'Session Close Undo Timeout'?: number;

	// Allow additional keys
	[key: string]: unknown;
}

export interface ITerm2ProfilesFile {
	Profiles: ITerm2Profile[];
}
```

**Step 2: Create color presets**

Create `src/lib/data/color-presets.ts` with the 8 terminal color themes. Each preset has all 21 color slots as `ITerm2Color` values. The presets are: Solarized Dark, Solarized Light, Dracula, Nord, Monokai, One Dark, Gruvbox Dark, Tokyo Night, Catppuccin Mocha.

Use standard values from each theme's official spec. Example structure:

```typescript
import type { ITerm2Color, ColorKey } from '$lib/types/profile';

export type ColorPreset = Record<ColorKey, ITerm2Color>;

function c(r: number, g: number, b: number, a = 1): ITerm2Color {
	return {
		'Red Component': r / 255,
		'Green Component': g / 255,
		'Blue Component': b / 255,
		'Alpha Component': a,
		'Color Space': 'sRGB',
	};
}

export const COLOR_PRESETS: Record<string, ColorPreset> = {
	'Dracula': {
		'Background Color': c(40, 42, 54),
		'Foreground Color': c(248, 248, 242),
		'Bold Color': c(255, 255, 255),
		'Cursor Color': c(248, 248, 242),
		'Selection Color': c(68, 71, 90),
		'Ansi 0 Color': c(33, 34, 44),
		'Ansi 1 Color': c(255, 85, 85),
		'Ansi 2 Color': c(80, 250, 123),
		'Ansi 3 Color': c(241, 250, 140),
		'Ansi 4 Color': c(98, 114, 164),
		'Ansi 5 Color': c(255, 121, 198),
		'Ansi 6 Color': c(139, 233, 253),
		'Ansi 7 Color': c(248, 248, 242),
		'Ansi 8 Color': c(98, 114, 164),
		'Ansi 9 Color': c(255, 110, 110),
		'Ansi 10 Color': c(105, 255, 148),
		'Ansi 11 Color': c(255, 255, 165),
		'Ansi 12 Color': c(125, 139, 189),
		'Ansi 13 Color': c(255, 146, 213),
		'Ansi 14 Color': c(164, 248, 255),
		'Ansi 15 Color': c(255, 255, 255),
	},
	// ... other themes follow same pattern
};
```

Populate all 9 themes with their actual color values from official specs.

**Step 3: Commit**

```bash
git add src/lib/types/profile.ts src/lib/data/color-presets.ts
git commit -m "feat: add iTerm2 profile types and color theme presets"
```

---

### Task 3: Profile Store with localStorage Persistence

**Files:**
- Create: `src/lib/stores/profiles.svelte.ts`
- Create: `src/lib/utils/color.ts`

**Step 1: Create color utility functions**

Create `src/lib/utils/color.ts`:

```typescript
import type { ITerm2Color } from '$lib/types/profile';

/** Convert iTerm2 color (0-1 range) to hex string */
export function colorToHex(color: ITerm2Color): string {
	const r = Math.round(color['Red Component'] * 255);
	const g = Math.round(color['Green Component'] * 255);
	const b = Math.round(color['Blue Component'] * 255);
	return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/** Convert hex string to iTerm2 color */
export function hexToColor(hex: string, alpha = 1): ITerm2Color {
	const r = parseInt(hex.slice(1, 3), 16) / 255;
	const g = parseInt(hex.slice(3, 5), 16) / 255;
	const b = parseInt(hex.slice(5, 7), 16) / 255;
	return {
		'Red Component': r,
		'Green Component': g,
		'Blue Component': b,
		'Alpha Component': alpha,
		'Color Space': 'sRGB',
	};
}

/** Get CSS color string from iTerm2 color */
export function colorToCSS(color: ITerm2Color): string {
	const r = Math.round(color['Red Component'] * 255);
	const g = Math.round(color['Green Component'] * 255);
	const b = Math.round(color['Blue Component'] * 255);
	const a = color['Alpha Component'];
	if (a < 1) return `rgba(${r}, ${g}, ${b}, ${a})`;
	return `rgb(${r}, ${g}, ${b})`;
}
```

**Step 2: Create the profile store**

Create `src/lib/stores/profiles.svelte.ts`:

```typescript
import type { ITerm2Profile, ITerm2ProfilesFile, ColorKey } from '$lib/types/profile';
import { ALL_COLOR_KEYS } from '$lib/types/profile';
import { COLOR_PRESETS } from '$lib/data/color-presets';

const STORAGE_KEY = 'iterm2-profile-editor';

class ProfileStore {
	profiles = $state<ITerm2Profile[]>([]);
	selectedIds = $state<Set<string>>(new Set());
	searchQuery = $state('');
	filterTag = $state<string | null>(null);
	hasUnsavedData = $state(false);

	/** All unique tags across profiles */
	get allTags(): string[] {
		const tags = new Set<string>();
		for (const p of this.profiles) {
			for (const t of p.Tags ?? []) tags.add(t);
		}
		return [...tags].sort();
	}

	/** Profiles filtered by search and tag */
	get filtered(): ITerm2Profile[] {
		let result = this.profiles;
		if (this.filterTag) {
			result = result.filter((p) => p.Tags?.includes(this.filterTag!));
		}
		if (this.searchQuery) {
			const q = this.searchQuery.toLowerCase();
			result = result.filter(
				(p) =>
					p.Name.toLowerCase().includes(q) ||
					p.Command?.toLowerCase().includes(q) ||
					p.Tags?.some((t) => t.toLowerCase().includes(q))
			);
		}
		return result;
	}

	/** Profiles grouped by first tag (or "Untagged") */
	get grouped(): Map<string, ITerm2Profile[]> {
		const groups = new Map<string, ITerm2Profile[]>();
		for (const p of this.filtered) {
			const tag = p.Tags?.[0] ?? 'Untagged';
			if (!groups.has(tag)) groups.set(tag, []);
			groups.get(tag)!.push(p);
		}
		return groups;
	}

	/** Get a single profile by GUID */
	getByGuid(guid: string): ITerm2Profile | undefined {
		return this.profiles.find((p) => p.Guid === guid);
	}

	/** Load profiles from JSON */
	load(data: ITerm2ProfilesFile) {
		this.profiles = data.Profiles;
		this.selectedIds = new Set();
		this.hasUnsavedData = true;
		this.saveToLocalStorage();
	}

	/** Add a new profile */
	add(presetName?: string) {
		const guid = crypto.randomUUID().toUpperCase();
		const profile: ITerm2Profile = {
			Name: 'New Profile',
			Guid: guid,
			'Custom Command': 'No',
		};
		if (presetName && COLOR_PRESETS[presetName]) {
			const preset = COLOR_PRESETS[presetName];
			for (const key of ALL_COLOR_KEYS) {
				if (preset[key]) {
					(profile as Record<string, unknown>)[key] = { ...preset[key] };
				}
			}
		}
		this.profiles.push(profile);
		this.saveToLocalStorage();
		return guid;
	}

	/** Duplicate a profile */
	copy(guid: string) {
		const source = this.getByGuid(guid);
		if (!source) return;
		const newGuid = crypto.randomUUID().toUpperCase();
		const copy = structuredClone(source);
		copy.Guid = newGuid;
		copy.Name = `${source.Name} (copy)`;
		const idx = this.profiles.indexOf(source);
		this.profiles.splice(idx + 1, 0, copy);
		this.saveToLocalStorage();
		return newGuid;
	}

	/** Delete a profile */
	delete(guid: string) {
		const idx = this.profiles.findIndex((p) => p.Guid === guid);
		if (idx !== -1) {
			this.profiles.splice(idx, 1);
			this.selectedIds.delete(guid);
			this.saveToLocalStorage();
		}
	}

	/** Update profile fields */
	update(guid: string, changes: Partial<ITerm2Profile>) {
		const profile = this.getByGuid(guid);
		if (!profile) return;
		Object.assign(profile, changes);
		this.saveToLocalStorage();
	}

	/** Set a single color on a profile */
	setColor(guid: string, key: ColorKey, color: import('$lib/types/profile').ITerm2Color) {
		const profile = this.getByGuid(guid);
		if (!profile) return;
		(profile as Record<string, unknown>)[key] = color;
		this.saveToLocalStorage();
	}

	/** Apply a color preset to a profile */
	applyTheme(guid: string, presetName: string) {
		const preset = COLOR_PRESETS[presetName];
		if (!preset) return;
		const profile = this.getByGuid(guid);
		if (!profile) return;
		for (const key of ALL_COLOR_KEYS) {
			if (preset[key]) {
				(profile as Record<string, unknown>)[key] = { ...preset[key] };
			}
		}
		this.saveToLocalStorage();
	}

	// --- Bulk operations ---

	toggleSelect(guid: string) {
		if (this.selectedIds.has(guid)) {
			this.selectedIds.delete(guid);
		} else {
			this.selectedIds.add(guid);
		}
		// Trigger reactivity
		this.selectedIds = new Set(this.selectedIds);
	}

	selectAll() {
		this.selectedIds = new Set(this.filtered.map((p) => p.Guid));
	}

	deselectAll() {
		this.selectedIds = new Set();
	}

	bulkDelete() {
		this.profiles = this.profiles.filter((p) => !this.selectedIds.has(p.Guid));
		this.selectedIds = new Set();
		this.saveToLocalStorage();
	}

	bulkApplyTags(tags: string[]) {
		for (const p of this.profiles) {
			if (this.selectedIds.has(p.Guid)) {
				const existing = new Set(p.Tags ?? []);
				for (const t of tags) existing.add(t);
				p.Tags = [...existing];
			}
		}
		this.selectedIds = new Set();
		this.saveToLocalStorage();
	}

	bulkApplyTheme(presetName: string) {
		for (const guid of this.selectedIds) {
			this.applyTheme(guid, presetName);
		}
		this.selectedIds = new Set();
	}

	// --- Persistence ---

	saveToLocalStorage() {
		this.hasUnsavedData = true;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({ Profiles: this.profiles }));
		} catch {
			// localStorage full or unavailable
		}
	}

	restoreFromLocalStorage(): boolean {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return false;
			const data = JSON.parse(raw) as ITerm2ProfilesFile;
			if (data.Profiles?.length > 0) {
				this.profiles = data.Profiles;
				this.hasUnsavedData = true;
				return true;
			}
		} catch {
			// corrupt data
		}
		return false;
	}

	clearLocalStorage() {
		localStorage.removeItem(STORAGE_KEY);
		this.profiles = [];
		this.selectedIds = new Set();
		this.hasUnsavedData = false;
	}

	// --- Export ---

	toJSON(): ITerm2ProfilesFile {
		return { Profiles: this.profiles };
	}

	downloadJSON() {
		const blob = new Blob([JSON.stringify(this.toJSON(), null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'iterm2-profiles.json';
		a.click();
		URL.revokeObjectURL(url);
	}
}

export const profileStore = new ProfileStore();
```

**Step 3: Commit**

```bash
git add src/lib/stores/profiles.svelte.ts src/lib/utils/color.ts
git commit -m "feat: add profile store with localStorage and color utils"
```

---

### Task 4: Upload Zone & Landing Page

**Files:**
- Create: `src/lib/components/UploadZone.svelte`
- Modify: `src/routes/+page.svelte`
- Create: `src/routes/+layout.svelte`

**Step 1: Create layout**

`src/routes/+layout.svelte`:

```svelte
<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}
```

**Step 2: Create UploadZone component**

`src/lib/components/UploadZone.svelte` — A drag-and-drop zone that accepts `.json` files. On drop/select, reads the file, validates it has a `Profiles` array, and calls `profileStore.load()`. Shows error if invalid JSON.

Use shadcn `Button` and `Card`. Use `Upload` icon from `@lucide/svelte`. Include:
- Drag-over visual feedback (border color change)
- File input hidden behind "Browse" button
- Error message for invalid files
- Accepts only `.json` files

**Step 3: Create landing page**

`src/routes/+page.svelte` — Shows either:
- If `profileStore.profiles.length === 0`: UploadZone centered on page, plus a "Restore previous session" button if localStorage has data
- If profiles loaded: profile list (built in Task 5)

Check localStorage on mount via `$effect` and show restore banner if data exists.

**Step 4: Verify upload works**

Run dev server, drag the test file (`/Users/azmi/PROJECTS/UTILITIES/iterm2/20260303/terminal-profiles-for-iterm2.json`) onto the page. Should parse and show profile count.

**Step 5: Commit**

```bash
git add src/lib/components/UploadZone.svelte src/routes/+page.svelte src/routes/+layout.svelte
git commit -m "feat: add upload zone and landing page with localStorage restore"
```

---

### Task 5: Terminal Preview Card & Profile List

**Files:**
- Create: `src/lib/components/TerminalPreview.svelte`
- Create: `src/lib/components/ProfileList.svelte`
- Create: `src/lib/components/TagGroup.svelte`
- Modify: `src/routes/+page.svelte`

**Step 1: Create TerminalPreview component**

`src/lib/components/TerminalPreview.svelte` — Mini terminal card for each profile.

Props: `profile: ITerm2Profile`, `selected: boolean`, `onselect: () => void`, `onclick: () => void`

Layout (mobile-first card):
- Title bar with profile name (styled like a terminal title bar)
- Body with background color from profile, showing:
  - A fake prompt line: `$ <command snippet>` in foreground color
  - A row of 16 ANSI color swatches (small colored squares, 8 normal + 8 bright)
- Below the card: tag badges, font name
- Checkbox overlay for selection mode

Use `colorToCSS()` from `$lib/utils/color.ts` for inline styles. Fallback to a default dark color if profile has no background color set.

**Step 2: Create TagGroup component**

`src/lib/components/TagGroup.svelte` — Collapsible group header.

Props: `tag: string`, `count: number`, `expanded: boolean`, `ontoggle: () => void`

Uses `ChevronRight` icon that rotates when expanded. Shows tag name and profile count.

**Step 3: Create ProfileList component**

`src/lib/components/ProfileList.svelte` — Full profile list with toolbar.

Toolbar (sticky top):
- Search input (magnifying glass icon)
- Tag filter dropdown (using shadcn Select)
- "Add Profile" button
- "Download JSON" button
- Bulk action bar (appears when selections exist): "Delete Selected", "Apply Theme", "Apply Tags", "Select All / Deselect"

Body: Renders `TagGroup` for each group from `profileStore.grouped`, with `TerminalPreview` cards inside. Cards laid out in a responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop).

Clicking a card navigates to `/profile/[guid]`.

**Step 4: Wire into page**

Update `src/routes/+page.svelte` to show `ProfileList` when profiles are loaded.

**Step 5: Test with real data**

Upload the test JSON. Verify:
- Cards render with correct colors
- Tags are grouped (SSH, MySQL, etc.)
- Search filters profiles
- Tag dropdown filters by tag

**Step 6: Commit**

```bash
git add src/lib/components/TerminalPreview.svelte src/lib/components/ProfileList.svelte src/lib/components/TagGroup.svelte src/routes/+page.svelte
git commit -m "feat: add terminal preview cards and grouped profile list"
```

---

### Task 6: Profile Editor — Page & Settings Tab

**Files:**
- Create: `src/routes/profile/[guid]/+page.svelte`
- Create: `src/lib/components/ProfileSettings.svelte`

**Step 1: Create editor page**

`src/routes/profile/[guid]/+page.svelte` — Full-page editor.

Extract `guid` from `$page.params`. Look up profile from `profileStore.getByGuid(guid)`. If not found, redirect to `/`.

Layout:
- Top bar: Back button (arrow left icon), profile name (editable), Copy/Delete buttons
- Tabs (using shadcn Tabs): "Colors", "Settings", "Command"
- Live terminal preview at top showing current colors

**Step 2: Create ProfileSettings component**

`src/lib/components/ProfileSettings.svelte` — Settings tab content.

Props: `profile: ITerm2Profile`, `onchange: (changes: Partial<ITerm2Profile>) => void`

Fields (using shadcn form components):
- **Name**: text input
- **Tags**: comma-separated text input (parse on blur)
- **Font**: text input for "Normal Font" (e.g., "MesloLGS-NF-Regular 13")
- **Columns**: number input
- **Rows**: number input
- **Scrollback Lines**: number input (disabled if Unlimited Scrollback)
- **Unlimited Scrollback**: switch toggle
- **Cursor Type**: select (Underline / Vertical Bar / Box)
- **Blinking Cursor**: switch toggle
- **Silence Bell**: switch toggle
- **Visual Bell**: switch toggle
- **Anti-Aliased**: switch toggle (sets both ASCII and Non-ASCII)
- **Option Key Sends**: select (Normal=0 / Esc+=2)
- **Transparency**: range slider 0-1

Each field calls `onchange()` on input/change to update the store.

**Step 3: Commit**

```bash
git add src/routes/profile/\[guid\]/+page.svelte src/lib/components/ProfileSettings.svelte
git commit -m "feat: add profile editor page with settings tab"
```

---

### Task 7: Profile Editor — Color Tab

**Files:**
- Create: `src/lib/components/ColorEditor.svelte`
- Create: `src/lib/components/ColorSlot.svelte`

**Step 1: Create ColorSlot component**

`src/lib/components/ColorSlot.svelte`

Props: `label: string`, `color: ITerm2Color | undefined`, `onchange: (color: ITerm2Color) => void`

Renders:
- A colored square (40x40px on mobile, 48x48 on desktop) showing the current color
- Label below the square
- Hidden `<input type="color">` triggered on click
- On color change, converts hex to ITerm2Color and calls `onchange`

If color is undefined, show a dashed border placeholder.

**Step 2: Create ColorEditor component**

`src/lib/components/ColorEditor.svelte`

Props: `profile: ITerm2Profile`, `oncolorchange: (key: ColorKey, color: ITerm2Color) => void`, `onthemeapply: (preset: string) => void`

Layout:
- **Theme preset selector** at top: shadcn Select with preset names. "Apply Theme" button.
- **Special colors section**: Background, Foreground, Bold, Cursor, Selection — laid out as a row
- **ANSI colors section**: Two rows of 8 swatches each (normal 0-7, bright 8-15) with labels like "Black", "Red", "Green", "Yellow", "Blue", "Magenta", "Cyan", "White"
- **Large live preview**: Shows a terminal mockup with the current colors applied — background, foreground text, and colored text samples using each ANSI color

ANSI color label mapping:
```
0/8: Black, 1/9: Red, 2/10: Green, 3/11: Yellow,
4/12: Blue, 5/13: Magenta, 6/14: Cyan, 7/15: White
```

**Step 3: Wire into editor page**

Add the Colors tab content in the editor page, using `ColorEditor`.

**Step 4: Test**

Open a profile with colors (e.g., "Clear Dark"). Verify:
- All 21 color slots render with correct colors
- Clicking a swatch opens color picker
- Changing a color updates the preview live
- Applying a theme preset updates all colors

**Step 5: Commit**

```bash
git add src/lib/components/ColorEditor.svelte src/lib/components/ColorSlot.svelte src/routes/profile/\[guid\]/+page.svelte
git commit -m "feat: add color editor with theme presets and live preview"
```

---

### Task 8: Profile Editor — Command Tab

**Files:**
- Create: `src/lib/components/ProfileCommand.svelte`
- Modify: `src/routes/profile/[guid]/+page.svelte`

**Step 1: Create ProfileCommand component**

`src/lib/components/ProfileCommand.svelte`

Props: `profile: ITerm2Profile`, `onchange: (changes: Partial<ITerm2Profile>) => void`

Layout:
- **Custom Command toggle**: Switch. When "No", command textarea is hidden.
- **Command**: Textarea (when Custom Command is "Yes"). Multi-line, monospace font.
- **Session Close**: Select — "Close window" / "Don't close" / "Close if clean exit"

On toggle:
- "Yes" → show textarea, set `'Custom Command': 'Yes'`
- "No" → hide textarea, set `'Custom Command': 'No'`, clear `Command`

**Step 2: Wire into editor page**

Add Command tab to the editor page.

**Step 3: Commit**

```bash
git add src/lib/components/ProfileCommand.svelte src/routes/profile/\[guid\]/+page.svelte
git commit -m "feat: add command tab to profile editor"
```

---

### Task 9: Bulk Operations

**Files:**
- Create: `src/lib/components/BulkActions.svelte`
- Modify: `src/lib/components/ProfileList.svelte`

**Step 1: Create BulkActions component**

`src/lib/components/BulkActions.svelte`

Shown in ProfileList toolbar when `profileStore.selectedIds.size > 0`.

Layout (responsive row of buttons):
- "N selected" count
- "Select All" / "Deselect All" button
- "Delete Selected" button (opens AlertDialog confirmation)
- "Apply Theme" button (opens dropdown with preset names)
- "Add Tags" button (opens Dialog with tag input)

Each action calls the corresponding `profileStore.bulk*()` method.

**Step 2: Update ProfileList**

- Add checkbox to each TerminalPreview card
- Show BulkActions bar when selections exist
- Long-press or checkbox click enters selection mode on mobile

**Step 3: Test bulk operations**

Upload test JSON. Select a few profiles, apply "Dracula" theme, verify colors change. Select others, delete, verify they're removed. Apply tags, verify they appear.

**Step 4: Commit**

```bash
git add src/lib/components/BulkActions.svelte src/lib/components/ProfileList.svelte
git commit -m "feat: add bulk operations for profiles"
```

---

### Task 10: Polish & Final Testing

**Files:**
- Modify: various components for responsive polish
- Modify: `src/app.css` for any global style tweaks

**Step 1: Responsive testing**

Test all views at mobile (375px), tablet (768px), and desktop (1280px) widths:
- Upload zone is usable on mobile
- Profile cards reflow to single column on mobile
- Editor page is scrollable and usable on mobile
- Color swatches are tappable on mobile (min 44px touch targets)

**Step 2: Edge cases**

- Upload an empty JSON (`{ "Profiles": [] }`) — should show empty state
- Upload invalid JSON — should show error
- Profile with no colors — should render with placeholder swatches
- Profile with no tags — should appear in "Untagged" group
- Very long profile name — should truncate with ellipsis
- Very long command — should truncate in preview, full in editor

**Step 3: localStorage flow**

- Upload JSON, edit a profile, close tab, reopen — should offer restore
- Click "Restore" — profiles load with edits preserved
- Click "Clear" — localStorage cleared, back to upload zone

**Step 4: Download**

- Edit profiles, download JSON
- Verify downloaded file is valid iTerm2 Dynamic Profiles format
- Re-upload the downloaded file — should work identically

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: polish responsive layout and edge case handling"
```

---

### Task 11: Deploy to Cloudflare Pages

**Step 1: Build**

```bash
pnpm build
```

Verify no build errors.

**Step 2: Create wrangler.jsonc (if needed)**

```jsonc
{
	"name": "iterm2-profile-editor",
	"compatibility_date": "2025-01-01",
	"pages_build_output_dir": ".svelte-kit/cloudflare"
}
```

**Step 3: Deploy**

```bash
pnpm dlx wrangler pages deploy .svelte-kit/cloudflare --project-name iterm2-profile-editor
```

Or set up via Cloudflare dashboard with git integration.

**Step 4: Verify deployment**

Open the deployed URL. Upload JSON, edit a profile, download. Confirm everything works.

**Step 5: Commit deploy config**

```bash
git add wrangler.jsonc
git commit -m "chore: add Cloudflare Pages deploy config"
```
