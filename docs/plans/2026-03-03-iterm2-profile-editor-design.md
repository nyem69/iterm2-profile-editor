# iTerm2 Profile Editor — Design

## Overview

A client-side web app for editing iTerm2 profile JSON files. Users upload an iTerm2 Dynamic Profiles JSON, visually browse and edit profiles (colors, settings, commands), and download the modified JSON. All processing happens in the browser.

## Architecture

**Fully client-side SvelteKit app** deployed to Cloudflare Pages.

- **Adapter:** `@sveltejs/adapter-cloudflare`
- **State:** Svelte 5 runes (`$state`, `$derived`, `$effect`) in a class-based store
- **Persistence:** Auto-save to `localStorage` on every mutation, restore on load
- **Data format:** iTerm2 Dynamic Profiles JSON (`{ "Profiles": [...] }`)
- **No server routes** — everything in-browser

```
Upload JSON → Parse → ProfileStore ($state) ↔ localStorage
                              ↓
                Profile List (grouped by tag)
                              ↓
                Profile Editor (full-page, tabbed)
                              ↓
                Download JSON
```

## Data Model

### iTerm2 Profile (21 color slots + settings)

```typescript
interface ITerm2Color {
  "Red Component": number;    // 0-1
  "Green Component": number;
  "Blue Component": number;
  "Alpha Component": number;
  "Color Space": "sRGB";
}

interface ITerm2Profile {
  Name: string;
  Guid: string;
  "Dynamic Profile Parent Name"?: string;
  Tags?: string[];

  // Colors (21 slots)
  "Background Color"?: ITerm2Color;
  "Foreground Color"?: ITerm2Color;
  "Bold Color"?: ITerm2Color;
  "Cursor Color"?: ITerm2Color;
  "Selection Color"?: ITerm2Color;
  "Ansi 0 Color"?: ITerm2Color;   // through "Ansi 15 Color"
  // ... Ansi 1-15

  // Font
  "Normal Font"?: string;
  "Non Ascii Font"?: string;

  // Terminal
  Columns?: number;
  Rows?: number;
  "Scrollback Lines"?: number;
  "Unlimited Scrollback"?: boolean;

  // Cursor
  "Cursor Type"?: number;        // 0=underline, 1=vertical bar, 2=box
  "Blinking Cursor"?: boolean;

  // Bell
  "Silence Bell"?: boolean;
  "Visual Bell"?: boolean;

  // Font rendering
  "ASCII Anti Aliased"?: boolean;
  "Non-ASCII Anti Aliased"?: boolean;

  // Command
  "Custom Command"?: "Yes" | "No";
  Command?: string;

  // Other
  "Option Key Sends"?: number;
  Transparency?: number;
  "Session Close Undo Timeout"?: number;
}

interface ITerm2ProfilesFile {
  Profiles: ITerm2Profile[];
}
```

## Pages & Navigation

Mobile-first, full-page views with SvelteKit client-side routing.

### `/` — Profile List

- **Empty state:** Upload drop zone with file picker button
- **With data:** Toolbar (search, filter by tag, bulk actions, add/download buttons) + profile cards grouped by tag
- **Profile cards:** Mini terminal mockup showing bg/fg colors, ANSI color swatches, name, tags, command preview
- **Selection mode:** Checkbox on each card for bulk operations
- **Restore prompt:** If localStorage has data, show "Restore previous session?" banner

### `/profile/[guid]` — Profile Editor

Full-page editor with back button. Organized in tabs:

| Tab | Fields |
|-----|--------|
| **Colors** | 21 color slots with pickers, preset theme selector, live terminal preview |
| **Settings** | Name, tags, font, columns/rows, scrollback, cursor type/blink, bell, anti-aliasing, transparency, option key |
| **Command** | Custom command toggle, command text area |

## Key Components

| Component | Purpose |
|-----------|---------|
| `TerminalPreview` | Mini terminal card: bg/fg colors, ANSI swatches, name, command snippet |
| `ColorSlot` | Single color swatch + native `<input type="color">` picker |
| `ColorEditor` | Grid of 21 ColorSlots + preset theme dropdown |
| `ThemePresets` | Preset selector: Solarized Dark/Light, Dracula, Nord, Monokai, One Dark, Gruvbox, Tokyo Night, Catppuccin Mocha |
| `ProfileForm` | Settings tab fields |
| `TagGroup` | Collapsible section header for a tag group |
| `BulkActions` | Toolbar for multi-select: delete, apply tags, apply color preset |
| `UploadZone` | Drag-and-drop + file picker for JSON upload |

## Store Design

```typescript
// src/lib/stores/profiles.svelte.ts
class ProfileStore {
  profiles = $state<ITerm2Profile[]>([]);
  selectedIds = $state<Set<string>>(new Set());
  searchQuery = $state('');
  filterTag = $state<string | null>(null);

  // Derived
  get grouped() { /* group by tags */ }
  get filtered() { /* apply search + tag filter */ }

  // Actions
  load(json: ITerm2ProfilesFile) { ... }
  add(preset?: string) { ... }
  copy(guid: string) { ... }
  delete(guid: string) { ... }
  update(guid: string, changes: Partial<ITerm2Profile>) { ... }
  applyTheme(guid: string, theme: string) { ... }

  // Bulk
  bulkDelete() { ... }
  bulkApplyTags(tags: string[]) { ... }
  bulkApplyTheme(theme: string) { ... }

  // Persistence
  saveToLocalStorage() { ... }
  restoreFromLocalStorage(): boolean { ... }

  // Export
  toJSON(): ITerm2ProfilesFile { ... }
}
```

## Color Theme Presets

Each preset defines all 21 color slots. Built-in themes:

- Solarized Dark, Solarized Light
- Dracula
- Nord
- Monokai
- One Dark
- Gruvbox Dark
- Tokyo Night
- Catppuccin Mocha

Applying a preset fills all color slots. Users can then customize individual colors.

## Bulk Operations

When selection mode is active:
- **Bulk delete:** Remove all selected profiles (with confirmation)
- **Bulk tag:** Add/remove tags to all selected
- **Bulk theme:** Apply a color preset to all selected

## Tech Stack

| Tech | Version | Purpose |
|------|---------|---------|
| SvelteKit | 2.x | Framework |
| Svelte | 5.x | UI (runes mode) |
| Tailwind CSS | 4.x | Styling via `@tailwindcss/vite` |
| shadcn-svelte | latest | UI components (button, input, dialog, tabs, select, sheet) |
| @lucide/svelte | latest | Icons |
| @sveltejs/adapter-cloudflare | latest | Deployment |

## What's NOT in scope

- Server-side processing
- User accounts or sharing
- Direct Terminal.app plist import (use Python converter first)
- iTerm2 features beyond Dynamic Profiles format (key mappings, triggers, etc.)
- Paraglide/i18n (not needed for this tool)
- Capacitor/mobile app (responsive web only)
