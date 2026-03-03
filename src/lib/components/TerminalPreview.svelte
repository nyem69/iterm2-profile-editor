<script lang="ts">
	import type { ITerm2Profile } from '$lib/types/profile';
	import { ANSI_COLOR_KEYS } from '$lib/types/profile';
	import { colorToCSS } from '$lib/utils/color';
	import { maskCommand } from '$lib/utils/mask';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';

	let {
		profile,
		selected = false,
		onselect,
		onclick,
	}: {
		profile: ITerm2Profile;
		selected: boolean;
		onselect: () => void;
		onclick: () => void;
	} = $props();

	const DEFAULT_BG = '#1a1b26';
	const DEFAULT_FG = '#c0caf5';

	let bgColor = $derived(
		profile['Background Color'] ? colorToCSS(profile['Background Color']) : DEFAULT_BG
	);
	let fgColor = $derived(
		profile['Foreground Color'] ? colorToCSS(profile['Foreground Color']) : DEFAULT_FG
	);

	let command = $derived(
		profile.Command ? maskCommand(profile.Command).slice(0, 40) : 'bash'
	);

	let fontName = $derived.by(() => {
		if (!profile['Normal Font']) return '';
		// Font string is like "Monaco 12" or ".AppleSystemUIFont 11.0"
		const parts = profile['Normal Font'].split(' ');
		return parts.slice(0, -1).join(' ') || parts[0];
	});

	function handleCheckboxClick(e: MouseEvent) {
		e.stopPropagation();
		onselect();
	}
</script>

<div
	class="group relative cursor-pointer overflow-hidden rounded-lg border transition-all hover:shadow-md {selected
		? 'ring-2 ring-primary'
		: ''}"
	role="button"
	tabindex="0"
	onclick={onclick}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick();
		}
	}}
>
	<!-- Title bar -->
	<div
		class="flex items-center gap-2 px-3 py-1.5"
		style="background-color: color-mix(in srgb, {bgColor} 80%, black 20%)"
	>
		<!-- Traffic light dots -->
		<div class="flex gap-1.5">
			<span class="inline-block size-2.5 rounded-full bg-[#ff5f57]"></span>
			<span class="inline-block size-2.5 rounded-full bg-[#febc2e]"></span>
			<span class="inline-block size-2.5 rounded-full bg-[#28c840]"></span>
		</div>
		<span
			class="flex-1 truncate text-xs font-medium"
			style="color: {fgColor}"
		>
			{profile.Name}
		</span>
	</div>

	<!-- Terminal body -->
	<div
		class="min-h-[120px] px-3 py-2"
		style="background-color: {bgColor}; color: {fgColor}; font-family: 'Geist Mono', monospace;"
	>
		<!-- Fake prompt -->
		<p class="text-xs leading-relaxed">
			<span class="opacity-70">$</span> {command}
		</p>

		<!-- ANSI color swatches -->
		<div class="mt-3 grid grid-cols-8 gap-0.5">
			{#each ANSI_COLOR_KEYS as key}
				{@const color = profile[key]}
				<div
					class="size-4 rounded-sm"
					style="background-color: {color ? colorToCSS(color) : 'transparent'}"
					title={key}
				></div>
			{/each}
		</div>
	</div>

	<!-- Footer: tags + font -->
	<div class="flex flex-wrap items-center gap-1.5 border-t px-3 py-2">
		{#if profile.Tags && profile.Tags.length > 0}
			{#each profile.Tags as tag}
				<Badge variant="secondary" class="text-[10px]">{tag}</Badge>
			{/each}
		{/if}
		{#if fontName}
			<span class="ml-auto text-[10px] text-muted-foreground">{fontName}</span>
		{/if}
	</div>

	<!-- Checkbox overlay -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 {selected
			? 'opacity-100'
			: ''}"
		onclick={handleCheckboxClick}
	>
		<Checkbox checked={selected} />
	</div>
</div>
