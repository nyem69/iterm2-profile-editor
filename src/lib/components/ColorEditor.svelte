<script lang="ts">
	import { profileStore } from '$lib/stores/profiles.svelte';
	import { COLOR_PRESETS } from '$lib/data/color-presets';
	import { SPECIAL_COLOR_KEYS, ANSI_COLOR_KEYS, ANSI_COLOR_NAMES } from '$lib/types/profile';
	import type { ColorKey, ITerm2Color } from '$lib/types/profile';
	import { colorToCSS } from '$lib/utils/color';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import ColorSlot from '$lib/components/ColorSlot.svelte';

	let { guid }: { guid: string } = $props();

	let profile = $derived(profileStore.getByGuid(guid));

	let presetNames = Object.keys(COLOR_PRESETS);
	let selectedPreset = $state(presetNames[0]);

	function applyPreset() {
		profileStore.applyTheme(guid, selectedPreset);
	}

	function handleColorChange(key: ColorKey) {
		return (color: ITerm2Color) => {
			profileStore.setColor(guid, key, color);
		};
	}

	// Derive colors for the terminal preview
	let bgColor = $derived(profile?.['Background Color']);
	let fgColor = $derived(profile?.['Foreground Color']);
	let cursorColor = $derived(profile?.['Cursor Color']);
	let selectionColor = $derived(profile?.['Selection Color']);
	let boldColor = $derived(profile?.['Bold Color']);

	let bgCSS = $derived(bgColor ? colorToCSS(bgColor) : '#1e1e2e');
	let fgCSS = $derived(fgColor ? colorToCSS(fgColor) : '#cdd6f4');
	let cursorCSS = $derived(cursorColor ? colorToCSS(cursorColor) : '#f5e0dc');
	let selectionCSS = $derived(selectionColor ? colorToCSS(selectionColor) : 'rgba(88,91,112,0.5)');
	let boldCSS = $derived(boldColor ? colorToCSS(boldColor) : fgCSS);

	function ansiCSS(index: number): string {
		const key = ANSI_COLOR_KEYS[index];
		const color = profile?.[key];
		return color ? colorToCSS(color) : '#888';
	}

	const SPECIAL_LABELS = ['Background', 'Foreground', 'Bold', 'Cursor', 'Selection'];
</script>

{#if profile}
	<!-- Theme Preset Selector -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
		<Select.Root type="single" bind:value={selectedPreset}>
			<Select.Trigger class="w-full sm:w-[220px]">
				{selectedPreset || 'Select a theme...'}
			</Select.Trigger>
			<Select.Content>
				{#each presetNames as name}
					<Select.Item value={name} label={name} />
				{/each}
			</Select.Content>
		</Select.Root>
		<Button onclick={applyPreset} variant="secondary" size="sm">
			Apply Theme
		</Button>
	</div>

	<!-- Live Terminal Preview -->
	<div
		class="rounded-lg border overflow-hidden mb-6 font-mono text-sm"
		style="background-color: {bgCSS}; color: {fgCSS}; font-family: 'Geist Mono', monospace; min-height: 200px;"
	>
		<div class="flex items-center gap-2 px-4 py-2 border-b" style="border-color: rgba(255,255,255,0.1);">
			<div class="w-3 h-3 rounded-full bg-red-500"></div>
			<div class="w-3 h-3 rounded-full bg-yellow-500"></div>
			<div class="w-3 h-3 rounded-full bg-green-500"></div>
			<span class="ml-2 text-xs opacity-60">{profile.Name}</span>
		</div>
		<div class="p-4 space-y-1 leading-relaxed">
			<div>
				<span style="color: {ansiCSS(2)}">user</span><span style="color: {fgCSS}">@</span><span style="color: {ansiCSS(4)}">machine</span><span style="color: {fgCSS}">:</span><span style="color: {ansiCSS(6)}">~</span><span style="color: {fgCSS}">$</span>
				<span> ls -la</span>
			</div>
			<div>
				<span style="color: {ansiCSS(4)}">drwxr-xr-x</span>
				<span>  5 user staff  160 Mar  3 </span>
				<span style="color: {boldCSS}; font-weight: bold;">Documents</span>
			</div>
			<div>
				<span style="color: {ansiCSS(4)}">-rw-r--r--</span>
				<span>  1 user staff  842 Mar  3 </span>
				<span>README.md</span>
			</div>
			<div class="mt-2">
				<span style="color: {ansiCSS(2)}">user</span><span style="color: {fgCSS}">@</span><span style="color: {ansiCSS(4)}">machine</span><span style="color: {fgCSS}">:</span><span style="color: {ansiCSS(6)}">~</span><span style="color: {fgCSS}">$</span>
				<span> echo "</span><span style="color: {ansiCSS(3)}">The quick brown fox</span><span>"</span>
			</div>
			<div style="color: {ansiCSS(3)}">The quick brown fox</div>
			<div class="mt-2">
				<span style="color: {ansiCSS(2)}">user</span><span style="color: {fgCSS}">@</span><span style="color: {ansiCSS(4)}">machine</span><span style="color: {fgCSS}">:</span><span style="color: {ansiCSS(6)}">~</span><span style="color: {fgCSS}">$</span>
				<span> grep "</span><span style="color: {ansiCSS(1)}">error</span><span>" log.txt</span>
			</div>
			<div>
				<span>Found: </span><span style="background-color: {selectionCSS}; padding: 0 2px; border-radius: 2px;">selected text</span>
				<span> in output</span>
			</div>
			<div class="mt-2 flex items-center">
				<span style="color: {ansiCSS(2)}">user</span><span style="color: {fgCSS}">@</span><span style="color: {ansiCSS(4)}">machine</span><span style="color: {fgCSS}">:</span><span style="color: {ansiCSS(6)}">~</span><span style="color: {fgCSS}">$</span>
				<span class="inline-block w-2 h-4 ml-1 animate-pulse" style="background-color: {cursorCSS};"></span>
			</div>
			<!-- ANSI color swatches row -->
			<div class="mt-3 pt-3 flex flex-wrap gap-1" style="border-top: 1px solid rgba(255,255,255,0.1);">
				{#each ANSI_COLOR_NAMES as name, i}
					<span
						class="px-1.5 py-0.5 rounded text-xs"
						style="color: {ansiCSS(i)};"
					>{name.replace('Bright ', 'B.')}</span>
				{/each}
			</div>
		</div>
	</div>

	<Separator class="my-6" />

	<!-- Special Colors (Theme Colors) -->
	<div class="mb-6">
		<h3 class="text-sm font-semibold mb-3">Theme Colors</h3>
		<div class="flex flex-wrap gap-4">
			{#each SPECIAL_COLOR_KEYS as key, i}
				<ColorSlot
					label={SPECIAL_LABELS[i]}
					color={profile[key]}
					onchange={handleColorChange(key)}
				/>
			{/each}
		</div>
	</div>

	<Separator class="my-6" />

	<!-- ANSI Colors -->
	<div>
		<h3 class="text-sm font-semibold mb-3">ANSI Colors</h3>

		<!-- Normal colors (0-7) -->
		<p class="text-xs text-muted-foreground mb-2">Normal</p>
		<div class="flex flex-wrap gap-3 mb-4">
			{#each { length: 8 } as _, i}
				<ColorSlot
					label={ANSI_COLOR_NAMES[i]}
					color={profile[ANSI_COLOR_KEYS[i]]}
					onchange={handleColorChange(ANSI_COLOR_KEYS[i])}
				/>
			{/each}
		</div>

		<!-- Bright colors (8-15) -->
		<p class="text-xs text-muted-foreground mb-2">Bright</p>
		<div class="flex flex-wrap gap-3">
			{#each { length: 8 } as _, i}
				<ColorSlot
					label={ANSI_COLOR_NAMES[i + 8]}
					color={profile[ANSI_COLOR_KEYS[i + 8]]}
					onchange={handleColorChange(ANSI_COLOR_KEYS[i + 8])}
				/>
			{/each}
		</div>
	</div>
{/if}
