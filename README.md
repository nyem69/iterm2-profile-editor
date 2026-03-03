# iTerm2 Profile Editor

A visual web editor for iTerm2 Dynamic Profiles JSON files. Upload your profiles, preview color themes, edit settings, and download the modified file. Everything runs entirely in your browser.

## Features

- **Visual preview** — Terminal mockup cards showing background/foreground colors and ANSI color swatches for each profile
- **Color theme presets** — Apply Dracula, Solarized, Nord, Monokai, One Dark, Gruvbox, Tokyo Night, or Catppuccin Mocha with one click
- **Profile management** — Add, copy, delete, and organize profiles by tags
- **Full settings editor** — Edit colors, fonts, terminal size, cursor, scrollback, commands, and more
- **Bulk operations** — Select multiple profiles to apply themes, add tags, or delete in batch
- **Credential masking** — Passwords and tokens in commands are automatically masked in preview cards
- **Dark/light mode** — Toggle between themes, respects system preference
- **Auto-save** — Changes persist to browser localStorage, restore on next visit
- **Fully client-side** — No server, no uploads, no tracking. Your data never leaves your browser.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20+
- [pnpm](https://pnpm.io)

### Development

```bash
pnpm install
pnpm dev
```

### Build

```bash
pnpm build
pnpm preview
```

### Deploy to Cloudflare Pages

```bash
pnpm build
pnpm dlx wrangler pages deploy .svelte-kit/cloudflare --project-name iterm2-profile-editor
```

## Usage

1. **Export your profiles from iTerm2:**
   - iTerm2 → Settings → Profiles → Other Actions → Save All Profiles as JSON
   - Or find them in `~/Library/Application Support/iTerm2/DynamicProfiles/`

2. **Upload** the JSON file (drag & drop or browse)

3. **Edit** — click any profile card to open the full editor with three tabs:
   - **Colors** — 21 color slots with pickers, apply presets
   - **Settings** — Name, tags, font, terminal size, cursor, scrollback, transparency
   - **Command** — Custom shell command, session close behavior

4. **Download** the modified JSON and place it back in iTerm2's DynamicProfiles folder

### Converting from Terminal.app

If migrating from macOS Terminal, use the included Python converter script to export Terminal.app profiles to iTerm2 format first, then upload the resulting JSON.

## Tech Stack

- [SvelteKit](https://svelte.dev/docs/kit) + [Svelte 5](https://svelte.dev) (runes mode)
- [Tailwind CSS 4](https://tailwindcss.com)
- [shadcn-svelte](https://shadcn-svelte.com)
- [Cloudflare Pages](https://pages.cloudflare.com) via `@sveltejs/adapter-cloudflare`

## Privacy

All processing happens entirely in your browser. No data is sent to any server. Profiles are optionally cached in `localStorage` for convenience. Passwords and sensitive tokens in command strings are masked with asterisks in preview cards — the editor textarea shows actual values since you need to edit them.

## License

[AGPLv3](LICENSE)
