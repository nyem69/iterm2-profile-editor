<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	let {
		tag,
		count,
		children,
		expanded = $bindable(false),
	}: {
		tag: string;
		count: number;
		children: Snippet;
		expanded?: boolean;
	} = $props();
</script>

<div class="mb-4">
	<button
		class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-muted/50 transition-colors"
		onclick={() => (expanded = !expanded)}
	>
		<ChevronRight
			class="size-4 text-muted-foreground transition-transform duration-200 {expanded
				? 'rotate-90'
				: ''}"
		/>
		<span class="font-medium">{tag}</span>
		<Badge variant="secondary" class="text-xs">{count}</Badge>
	</button>

	<div
		class="grid transition-[grid-template-rows] duration-200 ease-in-out {expanded
			? 'grid-rows-[1fr]'
			: 'grid-rows-[0fr]'}"
	>
		<div class="overflow-hidden">
			{#if expanded}
				<div class="pt-2">
					{@render children()}
				</div>
			{/if}
		</div>
	</div>
</div>
