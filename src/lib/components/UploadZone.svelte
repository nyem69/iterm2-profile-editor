<script lang="ts">
	import type { ITerm2ProfilesFile, ITerm2Profile } from '$lib/types/profile';
	import { Button } from '$lib/components/ui/button/index.js';
	import Upload from '@lucide/svelte/icons/upload';
	import { toast } from 'svelte-sonner';

	let { onload }: { onload: (data: ITerm2ProfilesFile) => void } = $props();

	let dragging = $state(false);
	let error = $state('');
	let fileInput = $state<HTMLInputElement | null>(null);

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

				const allProfiles: ITerm2Profile[] = json.Profiles;
				const validProfiles = allProfiles.filter(
					(p: any) => typeof p.Name === 'string' && p.Name.length > 0
				);
				const skipped = allProfiles.length - validProfiles.length;

				if (validProfiles.length === 0) {
					error = 'No valid profiles found. Profiles must have a Name.';
					return;
				}

				if (skipped > 0) {
					toast.warning(`Skipped ${skipped} profile${skipped > 1 ? 's' : ''} without a name.`);
				}

				onload({ Profiles: validProfiles });
				toast.success(`Loaded ${validProfiles.length} profile${validProfiles.length > 1 ? 's' : ''}.`);
			} catch {
				error = 'Invalid JSON file. Please upload a valid iTerm2 profiles JSON.';
			}
			if (fileInput) fileInput.value = '';
		};
		reader.readAsText(file);
	}

	function handleFileChange(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) processFile(file);
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
		aria-label="Upload iTerm2 profiles JSON file"
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
				onchange={handleFileChange}
			/>
			{#if error}
				<p class="text-sm text-destructive">{error}</p>
			{/if}
		</div>
	</div>
</div>
