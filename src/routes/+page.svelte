<script lang="ts">
	import { profileStore } from '$lib/stores/profiles.svelte';
	import UploadZone from '$lib/components/UploadZone.svelte';
	import ProfileList from '$lib/components/ProfileList.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { ITerm2ProfilesFile } from '$lib/types/profile';

	let hasLocalData = $state(false);

	$effect(() => {
		// Check localStorage on mount
		if (typeof window !== 'undefined') {
			hasLocalData = localStorage.getItem('iterm2-profile-editor') !== null;
		}
	});

	function handleLoad(data: ITerm2ProfilesFile) {
		profileStore.load(data);
	}

	function handleRestore() {
		profileStore.restoreFromLocalStorage();
	}

	function handleClear() {
		profileStore.clearLocalStorage();
		hasLocalData = false;
	}
</script>

{#if profileStore.profiles.length === 0}
	<div class="flex flex-col items-center justify-center py-8">
		<UploadZone onload={handleLoad} />

		{#if hasLocalData}
			<div class="mt-6 w-full max-w-md rounded-lg border bg-muted/50 px-6 py-4 text-center">
				<p class="text-sm font-medium">You have previously saved profiles</p>
				<p class="mt-1 text-xs text-muted-foreground">Would you like to restore them?</p>
				<div class="mt-3 flex items-center justify-center gap-3">
					<Button variant="default" size="sm" onclick={handleRestore}>
						Restore
					</Button>
					<Button variant="outline" size="sm" onclick={handleClear}>
						Clear
					</Button>
				</div>
			</div>
		{/if}
	</div>
{:else}
	<ProfileList />
{/if}
