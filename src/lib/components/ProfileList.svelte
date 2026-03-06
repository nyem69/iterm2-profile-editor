<script lang="ts">
	import { goto } from '$app/navigation';
	import { profileStore } from '$lib/stores/profiles.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import TerminalPreview from './TerminalPreview.svelte';
	import TagGroup from './TagGroup.svelte';
	import BulkActions from './BulkActions.svelte';
	import Search from '@lucide/svelte/icons/search';
	import Plus from '@lucide/svelte/icons/plus';
	import Download from '@lucide/svelte/icons/download';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';

	let hasSelection = $derived(profileStore.selectedIds.size > 0);

	// Track expanded state per tag
	let expandedTags = $state<Record<string, boolean>>({});
	let allExpanded = $derived.by(() => {
		const tags = [...profileStore.grouped.keys()];
		return tags.length > 0 && tags.every((tag) => expandedTags[tag]);
	});

	// Initialize default expanded state when groups change
	$effect(() => {
		for (const tag of profileStore.grouped.keys()) {
			if (!(tag in expandedTags)) {
				expandedTags[tag] = tag === 'Terminal Defaults';
			}
		}
	});

	function toggleAll() {
		const newState = !allExpanded;
		for (const tag of profileStore.grouped.keys()) {
			expandedTags[tag] = newState;
		}
	}

	function handleAdd() {
		const guid = profileStore.add();
		goto(`/profile/${guid}`);
	}

	function handleTagChange(value: string | undefined) {
		profileStore.filterTag = value === '__all__' ? null : (value ?? null);
	}

	let selectValue = $derived(profileStore.filterTag ?? '__all__');
</script>

<!-- Toolbar -->
<div class="sticky top-14 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
	<div class="container px-4 py-3">
		<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
			<!-- Search -->
			<div class="relative flex-1">
				<Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Search profiles..."
					class="pl-9"
					value={profileStore.searchQuery}
					oninput={(e: Event) => {
						profileStore.searchQuery = (e.target as HTMLInputElement).value;
					}}
				/>
			</div>

			<!-- Tag filter -->
			<Select.Root type="single" value={selectValue} onValueChange={handleTagChange}>
				<Select.Trigger class="w-full sm:w-[180px]">
					{#if profileStore.filterTag}
						{profileStore.filterTag}
					{:else}
						All Tags
					{/if}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="__all__" label="All Tags" />
					{#each profileStore.allTags as tag}
						<Select.Item value={tag} label={tag} />
					{/each}
				</Select.Content>
			</Select.Root>

			<!-- Actions -->
			<div class="flex items-center gap-2">
				<Button variant="outline" size="sm" onclick={toggleAll} title={allExpanded ? 'Collapse all' : 'Expand all'}>
					<ChevronsUpDown class="size-4" />
				</Button>
				<Button variant="outline" size="sm" onclick={handleAdd}>
					<Plus class="size-4" />
					<span class="hidden sm:inline">Add Profile</span>
				</Button>
				<Button variant="outline" size="sm" onclick={() => profileStore.downloadJSON()}>
					<Download class="size-4" />
					<span class="hidden sm:inline">Download JSON</span>
				</Button>
			</div>

			<!-- Count -->
			<span class="text-sm text-muted-foreground">
				{profileStore.filtered.length} profile{profileStore.filtered.length !== 1 ? 's' : ''}
			</span>
		</div>
	</div>
</div>

<!-- Profile grid -->
<div class="container px-4 py-6" class:pb-24={hasSelection}>
	{#if profileStore.filtered.length === 0}
		<div class="flex items-center justify-center py-16 text-muted-foreground">
			<p>No profiles match your search</p>
		</div>
	{:else}
		{#each [...profileStore.grouped.entries()] as [tag, profiles]}
			<TagGroup {tag} count={profiles.length} bind:expanded={expandedTags[tag]}>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each profiles as profile (profile.Guid)}
						<TerminalPreview
							{profile}
							selected={profileStore.selectedIds.has(profile.Guid)}
							onselect={() => profileStore.toggleSelect(profile.Guid)}
							onclick={() => goto(`/profile/${profile.Guid}`)}
							oncopy={() => profileStore.copy(profile.Guid)}
						/>
					{/each}
				</div>
			</TagGroup>
		{/each}
	{/if}
</div>

<!-- Bulk Actions: sticky bottom bar -->
{#if hasSelection}
	<BulkActions />
{/if}
