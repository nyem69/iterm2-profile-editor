<script lang="ts">
	import type { ITerm2ProfilesFile } from '$lib/types/profile';
	import { Button } from '$lib/components/ui/button/index.js';
	import Upload from '@lucide/svelte/icons/upload';

	let { onload }: { onload: (data: ITerm2ProfilesFile) => void } = $props();

	let dragging = $state(false);
	let error = $state('');
	let fileInput = $state<HTMLInputElement | null>(null);

	$effect(() => {
		if (!fileInput) return;
		const handler = (e: Event) => {
			const input = e.target as HTMLInputElement;
			const file = input.files?.[0];
			if (file) processFile(file);
		};
		fileInput.addEventListener('change', handler);
		return () => fileInput?.removeEventListener('change', handler);
	});

	function processFile(file: File) {
		error = '';
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const json = JSON.parse(e.target?.result as string);
				if (!json.Profiles || !Array.isArray(json.Profiles)) {
					error = 'Invalid file: missing Profiles array.';
					return;
				}
				onload(json as ITerm2ProfilesFile);
			} catch {
				error = 'Invalid JSON file. Please upload a valid iTerm2 profiles JSON.';
			}
		};
		reader.readAsText(file);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		const file = e.dataTransfer?.files[0];
		if (file) processFile(file);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragging = true;
	}

	function handleDragLeave() {
		dragging = false;
	}

</script>

<div class="flex items-center justify-center px-4 py-16">
	<div
		class="w-full max-w-md rounded-lg border-2 border-dashed p-12 text-center transition-colors {dragging
			? 'border-primary bg-primary/5 border-solid'
			: 'border-muted-foreground/25 hover:border-muted-foreground/50'}"
		role="button"
		tabindex="0"
		ondrop={handleDrop}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
	>
		<div class="flex flex-col items-center gap-4">
			<div class="rounded-full bg-muted p-4">
				<Upload class="size-8 text-muted-foreground" />
			</div>
			<div>
				<p class="text-lg font-medium">Drop your iTerm2 profiles JSON here</p>
				<p class="mt-1 text-sm text-muted-foreground">or click Browse to select a file</p>
			</div>
			<Button variant="outline" onclick={() => fileInput?.click()}>
				Browse
			</Button>
			<input
				bind:this={fileInput}
				type="file"
				accept=".json"
				class="hidden"
			/>
			{#if error}
				<p class="text-sm text-destructive">{error}</p>
			{/if}
		</div>
	</div>
</div>
